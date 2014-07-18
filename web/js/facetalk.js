var app = angular.module('facetalk', ['ionic']);

var items = [
    {'name':'张三MM','img':'images/0.jpg'},
    {'name':'李四','img':'images/1.jpg'},
    {'name':'王五大姑娘','img':'images/2.jpg'},
    {'name':'赵四夫人','img':'images/3.jpg'},
    {'name':'杨七妹子','img':'images/4.jpg'},
    {'name':'八婆娘','img':'images/5.jpg'},
    {'name':'张三MM','img':'images/0.jpg'},
    {'name':'李四','img':'images/1.jpg'},
    {'name':'王五大姑娘','img':'images/2.jpg'}
]

app.config(function($stateProvider,$urlRouterProvider){
    $stateProvider.state('index',{
        url:'/index',
        templateUrl:'index.html'
    }).state('tabs',{
        url:'/tab',
        templateUrl:'template/tabs.html'
    }).state('tabs.home',{
        url:'/home',
        views:{
            'tab-home':{
                templateUrl:'template/home.html',
                controller:'homeCtr'
            }
        }
    }).state('tabs.detail',{
        url:'/detail',
        views:{
            'tab-home':{
                templateUrl:'template/detail.html',
                controller:'detail'
            }
        }
    }).state('tabs.history',{
        url:'/history',
        views:{
            'tab-history':{
                templateUrl:'template/history.html',
                controller:'history'
            }
        }
    }).state('tabs.detail-history',{
        url:'/detail-history',
        views:{
            'tab-history':{
                templateUrl:'template/detail.html',
                controller:'detail'
            }
        }
    }).state('tabs.setting',{
        url:'/setting',
        views:{
            'tab-setting':{
                templateUrl:'template/setting.html',
                controller:'setting'
            }
        }
    }).state('tabs.editing',{
        url:'/editing',
        views:{
            'tab-setting':{
                templateUrl:'template/editing.html'
            }
        }
    }).state('tabs.resetpwd',{
        url:'/resetpwd',
        views:{
            'tab-setting':{
                templateUrl:'template/resetpwd.html'
            }
        }
    })

    $urlRouterProvider.otherwise('/index');
})

app.controller('history',function($scope){
    $scope.items = items
})

app.controller('homeCtr',function($scope,$ionicModal){
    $scope.items = items;
    $scope.loadMore = function(){
    }
    $ionicModal.fromTemplateUrl('template/login.html', {
        scope: $scope,
        animation:'slide-in-right'
    }).then(function(modal){
        $scope.modal_login = modal;
    })
    $scope.login = function(){
        $scope.modal_login.show();
    }
})
app.controller('login',function($scope){
    $scope.back = function(){
        $scope.modal_login.hide();
    }
})

app.controller('setting',function($scope,$ionicModal){
    $ionicModal.fromTemplateUrl('template/buy.html', {
        scope: $scope,
        animation:'slide-in-right'
    }).then(function(modal){
        $scope.modal = modal;
    })
    $scope.buy = function(){
        $scope.modal.show();
    }
}) 
app.controller('buy',function($scope,$ionicPopup){
    $scope.back = function(){
        $scope.modal.hide();
    }
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
})
app.controller('detail',function($scope,$ionicModal){
    //注册
    $ionicModal.fromTemplateUrl('template/regist.html', {
        scope: $scope,
        animation:'slide-in-right'
    }).then(function(modal){
        $scope.modal_regist = modal;
    })
    //登陆
    $ionicModal.fromTemplateUrl('template/login.html', {
        scope: $scope,
        animation:'slide-in-right'
    }).then(function(modal){
        $scope.modal_login = modal;
    })
    //聊天
    $ionicModal.fromTemplateUrl('template/chat.html', {
        scope: $scope,
        animation:'slide-in-right'
    }).then(function(modal){
        $scope.modal_chat = modal;
    })

    $scope.chat = function(){
        $scope.modal_chat.show();
        //开启视频
        startVideo()
    }
    $scope.regist = function(){
        $scope.modal_regist.show();
    }
    $scope.login = function(){
        $scope.modal_login.show();
    }
})

app.controller('chat',function($scope){
    $scope.back = function(){
        $scope.modal_chat.hide();
    }
})
app.controller('regist',function($scope){
    $scope.back = function(){
        $scope.modal_regist.hide();
    }
})


var abc
function startVideo() {
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    abc = navigator.getUserMedia({video: true, audio:true}, mediaSuccess, mediaFail);
}
function mediaSuccess(userMedia) {
    window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
    var video = document.getElementById("local");
    video.src = window.URL.createObjectURL(userMedia);
    document.getElementById('chat-devider').innerHTML = '初始化成功，正在通话...';
}
function mediaFail(error) {
    alert('视频设备初始化失败:' + error.code)
}
