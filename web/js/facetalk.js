var app = angular.module('facetalk', ['ionic']);
var _$ = function(id){
    return document.getElementById(id);
}

location.hash = '/tab/home';

app.config(function($httpProvider){
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
})

//信息提示
app.factory('$ionicTip',function($ionicLoading,$timeout){
    return {
        show:function(msg){
            $ionicLoading.show({template:msg,noBackdrop:true})
            $timeout(function(){
                $ionicLoading.hide();
            },1500)
        }
    }
})
//登录注册
app.factory('$ionicUser',function($http,$ionicTip,$ionicXmpp){
    return {
        info:null,
        islogin:false,
        complete:false,
        getInfo:function(name,callback){
            var self = this;
            return $http.get('/api/user/get/' + name).success(function(data){
                self.info = data;
                self.islogin = true;
                if(data.infoCompleteness){
                    self.complete = true;
                    $ionicXmpp.bind.call($ionicXmpp,data.username);
                }
                if(callback && typeof callback == 'function') callback();
            })
        },
        status:function(jid){
            $http.get('/xmpp/user/status/' + jid + '@facetalk/xml').success(function(data){
                try{//可能在非detail页调用这个接口判断用户状态,这时页面没有status，btn
                    var status = _$('detail-status'),btn = _$('detail-btn');
                    if(/chat/.test(data)){
                        $ionicXmpp.busy = false;
                        status.innerHTML = '空闲';
                        btn.removeAttribute('disabled');
                    }else if(/dnd/.test(data)){
                        $ionicXmpp.busy = true;
                        status.innerHTML = '繁忙';
                    }else if(/(?:error|unavailable)/.test(data)){
                        status.innerHTML = '不在线';
                    }
                }catch(e){}
            })
        },
        canChat:function(jid,login,unlogin){
            if(this.islogin){
                $http.get('/api/pay/getCount/rose/' + jid).success(function(data){
                    var amount = data.productAmount,price = _$('price') ? parseInt(_$('price').innerHTML) : 0;
                    if(amount >= price){
                        login();
                    }else{
                        $ionicTip.show('您的玫瑰数量不足，请先购买玫瑰');
                    }
                })
            }else{
                unlogin();
            }
        },
        login:function(email,pwd,callback){
            var para = 'loginEmail=' + email + '&loginPassword=' + pwd,self = this;
            $http.post('/login',para).success(function(data){
                var status = data.status;
                if(status == 'success'){//登录成功
                    var username = data.username || Storage.cookie.get('_fh_username');
                    self.getInfo(username,callback);
                }else{//登录失败
                    $ionicTip.show(data.desc);
                }
            }).error(function(){
            })
        },
        regist:function(name,pwd,email,callback){
            var para = 'name=' + name + '&password=' + pwd + '&email=' + email,self = this;
            $http.post('/api/user/register',para).success(function(data){
                var status = data.status;
                if(status == 'success'){
                    self.login(email,pwd,callback)//自动登录
                }else{
                    $ionicTip.show(data.desc);
                }
            }).error(function(){
            })
        }
    }
})
//XMPP信息
app.factory('$ionicXmpp',function($http,$state,$ionicPopup,$ionicNavBarDelegate,$timeout,$ionicTip,$ionicLoading){
    return {
        server:'http://42.62.73.61/http-bind',
        xmpp:null,
        connection:null,
        connected:false,
        busy:false,
        bind:function(name){
            var self = this;
            $http.get('/api/user/loginForXmpp/' + name).success(function(data){
                var con = new Strophe.Connection(self.server);
                self.xmpp = data;
                self.connection = con
                con.attach(data.jid,data.sid,data.rid,function(status){
                    self.connecting.call(self,status);
                });
            })
        },
        connecting:function(status){
            if(status == Strophe.Status.ATTACHED){//登录xmpp成功
                var self = this,con = self.connection;
                self.connected = true;
                con.send($pres().c('show').t('chat'));//空闲
                con.addHandler(function(message){
                    self.message.call(self,message)
                    return true;
                },null,'message','chat');
            }else{
            }
        },
        message:function(message){
            console.log(message);
            var con = this.connection,from = message.getAttribute('from'),f_jid = from.split('@')[0],signal = message.childNodes[0].innerHTML,self = this;
            var msg = $msg({type:'chat',to:from}).c('body');

            $ionicLoading.hide();
            if(signal == 'video'){//请求视频
                var nick = message.getAttribute('nick');
                //当两个人同时进入某一MM详细页，此时MM是空闲状态，如果A向MM发起视频切MM同意，之后B若向MM发起视频则此时MM处于繁忙状态，需要直接拒绝
                if(self.busy){
                    $ionicTip.show('对方繁忙，请稍后再试 ...');
                    return;
                }
                $ionicPopup.confirm({
                    title:'提示信息',
                    template:'<div class="row request"><div class="col col-33 col-center"><img src="/avatar/' + f_jid + '.png"/></div><div class="col col-67"><strong>' + nick + '</strong> 请求和您进行视频聊天，是否同意</div></div>',
                    okText:'同意',
                    cancelText:'拒绝'
                }).then(function(res){
                    if(res){
                        var roomid = f_jid + '_' + self.xmpp.jid.split('@')[0];
                        con.send(msg.t('ok'));

                        con.send($pres().c('show').t('dnd'));
                        self.busy = true;

                        $state.go('tabs.chat',{roomid:roomid})
                    }else{
                        self.busy = false;
                        con.send(msg.t('no'))
                    }
                })
            }else if(signal == 'ok'){
                var roomid = self.xmpp.jid.split('@')[0] + '_' + f_jid;
                con.send($pres().c('show').t('dnd'));
                self.busy = true;

                /history/.test(location.hash) ? $state.go('tabs.history.chat',{roomid:roomid}) : $state.go('tabs.chat',{roomid:roomid})
            }else if(signal == 'no'){
                $ionicTip.show('对方拒绝了您的请求');
            }else{
                if(signal == 'PermissionDeniedError'){//对方关闭了摄像头
                    _$('status-info').innerHTML = '对方拒绝开启摄像装备，将无法和对方建立连接，请返回 ...'
                }
            }
        }
    }
})
//Video
app.factory('$ionicVideo',function($http,$ionicNavBarDelegate,$ionicLoading,$ionicUser,$ionicXmpp,$ionicTip,$timeout){
    return {
        stream:null,
        loadVideo:function(){
            var self = this;
            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
            navigator.getUserMedia({video:true,audio:false}, function(stream){
                var video = document.getElementById("face");
                window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
                video.src = window.URL.createObjectURL(stream);
                self.stream = stream;
            },function(error){});
        },
        take:function(){
            var videoStream = this.stream,video = document.getElementById('face'),take = document.getElementById('take'),choose = document.getElementById('choose');
            if(!videoStream) return;
            video.pause();
            take.className = 'hidden';
            choose.className = 'row';
        },
        choose:function(callback){
            var video = document.getElementById('face'),w = video.offsetWidth,h = video.offsetHeight,name = $ionicUser.info.username,self = this;
            var canvas = document.createElement('canvas'),ctx = canvas.getContext('2d');
            canvas.width = 200;
            canvas.height = 260;
            ctx.drawImage(video,-(w-200)/2,0,w,h);

            var para = 'username=' + name + '&picData=' + encodeURIComponent(canvas.toDataURL());
            $http.post('/api/user/savePic',para).success(function(data){
                var status = data.status;
                if(status == 'success'){
                    self.stream.stop();
                    $ionicLoading.show({template:'您的头像已上传成功,即将返回上一页'});
                    $ionicUser.complete = true;
                    if(!$ionicXmpp.connection) $ionicXmpp.bind.call($ionicXmpp,name);
                    //2秒后返回
                    $timeout(function(){
                        $ionicLoading.hide();
                        if(callback && typeof callback == 'function') callback();
                    },2000)
                }else{
                    $ionicLoading.show({template:data.desc});
                }
            }).error(function(){
            })

            $ionicLoading.show({
                template:'<em class="ion-loading-c"></em>&nbsp;&nbsp;正在保存您的资料'
            });
        },
        reset:function(){
            var video = document.getElementById('face'),take = document.getElementById('take'),choose = document.getElementById('choose');
            choose.className = 'hidden';
            take.className = '';
            video.play();
        },
        initRTC:function(opts){
            var roomid = opts.roomid,vid,self = this;
            var con = $ionicXmpp.connection,m_jid = $ionicUser.info.username;
            var webrtc = $ionicXmpp.webrtc;

            if(!webrtc){
                webrtc = ($ionicXmpp.webrtc =  new SimpleWebRTC({
                    url:'http://42.62.73.27:8888',
                    localVideoEl:'local',
                    remoteVideosEl:'remote',
                    //debug:true,
                    autoRequestMedia:true
                }));

                webrtc.on('readyToCall', function () {
                    webrtc.joinRoom(roomid);
                });
                webrtc.on('videoAdded',function(){
                    //假设有视频发起者记录聊天时间
                    if(roomid.indexOf(m_jid) == 0){
                        $http.get('/api/pay/chatRecord/begin/' + roomid.replace('_','/')).success(function(data){
                            vid = data.id;
                        }).error(function(){
                        })
                    }
                    _$('status-info').style.cssText = 'display:none';
                }) 
                webrtc.on('videoRemoved',function(){
                    //离开
                    _$('status-info').innerHTML = '对方终止了聊天 ...'
                    _$('status-info').style.cssText = '';
                    if(vid){//记录结束时间，并结算
                        $http.get('/api/pay/chatRecord/end/' + vid);
                        $http.get('/api/pay/chatTransaction/' + vid);
                    }
                    
                    con.send($pres().c('show').t('chat'));
                    $ionicXmpp.busy = false;
                })
                webrtc.on('localMediaError',function(err){
                    var name = err.name,jid = roomid.replace(m_jid,'').replace('_','');
                    con.send($msg({type:'chat',to:jid + '@facetalk'}).c('body').t(name));
                    if(name == 'PermissionDeniedError'){
                        _$('status-info').innerHTML = '由于您没有开启摄像装置，将无法与对方进行聊天 ...'
                    }

                    con.send($pres().c('show').t('chat'));
                    $ionicXmpp.busy = false;
                })
            }else{
                webrtc.startLocalVideo();
            }
            

            return webrtc;
        },
        cancelRTC:function(){
            var webrtc = $ionicXmpp.webrtc;
            webrtc.stopLocalVideo();
            webrtc.leaveRoom();
            $ionicNavBarDelegate.back();
        }
    }
})

