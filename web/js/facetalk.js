var app = angular.module('facetalk', ['ionic']);
var _$ = function(id){
    return document.getElementById(id);
}

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
        getConnection:function(jid,i){
            var connected = $ionicXmpp.connected,i = i || 0,self = this;
            if(connected){
                $ionicXmpp.connection.send($msg({type:'chat',to:jid + '@facetalk'}).c('body').t('status'));
            }else{
                if(i == 10){
                    $ionicTip.show('连接超时,请稍后重试');
                }else{
                    setTimeout(function(){
                        self.getConnection(jid,++i)
                    },500);
                }
            }
        },
        canChat:function(jid,login,unlogin){
            if(this.islogin){
                $http.get('/api/pay/getCount/rose/' + jid).success(function(data){
                    var amount = data.productAmount;
                    if(amount >= 0){
                        login();
                    }else{
                        $ionicTip.show('账户余额不足，请先充值');
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
app.factory('$ionicXmpp',function($http,$state,$ionicPopup){
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
                con.send($pres());
                con.addHandler(function(message){
                    self.message.call(self,message)
                    return true;
                },null,'message','chat');
            }else{
            }
        },
        message:function(message){
            console.log(message);
            var con = this.connection,from = message.getAttribute('from'),f_jid = from.split('@')[0],signal = message.childNodes[0].innerHTML,status = document.getElementById('detail-status'),btn = document.getElementById('detail-btn');
            var msg = $msg({type:'chat',to:from}).c('body');

            if(signal == 'status'){//握手状态
                if(this.busy) con.send(msg.t('busy'));
                else con.send(msg.t('free'));
            }else if(signal == 'busy'){
                status.innerHTML = '繁忙'
                btn.setAttribute('disabled','disabled');
            }else if(signal == 'free'){
                status.innerHTML = '空闲'
                btn.removeAttribute('disabled');
            }
            if(signal == 'video'){//请求视频
                $ionicPopup.confirm({
                    title:'提示信息',
                    template:'<div class="row request"><div class="col col-33 col-center"><img src="/avatar/' + f_jid + '.png"/></div><div class="col col-67">' + f_jid + '请求和您进行视频聊天，是否同意</div></div>',
                    okText:'同意',
                    cancelText:'拒绝'
                }).then(function(res){
                    if(res){
                        con.send(msg.t('ok'))
                        location.hash = '/tab/chat/' + from.split('@')[0];
                    }else{
                        con.send(msg.t('no'))
                    }
                })
            }else if(signal == 'ok'){
                _$('status-info').innerHTML = '对方同意了您的视频请求,正在建立连接 ...'
            }else if(signal == 'no'){
                _$('status-info').innerHTML = '对方拒绝您的视频请求 ...'
            }

            return true;
        }
    }
})
//Video
app.factory('$ionicVideo',function($http,$ionicNavBarDelegate,$ionicLoading,$ionicUser,$ionicXmpp){
    var self = this;
    return {
        stream:null,
        loadVideo:function(){
            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
            navigator.getUserMedia({video:true,audio:false}, function(stream){
                var video = document.getElementById("face");
                window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
                video.src = window.URL.createObjectURL(stream);
                self.stream = stream;
            },function(error){});
        },
        take:function(){
            var videoStream = self.stream,video = document.getElementById('face'),take = document.getElementById('take'),choose = document.getElementById('choose');
            if(!videoStream) return;
            video.pause();
            take.className = 'hidden';
            choose.className = 'row';
        },
        choose:function(callback){
            var video = document.getElementById('face'),canvas = document.createElement('canvas'),name = $ionicUser.info.username;
            canvas.width = '300';
            canvas.height = '300';
            var ctx = canvas.getContext('2d'),para;
            ctx.drawImage(video,0,0,300,300);

            para = 'username=' + name + '&picData=' + encodeURIComponent(canvas.toDataURL());
            $http.post('/api/user/savePic',para).success(function(data){
                var status = data.status;
                if(status == 'success'){
                    self.stream.stop();
                    $ionicLoading.hide();
                    $ionicUser.complete = true;
                    $ionicXmpp.bind.call($ionicXmpp,name);
                    if(callback && typeof callback == 'function') callback();
                }else{
                    $ionicLoading.show({template:data.desc});
                    setTimeout(function(){
                        $ionicLoading.hide();
                    })
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
            var jid = opts.jid,roomid,isCaller = false,vid,self = this;
            var con = $ionicXmpp.connection,m_jid = $ionicUser.info.username;
            if(!con || !jid){
                $ionicTip.show('连接失败,请退出重试')
                return;
            }
            
            if(jid.charAt(0) == '@'){//请求某人
                isCaller = true;
                jid = jid.substring(1);
                con.send($msg({type:'chat',to:jid + '@facetalk'}).c('body').t('video'));
                roomid = m_jid + '_' + jid;
            }else{//同意请求
                roomid = jid + '_' + m_jid;
            }

            var webrtc = new SimpleWebRTC({
                localVideoEl:'local',
                remoteVideosEl:'remote',
                autoRequestMedia:true
            });
            webrtc.on('readyToCall', function () {
                $ionicXmpp.busy = true;
                webrtc.joinRoom(roomid);
            });
            webrtc.on('videoAdded',function(){
                if(!isCaller) return;
                //记录聊天开始
                $http.get('/api/pay/chatRecord/begin/' + roomid.replace('_','/')).success(function(data){
                    vid = data.id;
                }).error(function(){
                })
            }) 
            webrtc.on('videoRemoved',function(){
                //离开
                _$('status-info').innerHTML = '对方终止了聊天，请返回 ...'
                if(vid){//记录结束时间，并结算
                    $http.get('/api/pay/chatRecord/end/' + vid);
                    $http.get('/api/pay/chatTransaction/' + vid);
                }
            })

            return webrtc;
        },
        cancelRTC:function(webrtc){
            webrtc.stopLocalVideo();
            webrtc.leaveRoom();
            $ionicXmpp.busy = false;
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
        }
    })
    
    //HOME页
    $stateProvider.state('tabs.home',{
        url:'/home',
        views:{
            'tab-home':{
                templateUrl:'template/home.html',
                controller:function($scope,$http,$ionicUser){
                    var info = $ionicUser.info;
                    $http.get('/xmpp/get/allonline').success(function(data){
                        if(/\s*null\s*/.test(data)) return;
                        var arr = data.split(','),items = [];
                        for(var i = 0; i < arr.length; i++){
                            var jid = arr[i],username = jid.split('@')[0];
                            if(info && username == info.username) continue;
                            items.push({jid:jid,username:username})
                        }
                        $scope.items = items;
                    })
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
                }
            }
        }
    }).state('tabs.regist',{
        url:'/regist',
        views:{
            'tab-home':{
                templateUrl:'template/regist.html',
                controller:function($scope,$ionicNavBarDelegate,$state,$ionicUser){
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
                }
            }
        }
    }).state('tabs.take',{
        url:'/take',
        views:{
            'tab-home':{
                templateUrl:'template/take.html',
                controller:function($scope,$state,$ionicUser,$ionicVideo){
                    var name = $ionicUser.info.username;
                    if(!name) $state.go('tabs.login');
                    $scope.taking = $ionicVideo.take;
                    $scope.choose = function(){
                        $ionicVideo.choose(function(){
                            $state.go('tabs.home');
                        })
                    }
                    $scope.reset = $ionicVideo.reset;
                    $ionicVideo.loadVideo();//开启视频
                }
            }
        }
    }).state('tabs.detail',{
        url:'/detail/:jid',
        views:{
            'tab-home':{
                templateUrl:'template/detail.html',
                controller:function($stateParams,$scope,$http,$state,$ionicUser){
                    var jid = ($scope.username = $stateParams.jid);
                    if($ionicUser.isLogin){
                        $ionicUser.getConnection(jid)//等待连接
                    }else{
                        _$('detail-status').innerHTML = '在线';
                        _$('detail-btn').removeAttribute('disabled');
                    }
                    $http.get('/api/user/get/' + jid).success(function(data){//获取用户信息
                        $scope.info = data;
                    }).error(function(){
                    })
                    $scope.chat = function(){
                        $ionicUser.canChat(jid,function(){
                            $state.go('tabs.chat',{jid:'@' + jid});
                        },function(){
                            $state.go('tabs.login');
                        })
                    }
                }
            }
        }
    }).state('tabs.chat',{
        url:'/chat/:jid',
        views:{
            'tab-home':{
                templateUrl:'template/chat.html',
                controller:function($scope,$stateParams,$ionicVideo,$ionicNavBarDelegate,$ionicXmpp){
                    $scope.status = '正在建立连接(请点击允许访问您的摄像设备) ...'
                    webrtc = $ionicVideo.initRTC($stateParams);
                    $scope.back = function(){
                        $ionicVideo.cancelRTC(webrtc)
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
                }
            },
        }
    }).state('tabs.history.regist',{
        url:'/regist',
        views:{
            'history':{
                templateUrl:'template/regist.html',
                controller:function($scope,$ionicNavBarDelegate,$state,$ionicUser){
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
                }
            }
        }
    }).state('tabs.history.take',{
        url:'/take',
        views:{
            'history':{
                templateUrl:'template/take.html',
                controller:function($scope,$state,$ionicUser,$ionicVideo){
                    var name = $ionicUser.info.username;
                    if(!name) $state.go('tabs.history.login');
                    $scope.taking = $ionicVideo.take;
                    $scope.choose = function(){
                        $ionicVideo.choose(function(){
                            $state.go('tabs.history.main');
                        })
                    }
                    $scope.reset = $ionicVideo.reset;
                    $ionicVideo.loadVideo();//开启视频
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
                    $http.get('/api/pay/getChatRecords/' + info.username + '/0/10').success(function(data){
                        for(var i = 0; i < data.length; i++){
                            var d = data[i],name = d.partnerUserName,type = d.callType,date = new Date(d.beginTime);
                            data[i]['img'] = '/avatar/' + name + '.png';
                            data[i]['type'] = type == 'called' ? '呼入':'呼出';
                            data[i]['date'] = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDay();
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
                    $ionicUser.getConnection(jid)//等待连接
                    $http.get('/api/user/get/' + jid).success(function(data){//获取用户信息
                        $scope.info = data;
                    }).error(function(){
                    })
                    $scope.chat = function(){
                        $ionicUser.canChat(jid,function(){
                            $state.go('tabs.history.chat',{jid:'@' + jid});
                        },function(){
                            $state.go('tabs.history.login');
                        })
                    }
                }
            }
        }
    }).state('tabs.history.chat',{
        url:'/chat/:jid',
        views:{
            'history':{
                templateUrl:'template/chat.html',
                controller:function($scope,$stateParams,$ionicVideo,$ionicNavBarDelegate,$ionicXmpp){
                    $scope.status = '正在建立连接(请点击允许访问您的摄像设备) ...'
                    webrtc = $ionicVideo.initRTC($stateParams);
                    $scope.back = function(){
                        $ionicVideo.cancelRTC(webrtc)
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
                }
            },
        }
    }).state('tabs.setting.regist',{
        url:'/regist',
        views:{
            'setting':{
                templateUrl:'template/regist.html',
                controller:function($scope,$ionicNavBarDelegate,$state,$ionicUser){
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
                }
            }
        }
    }).state('tabs.setting.take',{
        url:'/take',
        views:{
            'setting':{
                templateUrl:'template/take.html',
                controller:function($scope,$state,$ionicUser,$ionicVideo){
                    var name = $ionicUser.info.username;
                    if(!name) $state.go('tabs.setting.login');
                    $scope.taking = $ionicVideo.take;
                    $scope.choose = function(){
                        $ionicVideo.choose(function(){
                            $state.go('tabs.setting.main');
                        })
                    }
                    $scope.reset = $ionicVideo.reset;
                    $ionicVideo.loadVideo();//开启视频
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
                        $scope.count = data.count;
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
    chat:function(){
    },
    valid:{
        msgs:{
            emailRequired:'邮箱地址不能为空',
            email:'请输入正确的邮箱地址',
            pwdRequired:'请输入密码',
            pwd:'',
            nameRequired:'用户名不能为空',
            name:'请输入正确的用户名'
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
                msg = msgs.name;
            }else if(pwd.$invalid){
                msg = msgs.pwdRequired;
            }
            $ionicTip.show(msg)
        }
    }
}
