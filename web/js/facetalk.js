var app = angular.module('facetalk', ['ionic']);
var _$ = function(id){
    return document.getElementById(id);
}

location.hash = '/tab/home';

app.config(function($httpProvider){
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
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
            userinfo:function($ionicUser,$cookie){
                var name = $cookie.get('_fh_username');
                if(name) return $ionicUser.getInfo(name);
            }
        },
        controller:function($scope,$ionicNavBarDelegate,$ionicXmpp,$ionicTip){
            $scope.select = function(hash){
                if($ionicXmpp.status != 0){
                    $ionicTip.show('您正在视频通话，请点击左上角结束后再切换菜单').timeout();
                }else{
                    location.hash = hash;
                }
            }
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
                controller:function($rootScope,$scope,$ionicLoading,$ionicXmpp,$ionicClient,$ionicNotice){
                    $scope.redict = !$rootScope.isLogin ? '#/tab/login': (!$rootScope.isComplete ? '#/tab/take' : '');
                    $scope.askNotice = function(){
                        $ionicNotice.init();//桌面通知
                    }
                    
                    if(!$ionicClient.supportVideo){
                        var msg = '';
                        if($ionicClient.isIOS){
                            msg = '目前脸呼暂不支持IOS系统';
                        }else{
                            if($ionicClient.isPC){
                                var link = $ionicClient.isMAC ? 'http://rj.baidu.com/soft/detail/25718.html' : 'http://rj.baidu.com/soft/detail/14744.html';
                                msg = '目前脸呼仅支持Chrome和Firefox浏览器,我们建议您使用最新版的Chrome浏览器,<a class="link" target="_blank" href="' + link + '">点击下载Chrome浏览器</a>';
                            }else{
                                msg = '目前脸呼仅支持Chrome和Firefox浏览器,我们建议您使用最新版的Chrome浏览器';
                            }
                        }
                        $ionicLoading.show({template:msg})
                    }

                    $scope.doRefresh = function(){
                        $ionicXmpp.online();
                    }
                }
            }
        }
    }).state('tabs.login',{
        url:'/login',
        views:{
            'tab-home':{
                templateUrl:'template/login.html'
            }
        }
    }).state('tabs.regist',{
        url:'/regist',
        views:{
            'tab-home':{
                templateUrl:'template/regist.html'
            }
        }
    }).state('tabs.take',{
        url:':router/take',
        views:{
            'tab-home':{
                templateUrl:'template/take.html'
            }
        }
    }).state('tabs.detail',{
        url:'/detail/:jid',
        views:{
            'tab-home':{
                templateUrl:'template/detail.html',
            }
        }
    }).state('tabs.chat',{
        url:'/chat/:roomid',
        views:{
            'tab-home':{
                templateUrl:'template/chat.html'
            }
        }
    })


    //history通话记录页
    $stateProvider.state('tabs.history',{
        url:'/history',
        views:{
            'tab-history':{
                template:'<ion-nav-bar class="bar-positive"></ion-nav-bar><ion-nav-view name="history"></ion-nav-view>',
                controller:function($rootScope,$state,$ionicTip){
                    if($rootScope.isLogin){
                        if($rootScope.isComplete){
                            $state.go('tabs.history.main');
                        }else{
                            $state.go('tabs.history.take');
                        }
                    }else{
                        $ionicTip.show('请先登录 ...').timeout();
                        $state.go('tabs.history.login');
                    }
                }
            }
        }
    }).state('tabs.history.login',{
        url:'/login',
        views:{
            'history':{
                templateUrl:'template/login.html'
            },
        }
    }).state('tabs.history.regist',{
        url:'/regist',
        views:{
            'history':{
                templateUrl:'template/regist.html'
            }
        }
    }).state('tabs.history.take',{
        url:':router/take',
        views:{
            'history':{
                templateUrl:'template/take.html'
            }
        }
    }).state('tabs.history.main',{
        url:'/main',
        views:{
            'history':{
                templateUrl:'template/history.html',
                controller:function($rootScope,$scope,$http,$ionicTip){
                    var info = $rootScope.userInfo,base = 0,offset = 10;
                    $scope.hasMore = true;
                    $scope.loadMore = function(){
                        $http.get('/api/pay/getChatRecords/' + info.username + '/' + base + '/' + offset).success(function(data){
                            var l = data.length
                            if(l){
                                for(var i = 0; i < l; i++){
                                    var d = data[i],name = d.partnerUserName,type = d.callType,date = d.beginTime;
                                    data[i]['img'] = '/avatar/' + name + '.40.png';
                                    data[i]['type'] = type == 'called' ? '呼入':'呼出';
                                    data[i]['date'] = date;
                                }

                                if(!$scope.items){
                                    $scope.items = data;
                                }else{
                                    $scope.items = $scope.items.concat(data);
                                }

                                if(l == offset){
                                    base += 10;
                                    $scope.hasMore = true;
                                    $scope.$broadcast('scroll.infiniteScrollComplete');
                                }else{
                                    $scope.hasMore = false;
                                }
                                
                            }else{
                                $scope.hasMore = false;
                            }
                        }).error(function(){
                        })
                    }
                }
            }
        }
    }).state('tabs.history.detail',{
        url:'/detail/:jid',
        views:{
            'history':{
                templateUrl:'template/detail.html'
            }
        }
    }).state('tabs.history.chat',{
        url:'/chat/:roomid',
        views:{
            'history':{
                templateUrl:'template/chat.html'
            }
        }
    })


    //setting个人设置页
    $stateProvider.state('tabs.setting',{
        url:'/setting',
        views:{
            'tab-setting':{
                template:'<ion-nav-bar class="bar-positive"></ion-nav-bar><ion-nav-view name="setting"></ion-nav-view>',
                controller:function($rootScope,$state,$ionicTip){
                    if($rootScope.isLogin){
                        if($rootScope.isComplete){
                            $state.go('tabs.setting.main');
                        }else{
                            $state.go('tabs.setting.take');
                        }
                    }else{
                        $ionicTip.show('请先登录 ...').timeout();
                        $state.go('tabs.setting.login');
                    }
                }
            }
        }
    }).state('tabs.setting.login',{
        url:'/login',
        views:{
            'setting':{
                templateUrl:'template/login.html'
            },
        }
    }).state('tabs.setting.regist',{
        url:'/regist',
        views:{
            'setting':{
                templateUrl:'template/regist.html'
            }
        }
    }).state('tabs.setting.take',{
        url:':router/take',
        views:{
            'setting':{
                templateUrl:'template/take.html'
            }
        }
    }).state('tabs.setting.main',{
        url:'/main',
        views:{
            'setting':{
                templateUrl:'template/setting.html',
                controller:function($rootScope,$scope,$http,$state,$cookie,$ionicXmpp){
                    var info = $rootScope.userInfo;
                    info.img = '/avatar/' + info.username + '.100.png?' + new Date().getTime();
                    $scope.info = info;
                    $http.get('/api/pay/getCount/rose/' + info.username).success(function(data){
                        $scope.info.count = data.productAmount;
                    })
                    $scope.logout = function(){
                        $cookie.remove('_fh_username');
                        $ionicXmpp.connection.disconnect();
                        $ionicXmpp.connection = null;

                        $rootScope.userInfo = null;
                        $rootScope.isLogin = false;
                        $rootScope.isComplete = false;

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
    })

    $urlRouterProvider.otherwise('/tab/home');
})
