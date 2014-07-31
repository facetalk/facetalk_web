var app = angular.module('facetalk', ['ionic']);

app.config(function($httpProvider){
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
})

var items = [
    {'name':'张三MM','img':'images/0.jpg','jid':'user'},
    {'name':'李四','img':'images/1.jpg','jid':'user'},
    {'name':'王五大姑娘','img':'images/2.jpg','jid':'user'},
    {'name':'赵四夫人','img':'images/3.jpg','jid':'user'},
    {'name':'杨七妹子','img':'images/4.jpg','jid':'user'},
    {'name':'八婆娘','img':'images/5.jpg','jid':'user'},
    {'name':'张三MM','img':'images/0.jpg','jid':'user'},
    {'name':'李四','img':'images/1.jpg','jid':'user'},
    {'name':'王五大姑娘','img':'images/2.jpg','jid':'user'}
]

app.config(function($stateProvider,$urlRouterProvider){
    //首页
    $stateProvider.state('index',{
        url:'/index',
        templateUrl:'index.html'
    })
    //TAB结构页
    $stateProvider.state('tabs',{
        url:'/tab',
        templateUrl:'template/tabs.html',
        resolve:{//只在第一次访问的时候执行，其他时候不调用
            userinfo:function($http){
                var name = facetalk.user.name;
                //如果存在用户Cookie，则请求用户信息,如果失效则删除cookie,facetalk.user.name和$scope.loginBtn设为空
                if(name) return facetalk.getInfo($http,name);
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
                controller:function($scope,$http){
                    $http.get('/xmpp/get/allonline').success(function(data){
                        if(/\s*null\s*/.test(data)) return;
                        var arr = data.split(','),items = [],info = facetalk.user.info;
                        for(var i = 0; i < arr.length; i++){
                            var jid = arr[i],username = jid.split('@')[0];
                            if(info && username == info.username) continue;
                            items.push({jid:jid,username:username})
                        }
                        $scope.items = items;
                    })
                    $scope.hasLogin = function(){
                        var info = facetalk.user;
                        if(info.complete){
                            return false;
                        }else{
                            if(info.login){
                                $scope.loginUrl = '#/tab/photos';
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
                controller:function($scope,$ionicNavBarDelegate,$http,$state){
                    $scope.regist = '#/tab/regist';
                    $scope.login = function(form,user){
                        if(form.$valid){
                            var para = 'loginEmail=' + user.loginEmail + '&loginPassword=' + user.loginPassword;
                            $http.post('/login',para).success(function(data){
                                var username = user.loginEmail.replace(/[@\.]/g,'_');
                                facetalk.getInfo($http,username,function(){
                                    if(facetalk.user.complete){
                                        $state.go('tabs.home');
                                    }else{
                                        $state.go('tabs.photos');
                                    }
                                });
                            }).error(function(){
                            })
                        }else{
                            $scope.showLoginValidation = true;
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
                controller:function($scope,$http,$state){
                    $scope.next = function(form,user){
                        if(form.$valid){
                            var para = 'name=' + user.name + '&password=' + user.password + '&email=' + user.email;
                            $http.post('/api/user/register',para).success(function(data){
                                facetalk.user.name = user.email.replace(/[@\.]/g,'_');
                                //自动登录
                                $http.post('/login','loginEmail=' + user.email + '&loginPassword=' + user.password).success(function(data){
                                    facetalk.user.login = true;
                                });
                                $state.go('tabs.photos')
                            }).error(function(){
                            })
                        }else{
                            $scope.showRegistValidation = true;
                        }
                    }
                }
            }
        }
    }).state('tabs.photos',{
        url:'/photos',
        views:{
            'tab-home':{
                templateUrl:'template/photos.html',
                controller:function($scope){
                    $scope.photos = '#/tab/take';
                }
            }
        }
    }).state('tabs.take',{
        url:'/take',
        views:{
            'tab-home':{
                templateUrl:'template/take.html',
                controller:function($scope,$http,$state){
                    $scope.taking = facetalk.pic.take;
                    $scope.choose = function(){
                        facetalk.pic.choose($http,function(){
                            facetalk.pic.stream.stop();
                            $state.go('tabs.home');
                        })
                    }
                    $scope.reset = facetalk.pic.reset;
                    facetalk.pic.loadVideo();//开启视频
                }
            }
        }
    }).state('tabs.detail',{
        url:'/detail/:jid',
        views:{
            'tab-home':{
                templateUrl:'template/detail.html',
                controller:function($stateParams,$scope,$http,$state){
                    var jid = ($scope.username = $stateParams.jid),con = facetalk.con;
                    if(!con) return;
                    con.send($msg({type:'chat',to:jid + '@facetalk'}).c('body').t('status'));
                    $http.get('/xmpp/user/status/' + $stateParams.jid + '@facetalk/xml').success(function(data){
                        if(data.indexOf('type="unavailable"') > -1){
                            $scope.status = '不在线';
                        }else{
                            $scope.status = '在线';
                        }
                    })
                    $scope.chat = function(){
                        if(facetalk.user.login){
                            $state.go('tabs.chat',{jid:'@' + jid});
                        }else{
                            $state.go('tabs.login');
                        }
                    }
                }
            }
        }
    }).state('tabs.chat',{
        url:'/chat/:jid',
        views:{
            'tab-home':{
                templateUrl:'template/chat.html',
                controller:function($scope,$stateParams,$ionicNavBarDelegate){
                    var jid = ($scope.username = $stateParams.jid),roomid;
                    var con = facetalk.con,m_jid = facetalk.user.name;
                    $scope.status = '正在建立连接 ...'
                    if(!con){
                        $scope.status = '连接失败 ...'
                        return;
                    }
                    if(jid.charAt(0) == '@'){//请求某人
                        jid = jid.substring(1);
                        con.send($msg({type:'chat',to:jid + '@facetalk'}).c('body').t('video'));
                        roomid = jid + '_' + m_jid;
                    }else{//同意请求
                        roomid = m_jid + '_' + jid;
                    }

                    var webrtc = new SimpleWebRTC({
                        localVideoEl:'local',
                        remoteVideosEl:'remote',
                        autoRequestMedia:true
                    });
                    webrtc.on('readyToCall', function () {
                        facetalk.user.isTalking = true;
                        webrtc.joinRoom(roomid);
                    });
                    $scope.back = function(){
                        webrtc.leaveRoom();
                        webrtc.stopLocalVideo();
                        facetalk.user.isTalking = false;
                        $ionicNavBarDelegate.back();
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
                controller:function($state,userinfo){
                    if(facetalk.user.login){
                        if(facetalk.user.complete){
                            $state.go('tabs.history.main');
                        }else{
                            $state.go('tabs.history.photos');
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
                controller:function($scope,$http,$state){
                    $scope.showBack = false;
                    $scope.regist = '#/tab/history/regist';
                    $scope.login = function(form,user){
                        if(form.$valid){
                            var para = 'loginEmail=' + user.loginEmail + '&loginPassword=' + user.loginPassword;
                            $http.post('/login',para).success(function(data){
                                var username = user.loginEmail.replace(/[@\.]/g,'_');
                                facetalk.getInfo($http,username,function(){
                                    if(facetalk.user.complete) $state.go('tabs.history.main');
                                    else $state.go('tabs.history.photos');
                                });
                            }).error(function(){
                            })
                        }else{
                            $scope.showLoginValidation = true;
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
                controller:function($scope,$http,$state){
                    $scope.next = function(form,user){
                        if(form.$valid){
                            var para = 'name=' + user.name + '&password=' + user.password + '&email=' + user.email;
                            $http.post('/api/user/register',para).success(function(data){
                                facetalk.user.name = user.email.replace(/[@\.]/g,'_');
                                //自动登录
                                $http.post('/login','loginEmail=' + user.email + '&loginPassword=' + user.password).success(function(data){
                                    facetalk.user.login = true;
                                });
                                $state.go('tabs.history.photos')
                            }).error(function(){
                            })
                        }else{
                            $scope.showRegistValidation = true;
                        }
                    }
                }
            }
        }
    }).state('tabs.history.photos',{
        url:'/photos',
        views:{
            'history':{
                templateUrl:'template/photos.html',
                controller:function($scope){
                    $scope.photos = '#/tab/history/take';
                }
            }
        }
    }).state('tabs.history.take',{
        url:'/take',
        views:{
            'history':{
                templateUrl:'template/take.html',
                controller:function($scope,$http,$state){
                    $scope.taking = facetalk.pic.take;
                    $scope.choose = function(){
                        facetalk.pic.choose($http,function(){
                            facetalk.pic.stream.stop();
                            $state.go('tabs.history.main');
                        })
                    }
                    $scope.reset = facetalk.pic.reset;
                    facetalk.pic.loadVideo();//开启视频
                }
            }
        }
    }).state('tabs.history.main',{
        url:'/main',
        views:{
            'history':{
                templateUrl:'template/history.html',
                controller:function($scope){
                    $scope.items = items
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
                controller:function($state){
                    if(facetalk.user.login){
                        if(facetalk.user.complete){
                            $state.go('tabs.setting.main');
                        }else{
                            $state.go('tabs.setting.photos');
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
                controller:function($scope,$http,$state){
                    $scope.showBack = false;
                    $scope.regist = '#/tab/setting/regist';
                    $scope.login = function(form,user){
                        if(form.$valid){
                            var para = 'loginEmail=' + user.loginEmail + '&loginPassword=' + user.loginPassword;
                            $http.post('/login',para).success(function(data){
                                var username = user.loginEmail.replace(/[@\.]/g,'_');
                                facetalk.getInfo($http,username,function(){
                                    if(facetalk.user.complete) $state.go('tabs.setting.main');
                                    else $state.go('tabs.setting.photos');
                                });
                            }).error(function(){
                            })
                        }else{
                            $scope.showLoginValidation = true;
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
                controller:function($scope,$http,$state){
                    $scope.next = function(form,user){
                        if(form.$valid){
                            var para = 'name=' + user.name + '&password=' + user.password + '&email=' + user.email;
                            $http.post('/api/user/register',para).success(function(data){
                                facetalk.user.name = user.email.replace(/[@\.]/g,'_');
                                //自动登录
                                $http.post('/login','loginEmail=' + user.email + '&loginPassword=' + user.password).success(function(data){
                                    facetalk.user.login = true;
                                });
                                $state.go('tabs.setting.photos')
                            }).error(function(){
                            })
                        }else{
                            $scope.showRegistValidation = true;
                        }
                    }
                }
            }
        }
    }).state('tabs.setting.photos',{
        url:'/photos',
        views:{
            'setting':{
                templateUrl:'template/photos.html',
                controller:function($scope){
                    $scope.photos = '#/tab/setting/take';
                }
            }
        }
    }).state('tabs.setting.take',{
        url:'/take',
        views:{
            'setting':{
                templateUrl:'template/take.html',
                controller:function($scope,$http,$state){
                    $scope.taking = facetalk.pic.take;
                    $scope.choose = function(){
                        facetalk.pic.choose($http,function(){
                            facetalk.pic.stream.stop();
                            $state.go('tabs.setting.main');
                        })
                    }
                    $scope.reset = facetalk.pic.reset;
                    facetalk.pic.loadVideo();//开启视频
                }
            }
        }
    }).state('tabs.setting.main',{
        url:'/main',
        views:{
            'setting':{
                templateUrl:'template/setting.html',
                controller:function($scope,$http,$state){
                    var info = facetalk.user.info;
                    $scope.info = info;
                    $http.get('/api/pay/getCount/rose/' + info.username).success(function(data){
                        $scope.count = data.count;
                    })
                    $scope.logout = function(){
                        Storage.cookie.remove('_fh_username');
                        facetalk.user = {};
                        facetalk.con.disconnect();
                        facetalk.con = null;
                        $state.go('tabs.setting.login');
                    }
                }
            }
        }
    }).state('tabs.setting.editing',{
        url:'/editing',
        views:{
            'setting':{
                templateUrl:'template/editing.html'
            }
        }
    }).state('tabs.setting.buy',{
        url:'/buy',
        views:{
            'setting':{
                templateUrl:'template/buy.html',
                controller:function($scope,$ionicPopup){
                    $scope.check = function(){
                        $ionicPopup.confirm({
                            title:'提示信息',
                            cancelText:'付款出现问题',
                            okText:'付款成功'
                        }).then(function(res){
                            if(res){
                                alert('检测是否真的付款')
                            }else{
                                alert('没成功')
                            }
                        })
                    }
                }
            }
        }
    }).state('tabs.setting.resetpwd',{
        url:'/resetpwd',
        views:{
            'setting':{
                templateUrl:'template/resetpwd.html'
            }
        }
    })

    $urlRouterProvider.otherwise('/index');
})

var facetalk = {
    user:{
        name:Storage.cookie.get('_fh_username'),
        xmpp:null,
        info:null,
        login:false,//登录成功，不包含是否存在图像
        complete:false//登录成功且资料完整
    },
    getInfo:function($http,name,fn){
        return $http.get('/api/user/get/' + name).success(function(data){
            facetalk.user.info = data;
            facetalk.user.login = true;
            if(data.infoCompleteness){
                facetalk.user.complete = true;
                //开始连接XMPP Server
                $http.get('/api/user/loginForXmpp/' + name).success(function(data){
                    var con = (facetalk.con = new Strophe.Connection('http://107.170.51.17/http-bind'));
                    facetalk.user.xmpp = data;
                    con.attach(data.jid,data.sid,data.rid,facetalk.connecting)
                })
            }
            if(fn) fn();
        })
    },
    pic:{
        stream:null,
        loadVideo:function(){
            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
            navigator.getUserMedia({video:true,audio:false}, function(stream){
                var video = document.getElementById("face");
                window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
                video.src = window.URL.createObjectURL(stream);
                facetalk.pic.stream = stream;
            },function(error){});
        },
        take:function(){
            var videoStream = facetalk.pic.stream,video = document.getElementById('face'),take = document.getElementById('take'),choose = document.getElementById('choose');
            if(!videoStream) return;
            video.pause();
            take.className = 'hidden';
            choose.className = 'row';
        },
        choose:function($http,callback){
            var video = document.getElementById('face'),canvas = document.createElement('canvas'),name = facetalk.user.name;
            if(!name) return;
            canvas.width = '300';
            canvas.height = '300';
            var ctx = canvas.getContext('2d'),para;
            ctx.drawImage(video,0,0,300,300);

            para = 'username=' + name + '&picData=' + encodeURIComponent(canvas.toDataURL());
            $http.post('/api/user/savePic',para).success(function(data){
                facetalk.getInfo($http,name,callback)
            })
        },
        reset:function(){
            var video = document.getElementById('face'),take = document.getElementById('take'),choose = document.getElementById('choose');
            choose.className = 'hidden';
            take.className = '';
            video.play();
        }
    },
    connecting:function(status){
        //登录xmpp成功
        if(status == Strophe.Status.ATTACHED){
            var con = facetalk.con;
            facetalk.con.send($pres());
            con.addHandler(facetalk.msg,null,'message','chat');
        }
    },
    msg:function(message){
        console.log(message)
        var con = facetalk.con,from = message.getAttribute('from'),signal = message.childNodes[0].innerHTML;
        var msg = $msg({type:'chat',to:from}).c('body');
        var status = document.getElementById('detail-status'),btn = document.getElementById('detail-btn')
        if(!con) return;
        //是否处于繁忙状态
        if(signal == 'status'){
            if(facetalk.user.isTalking) con.send(msg.t('busy'));
            else con.send(msg.t('free'));
        }else if(signal == 'busy'){
            status.innerHTML = '在线状态：繁忙'
            btn.setAttribute('disabled','disabled');
        }else if(signal == 'free'){
            status.innerHTML = '在线状态：空闲'
            btn.removeAttribute('disabled');
        }
        //是否同意视频
        if(signal == 'video'){
            if(confirm(from + '请求和您进行视频聊天，是否同意')){
                con.send(msg.t('ok'))
                location.hash = '/tab/chat/' + from.split('@')[0];
            }else{
                con.send(msg.t('no'))
            }
        }else if(signal == 'ok'){
        }else if(signal == 'no'){
        }

        return true;
    },
    loadVideo:function(success){
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
        navigator.getUserMedia({video:true,audio:false}, success, function(error){});
    }
}
