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
                templateUrl:'template/detail.html'
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
    }).state('tabs.setting',{
        url:'/setting',
        views:{
            'tab-setting':{
                templateUrl:'template/setting.html'
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
        animation:'slide-in-up'
    }).then(function(modal){
        $scope.modal = modal;
    })
    $scope.login = function(){
        $scope.modal.show();
    }
})

app.controller('login',function($scope){
    $scope.back = function(){
        $scope.modal.hide();
    }
})
