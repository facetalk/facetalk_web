var app = angular.module('facetalk', ['ionic']);

var items = [
    {'name':'张三MM','img':'images/0.jpg'},
    {'name':'李四','img':'images/1.jpg'},
    {'name':'王五大姑娘','img':'images/2.jpg'},
    {'name':'赵四夫人','img':'images/3.jpg'},
    {'name':'杨七妹子','img':'images/4.jpg'},
    {'name':'八婆娘','img':'images/5.jpg'},
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
                templateUrl:'template/home.html'
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
    }).state('login',{
        url:'/login',
        templateUrl:'template/login.html',
        controller:'login'
    }).state('tabs.editing',{
        url:'/editing',
        views:{
            'tab-setting':{
                templateUrl:'template/editing.html',
                controller:'editing'
            }
        }
    }).state('tabs.resetpwd',{
        url:'/resetpwd',
        views:{
            'tab-setting':{
                templateUrl:'template/resetpwd.html',
                controller:'reset'
            }
        }
    })

    $urlRouterProvider.otherwise('/index');
})

app.controller('history',function($scope){
    $scope.items = items
})

app.controller('login',function($scope,$ionicNavBarDelegate){
    $scope.back = function(){
        $ionicNavBarDelegate.back();
    }
})
app.controller('editing',function($scope,$ionicNavBarDelegate){
    $scope.back = function(){
        $ionicNavBarDelegate.back();
    }
})
app.controller('reset',function($scope,$ionicNavBarDelegate){
    $scope.back = function(){
        $ionicNavBarDelegate.back();
    }
})

