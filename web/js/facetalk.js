var app = angular.module('facetalk', ['ionic']);

app.config(function($stateProvider,$urlRouterProvider){
    $stateProvider.state('index',{
        url:'/index',
        templateUrl:'index.html'
    }).state('home',{
        url:'/home',
        templateUrl:'template/home.html'
    }).state('login',{
        url:'/login',
        templateUrl:'template/login.html'
    })

    $urlRouterProvider.otherwise("/index");
})
