app.controller('loginCtrl',function($rootScope,$scope,$ionicUser,$validor,$state){
    var current = $state.current.name,router = (/history/.test(current) ? '/history' : (/setting/.test(current) ? '/setting' :''));
    $scope.regist = '#/tab' + router + '/regist';

    $scope.login = function(form,user){
        if(form.$valid){
            $ionicUser.login(user.loginEmail,user.loginPassword,function(){
                if($rootScope.isComplete){
                    if(router == ''){
                        $state.go('tabs.home');
                    }else{
                        router = router.replace('/','.');
                        $state.go('tabs' + router + '.main')
                    }
                }else{
                    $state.go('tabs' + router + '.take')
                }
            })
        }else{
            $validor.login(form);
        }
    }
    $scope.submit = function(event,form,user){
        var keyCode = event.keyCode || event.which;
        if(keyCode == 13) $scope.login(form,user);
    }
})

app.controller('registCtrl',function($scope,$ionicUser,$state,$validor){
    var current = $state.current.name,router = (/history/.test(current) ? '/history' : (/setting/.test(current) ? '/setting' :''));
    $scope.next = function(form,user){
        if(form.$valid){
            $ionicUser.regist(user.name,user.password,user.email,function(){
                if(router != '') router = router.replace('/','.');
                $state.go('tabs' + router + '.take')
            })
        }else{
            $validor.regist(form);
        }
    }
    $scope.submit = function(event,form,user){
        var keyCode = event.keyCode || event.which;
        if(keyCode == 13) $scope.next(form,user);
    }
})

app.controller('takeCtrl',function($scope,$state,$ionicVideo,$ionicNavBarDelegate,$ionicTip){
    var current = $state.current.name,router = (/history/.test(current) ? '/history' : (/setting/.test(current) ? '/setting' :''));
    $scope.taking = function(){$ionicVideo.take.call($ionicVideo)};
    $scope.choose = function(){
        $ionicVideo.choose.call($ionicVideo,function(){
            if(router != ''){
                router = router.replace('/','.');
                $state.go('tabs' + router + '.main');
            }else{
                $state.go('tabs.home');
            }
        })
    }
    $scope.reset = $ionicVideo.reset;
    $scope.back = function(){
        if($ionicVideo.stream) $ionicVideo.stream.stop();
        $ionicNavBarDelegate.back();
    }
    $ionicVideo.loadVideo.call($ionicVideo);//开启视频
    $ionicTip.show('亲，请将摄像头对准您的面部，确保自拍头像清晰。非本人头像会被系统删除哦。');

})

app.controller('detailCtrl',function($rootScope,$scope,$stateParams,$http,$ionicXmpp,$ionicTip){
    var my_jid = $rootScope.userInfo.username,jid = ($scope.username = $stateParams.jid),nick = $rootScope.userInfo.name;
    //判断当前用户是不是自己
    if(jid == my_jid){
        $scope.status = '自己'
        return;
    }else{
        //判断当前用户是否在线
        $http.get('/xmpp/user/status/' + jid + '@facetalk/xml').success(function(data){
            if(/chat/.test(data)){
                $scope.status = '空闲';
                $scope.canChat = true;
            }else if(/dnd/.test(data)){
                $scope.status = '通话中';
            }else if(/(?:error|unavailable)/.test(data)){
                $scope.status = '不在线';
            }
        })
        $http.get('/api/user/get/' + jid).success(function(data){//获取用户信息
            $scope.info = data;
        }).error(function(){})
    }
    $scope.chat = function(){
        var con = $ionicXmpp.connection;
        $http.get('/api/pay/getCount/rose/' + jid).success(function(data){
            var amount = data.productAmount,price = $scope.info.price || 0;
            if(amount >= price){
                con.send($msg({type:'chat',to:jid + '@facetalk',nick:nick}).c('body').t('video'));
                con.send($pres().c('show').t('dnd'));
                $ionicXmpp.status = 1;

                $ionicTip.show('正在发送视频请求，请稍后 ...','false').timeout(20000,function(){
                    $ionicTip.show('对方没有响应，连接超时，请稍后重试 ...').timeout(5000);

                    con.send($msg({type:'chat',to:jid + '@facetalk',nick:nick}).c('body').t('timeout'));//发送等待超时信号
                    con.send($pres().c('show').t('chat'));
                    $ionicXmpp.status = 0;
                });
            }else{
                $ionicTip.show('您的玫瑰数量不足，请先购买玫瑰').timeout();
            }
        })
    }
})

app.controller('chatCtrl',function($scope,$stateParams,$ionicVideo,$ionicTip,$ionicXmpp,$timeout){
    $ionicTip.hide();//终止视频请求时等待的超时请求

    $ionicVideo.initRTC($stateParams);

    $ionicTip.show('正在建立连接,请点击允许访问您的摄像设备 ...').timeout(30000,function(){//如果30秒后还如法建立连接
        $ionicTip.show('建立连接超时,请刷新页面或点击左上角结束 ...');
    });

    $scope.close = function(){
        $ionicXmpp.connection.send($pres().c('show').t('chat'));
        $ionicXmpp.status = 0;

        $ionicTip.hide();
        $ionicVideo.cancelRTC();
    }
})