app.config(function($stateProvider,$urlRouterProvider){
    //首页
    $stateProvider.state('index',{
        url:'/index',
        templateUrl:'index.html'
    })

    //TAB
    $stateProvider.state('tabs',{
        url:'/tab',
        templateUrl:'template/tabs.html',
        resolve:{//只在第一次访问的时候执行，其他时候不调用
            userinfo:function($ionicUser){
                var name = Storage.cookie.get('_fh_username');
                if(name) return $ionicUser.getInfo(name);
            }
        },
        controller:function($scope,$ionicNavBarDelegate){
            $scope.back = function(){
                $ionicNavBarDelegate.back();
            }
            $scope.isPC = facetalk.isPC();
            $scope.supportVideo = facetalk.supportVideo();
        }
    })
    
    //HOME页
    $stateProvider.state('tabs.home',{
        url:'/home',
        views:{
            'tab-home':{
                templateUrl:'template/home.html',
                controller:function($scope,$http,$ionicUser,$ionicLoading){
                    var info = $ionicUser.info,islogin = $ionicUser.islogin;
                    
                    //未登录显示推广头像
                    if(islogin){
                        $http.get('/xmpp/get/allonline').success(function(data){
                            if(/\s*null\s*/.test(data)) return;
                            var arr = data.split(','),items = [];
                            for(var i = 0; i < arr.length; i++){
                                var jid = arr[i],username = jid.split('@')[0];
                                items.push({jid:jid,username:username})
                            }
                            $scope.items = items;
                        })
                    }else{
                        $scope.items = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16];
                    }

                    if(!facetalk.supportVideo()){
                        var msg = '';
                        if(facetalk.isMac()){
                            msg = '目前脸呼暂不支持IOS系统';
                        }else{
                            msg = '目前脸呼仅支持Chrome或火狐浏览器';
                        }
                        $ionicLoading.show({template:msg})
                    }

                    $scope.islogin = islogin;
                    $scope.hasLogin = function(){
                        if($ionicUser.complete){
                            return false;
                        }else{
                            if($ionicUser.islogin){
                                $scope.loginUrl = '#/tab/take';
                            }else{
                                $scope.loginUrl = '#/tab/login';
                            }
                            return true;
                        }
                    }
                    $scope.moreDataCanBeLoaded = function(){return false};
                    $scope.loadMore = function(){}
                }
            }
        }
    }).state('tabs.login',{
        url:'/login',
        views:{
            'tab-home':{
                templateUrl:'template/login.html',
                controller:function($scope,$ionicNavBarDelegate,$state,$ionicUser,$ionicTip){
                    if($ionicNavBarDelegate.getPreviousTitle()) $scope.showBack = true;
                    else $scope.showBack = false;

                    $scope.regist = '#/tab/regist';
                    $scope.login = function(form,user){
                        if(form.$valid){
                            $ionicUser.login(user.loginEmail,user.loginPassword,function(){
                                if($ionicUser.complete){
                                    $state.go('tabs.home');
                                }else{
                                    $state.go('tabs.take');
                                }
                            })
                        }else{
                            facetalk.valid.login(form,$ionicTip);
                        }
                    }
                    $scope.submit = function(event,form,user){
                        var keyCode = event.keyCode || event.which;
                        if(keyCode == 13) $scope.login(form,user);
                    }
                }
            }
        }
    }).state('tabs.regist',{
        url:'/regist',
        views:{
            'tab-home':{
                templateUrl:'template/regist.html',
                controller:function($scope,$ionicNavBarDelegate,$state,$ionicUser,$ionicTip){
                    if($ionicNavBarDelegate.getPreviousTitle()) $scope.showBack = true;
                    else $scope.showBack = false;

                    $scope.next = function(form,user){
                        if(form.$valid){
                            $ionicUser.regist(user.name,user.password,user.email,function(){
                                $state.go('tabs.take')
                            })
                        }else{
                            facetalk.valid.regist(form,$ionicTip);
                        }
                    }
                    $scope.submit = function(event,form,user){
                        var keyCode = event.keyCode || event.which;
                        if(keyCode == 13) $scope.next(form,user);
                    }
                }
            }
        }
    }).state('tabs.take',{
        url:'/take',
        views:{
            'tab-home':{
                templateUrl:'template/take.html',
                controller:function($scope,$state,$ionicUser,$ionicVideo,$ionicNavBarDelegate){
                    var name = $ionicUser.info.username;
                    if(!name) $state.go('tabs.login');

                    if($ionicNavBarDelegate.getPreviousTitle()) $scope.showBack = true;
                    else $scope.showBack = false;

                    $scope.taking = function(){$ionicVideo.take.call($ionicVideo)};
                    $scope.choose = function(){
                        $ionicVideo.choose.call($ionicVideo,function(){
                            $state.go('tabs.home');
                        })
                    }
                    $scope.reset = $ionicVideo.reset;
                    $scope.back = function(){
                        $ionicVideo.stream.stop();
                        $ionicNavBarDelegate.back();
                    }
                    $ionicVideo.loadVideo.call($ionicVideo);//开启视频
                }
            }
        }
    }).state('tabs.detail',{
        url:'/detail/:jid',
        views:{
            'tab-home':{
                templateUrl:'template/detail.html',
                controller:function($stateParams,$scope,$http,$state,$ionicUser,$ionicXmpp,$ionicLoading){
                    var jid = ($scope.username = $stateParams.jid);
                    if(jid == $ionicUser.info.username){
                        _$('detail-status').innerHTML = '自己';
                        return;
                    }
                    $ionicUser.status(jid);
                    $http.get('/api/user/get/' + jid).success(function(data){//获取用户信息
                        $scope.info = data;
                    }).error(function(){
                    })
                    $scope.chat = function(){
                        $ionicUser.canChat($ionicUser.info.username,function(){
                            $ionicXmpp.connection.send($msg({type:'chat',to:jid + '@facetalk',nick:$ionicUser.info.name}).c('body').t('video'));
                            $ionicLoading.show({template:'正在发送视频请求，请稍后 ...'});
                        },function(){
                            $state.go('tabs.login');
                        })
                    }
                }
            }
        }
    }).state('tabs.chat',{
        url:'/chat/:roomid',
        views:{
            'tab-home':{
                templateUrl:'template/chat.html',
                controller:function($scope,$stateParams,$ionicVideo,$ionicNavBarDelegate,$ionicXmpp){
                    $ionicVideo.initRTC($stateParams);
                    $scope.back = function(){
                        $ionicXmpp.connection.send($pres().c('show').t('chat'));
                        $ionicXmpp.busy = false;

                        $ionicVideo.cancelRTC();
                    }
                }
            }
        }
    })


    //history通话记录页
    $stateProvider.state('tabs.history',{
        url:'/history',
        views:{
            'tab-history':{
                template:'<ion-nav-bar class="bar-positive"></ion-nav-bar><ion-nav-view name="history"></ion-nav-view>',
                controller:function($state,$ionicUser){
                    if($ionicUser.islogin){
                        if($ionicUser.complete){
                            $state.go('tabs.history.main');
                        }else{
                            $state.go('tabs.history.take');
                        }
                    }else{
                        $state.go('tabs.history.login');
                    }
                }
            }
        }
    }).state('tabs.history.login',{
        url:'/login',
        views:{
            'history':{
                templateUrl:'template/login.html',
                controller:function($scope,$ionicNavBarDelegate,$state,$ionicUser,$ionicTip){
                    $scope.showBack = false;
                    $scope.regist = '#/tab/history/regist';
                    $scope.login = function(form,user){
                        if(form.$valid){
                            $ionicUser.login(user.loginEmail,user.loginPassword,function(){
                                if($ionicUser.complete){
                                    $state.go('tabs.history.main');
                                }else{
                                    $state.go('tabs.history.take');
                                }
                            })
                        }else{
                            facetalk.valid.login(form,$ionicTip);
                        }
                    }
                    $scope.submit = function(event,form,user){
                        var keyCode = event.keyCode || event.which;
                        if(keyCode == 13) $scope.login(form,user);
                    }
                }
            },
        }
    }).state('tabs.history.regist',{
        url:'/regist',
        views:{
            'history':{
                templateUrl:'template/regist.html',
                controller:function($scope,$ionicNavBarDelegate,$state,$ionicUser,$ionicTip){
                    $scope.showBack = true;
                    $scope.next = function(form,user){
                        if(form.$valid){
                            $ionicUser.regist(user.name,user.password,user.email,function(){
                                $state.go('tabs.history.take')
                            })
                        }else{
                            facetalk.valid.regist(form,$ionicTip);
                        }
                    }
                    $scope.submit = function(event,form,user){
                        var keyCode = event.keyCode || event.which;
                        if(keyCode == 13) $scope.next(form,user);
                    }
                }
            }
        }
    }).state('tabs.history.take',{
        url:'/take',
        views:{
            'history':{
                templateUrl:'template/take.html',
                controller:function($scope,$state,$ionicUser,$ionicVideo,$ionicNavBarDelegate){
                    var name = $ionicUser.info.username;
                    if(!name) $state.go('tabs.history.login');

                    if($ionicNavBarDelegate.getPreviousTitle()) $scope.showBack = true;
                    else $scope.showBack = false;

                    $scope.taking = function(){$ionicVideo.take.call($ionicVideo)};
                    $scope.choose = function(){
                        $ionicVideo.choose.call($ionicVideo,function(){
                            $state.go('tabs.history.main');
                        })
                    }
                    $scope.reset = $ionicVideo.reset;
                    $scope.back = function(){
                        $ionicVideo.stream.stop();
                        $ionicNavBarDelegate.back();
                    }
                    $ionicVideo.loadVideo.call($ionicVideo);//开启视频
                }
            }
        }
    }).state('tabs.history.main',{
        url:'/main',
        views:{
            'history':{
                templateUrl:'template/history.html',
                controller:function($scope,$http,$ionicUser){
                    var info = $ionicUser.info;
                    $http.get('/api/pay/getChatRecords/' + info.username + '/0/50').success(function(data){
                        for(var i = 0; i < data.length; i++){
                            var d = data[i],name = d.partnerUserName,type = d.callType,date = d.beginTime;
                            data[i]['img'] = '/avatar/' + name + '.png';
                            data[i]['type'] = type == 'called' ? '呼入':'呼出';
                            data[i]['date'] = date;
                        }
                        $scope.items = data;
                    }).error(function(){
                    })
                }
            }
        }
    }).state('tabs.history.detail',{
        url:'/detail/:jid',
        views:{
            'history':{
                templateUrl:'template/detail.html',
                controller:function($stateParams,$scope,$http,$state,$ionicTip,$ionicUser,$ionicXmpp){
                    var jid = ($scope.username = $stateParams.jid);
                    if(jid == $ionicUser.info.username){
                        _$('detail-status').innerHTML = '自己';
                        return;
                    }
                    $ionicUser.status(jid);
                    $http.get('/api/user/get/' + jid).success(function(data){//获取用户信息
                        $scope.info = data;
                    }).error(function(){
                    })
                    $scope.chat = function(){
                        $ionicUser.canChat($ionicUser.info.username,function(){
                            $ionicXmpp.connection.send($msg({type:'chat',to:jid + '@facetalk',nick:$ionicUser.info.name}).c('body').t('video'));
                        },function(){
                            $state.go('tabs.login');
                        })
                    }
                }
            }
        }
    }).state('tabs.history.chat',{
        url:'/chat/:roomid',
        views:{
            'history':{
                templateUrl:'template/chat.html',
                controller:function($scope,$stateParams,$ionicVideo,$ionicNavBarDelegate,$ionicXmpp){
                    $ionicVideo.initRTC($stateParams);
                    $scope.back = function(){
                        $ionicXmpp.connection.send($pres().c('show').t('chat'));
                        $ionicXmpp.busy = false;

                        $ionicVideo.cancelRTC();
                    }
                }
            }
        }
    })


    //setting个人设置页
    $stateProvider.state('tabs.setting',{
        url:'/setting',
        views:{
            'tab-setting':{
                template:'<ion-nav-bar class="bar-positive"></ion-nav-bar><ion-nav-view name="setting"></ion-nav-view>',
                controller:function($state,$ionicUser){
                    if($ionicUser.islogin){
                        if($ionicUser.complete){
                            $state.go('tabs.setting.main');
                        }else{
                            $state.go('tabs.setting.take');
                        }
                    }else{
                        $state.go('tabs.setting.login');
                    }
                }
            }
        }
    }).state('tabs.setting.login',{
        url:'/login',
        views:{
            'setting':{
                templateUrl:'template/login.html',
                controller:function($scope,$ionicNavBarDelegate,$state,$ionicUser,$ionicTip){
                    $scope.showBack = false;
                    $scope.regist = '#/tab/setting/regist';
                    $scope.login = function(form,user){
                        if(form.$valid){
                            $ionicUser.login(user.loginEmail,user.loginPassword,function(){
                                if($ionicUser.complete){
                                    $state.go('tabs.home');
                                }else{
                                    $state.go('tabs.take');
                                }
                            })
                        }else{
                            facetalk.valid.login(form,$ionicTip);
                        }
                    }
                    $scope.submit = function(event,form,user){
                        var keyCode = event.keyCode || event.which;
                        if(keyCode == 13) $scope.login(form,user);
                    }
                }
            },
        }
    }).state('tabs.setting.regist',{
        url:'/regist',
        views:{
            'setting':{
                templateUrl:'template/regist.html',
                controller:function($scope,$ionicNavBarDelegate,$state,$ionicUser,$ionicTip){
                    $scope.showBack = true;
                    $scope.next = function(form,user){
                        if(form.$valid){
                            $ionicUser.regist(user.name,user.password,user.email,function(){
                                $state.go('tabs.setting.take')
                            })
                        }else{
                            facetalk.valid.regist(form,$ionicTip);
                        }
                    }
                    $scope.submit = function(event,form,user){
                        var keyCode = event.keyCode || event.which;
                        if(keyCode == 13) $scope.next(form,user);
                    }
                }
            }
        }
    }).state('tabs.setting.take',{
        url:'/take',
        views:{
            'setting':{
                templateUrl:'template/take.html',
                controller:function($scope,$state,$ionicUser,$ionicVideo,$ionicNavBarDelegate){
                    var name = $ionicUser.info.username;
                    if(!name) $state.go('tabs.setting.login');

                    if($ionicNavBarDelegate.getPreviousTitle()) $scope.showBack = true;
                    else $scope.showBack = false;

                    $scope.taking = function(){$ionicVideo.take.call($ionicVideo)};
                    $scope.choose = function(){
                        $ionicVideo.choose.call($ionicVideo,function(){
                            $state.go('tabs.setting.main');
                        })
                    }
                    $scope.reset = $ionicVideo.reset;
                    $scope.back = function(){
                        $ionicVideo.stream.stop();
                        $ionicNavBarDelegate.back();
                    }
                    $ionicVideo.loadVideo.call($ionicVideo);//开启视频
                }
            }
        }
    }).state('tabs.setting.main',{
        url:'/main',
        views:{
            'setting':{
                templateUrl:'template/setting.html',
                controller:function($scope,$http,$state,$ionicUser,$ionicXmpp){
                    var info = $ionicUser.info;
                    info.img = '/avatar/' + info.username + '.png?' + new Date().getTime();
                    $scope.info = info;
                    $http.get('/api/pay/getCount/rose/' + info.username).success(function(data){
                        $scope.info.count = data.productAmount;
                    })
                    $scope.logout = function(){
                        Storage.cookie.remove('_fh_username');

                        $ionicXmpp.connection.disconnect();
                        $ionicXmpp.connection = null;
                        $ionicXmpp.connected = false;
                        $ionicXmpp.busy = false;

                        $ionicUser.info = null;
                        $ionicUser.islogin = false;
                        $ionicUser.complete = false;

                        $state.go('tabs.setting.login');
                    }
                }
            }
        }
    }).state('tabs.setting.buyinfo',{
        url:'/buyinfo',
        views:{
            'setting':{
                templateUrl:'template/buyinfo.html'
            }
        }
    }).state('tabs.setting.buy',{
        url:'/buy',
        views:{
            'setting':{
                templateUrl:'template/buy.html',
                controller:function($scope,$http,$state,$ionicPopup,$ionicUser){
                    var info = $ionicUser.info,orderId;
                    var check = function(){
                        $ionicPopup.confirm({
                            title:'提示信息',
                            cancelText:'付款出现问题',
                            okText:'付款成功'
                        }).then(function(res){
                            if(res){
                                $http.get('/api/pay/orderStatus/' + orderId).success(function(data){
                                    var status = data.status
                                    if(status == 2){
                                        $state.go('tabs.setting.main')
                                    }else{
                                    }
                                })
                            }else{
                                alert('没成功')
                            }
                        })
                    }
                    //获取订单号
                    $scope.order = function(amountForm,amount){
                        var para = 'username=' + info.username + '&amount=' + amount + '&product=rose';
                        if(amountForm.buyAmount.$invalid) return;
                        $http.post('/api/pay/createOrder',para).success(function(data){
                            var status = data.status;
                            if(status == 'success'){
                                $scope.orderId = (orderId = data.id);
                                //提示订单情况
                                $ionicPopup.confirm({
                                    title:'提示信息',
                                    template:'亲，您真的要购买' + amount + '只玫瑰吗?<form onsubmit="facetalk.buy(this)" class="popForm" action="/api/pay/alipay" target="_blank" method="post"><input type="hidden" name="orderId" value="' + orderId + '"/><input type="submit" class="button" value=""/></form>',
                                    cancelText:'取消',
                                    okText:'确认'
                                }).then(function(res){
                                    if(res){
                                        check();
                                    }else{
                                        alert('取消付款了')
                                    }
                                })
                            }else{
                            }
                        })
                    }
                    
                }
            }
        }
    })

    $urlRouterProvider.otherwise('/tab/home');
})

