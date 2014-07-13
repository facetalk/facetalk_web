var app = angular.module('facetalk', ['ionic']);

app.config(function($stateProvider,$urlRouterProvider){
    $stateProvider.state('index',{
        url:'/index',
        templateUrl:'index.html'
    }).state('home',{
        url:'/home',
        templateUrl:'template/home.html'
    }).state('history',{
        url:'/history',
        templateURL:'template/history.html'
    }).state('setting',{
        url:'/setting',
        templateUrl:'template/setting.html'
    })

    $urlRouterProvider.otherwise("/index");
})