var facetalk = {
    buy:function(obj){
        var pop = angular.element(obj).parent().parent();
        var buttons = angular.element(obj).parent().next().children();
        buttons.eq(1).triggerHandler('click');
    },
    isPC:function(){//箭头提示
        var useragent = navigator.userAgent;
        return !(/(?:mobile|android|iphone)/i.test(useragent));
    },
    supportVideo:function(){
        return navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    },
    isMac:function(){
        return /(?:iphone|ipad)/i.test(navigator.userAgent);
    },
    valid:{
        msgs:{
            emailRequired:'邮箱地址不能为空',
            email:'请输入正确的邮箱地址',
            pwdRequired:'请输入密码',
            pwd:'格式错误:请输入6~16位字符,区分大小写',
            nameRequired:'用户名不能为空',
            name:'格式错误:请输入2~18位汉字或英文字符'
        },
        login:function(form,$ionicTip){
            var email = form.loginEmail,pwd = form.loginPassword,msgs = facetalk.valid.msgs,msg;
            if(email.$invalid){
                var errors = email.$error;
                if(errors.required){
                    msg = msgs.emailRequired;
                }else if(errors.email){
                    msg = msgs.email;
                }
            }else if(pwd.$invalid){
                msg = msgs.pwdRequired;
            }
            $ionicTip.show(msg)
        },
        regist:function(form,$ionicTip){
            var email = form.email,pwd = form.password,name = form.name,msgs = facetalk.valid.msgs,msg;
            if(email.$invalid){
                var errors = email.$error;
                if(errors.required){
                    msg = msgs.emailRequired;
                }else if(errors.email){
                    msg = msgs.email;
                }
            }else if(name.$invalid){
                var errors = name.$error;
                if(errors.required){
                    msg = msgs.nameRequired;
                }else{
                    msg = msgs.name;
                }
            }else if(pwd.$invalid){
                var errors = pwd.$error;
                if(errors.required){
                    msg = msgs.pwdRequired;
                }else{
                    msg = msgs.pwd;
                }
            }
            $ionicTip.show(msg)
        }
    }
}
