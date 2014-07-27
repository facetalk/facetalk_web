var app = angular.module('facetalk', ['ionic']);

app.config(function($httpProvider){
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
})

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
    $scope.loginBtn = facetalk.user.name ? '':'登录';
    $scope.loadMore = function(){
    }
    $ionicModal.fromTemplateUrl('template/login.html', {
        scope: $scope,
        animation:'slide-in-right'
    }).then(function(modal){
        $scope.modal_login = modal;
    })
    $scope.showLogin = function(){
        $scope.modal_login.show();
    }
})

app.controller('login',function($scope,$ionicModal,$http){
    $ionicModal.fromTemplateUrl('template/regist.html', {
        scope: $scope,
        animation:'slide-in-right'
    }).then(function(modal){
        $scope.modal_regist = modal;
    })

    $scope.back = function(){
        $scope.modal_login.hide();
    }
    $scope.login = function(form,user){
        if(form.$valid){
            var para = 'loginEmail=' + user.loginEmail + '&loginPassword=' + user.loginPassword;
            $http.post('/login',para).success(function(data){
                var username = user.loginEmail.replace(/[@\.]/g,'_');
                $http.get('/api/user/loginForXmpp/' + username).success(function(data){
                })
            }).error(function(){
            })
        }else{
            $scope.showLoginValidation = true;
        }
    }
    $scope.regist = function(){
        $scope.modal_regist.show();
    }
})
app.controller('regist',function($scope,$ionicModal,$http){
    //拍照
    $ionicModal.fromTemplateUrl('template/photos.html', {
        scope: $scope,
        animation:'slide-in-right'
    }).then(function(modal){
        $scope.modal_photos = modal;
    })
    $scope.back = function(){
        $scope.modal_regist.hide();
    }
    $scope.next = function(form,user){
        if(form.$valid){
            var para = 'name=' + user.name + '&password=' + user.password + '&email=' + user.email;
            $http.post('/api/user/register',para).success(function(data){
                $scope.username = user.email.replace(/[@\.]/g,'_');
            }).error(function(){
            })
            $scope.modal_photos.show();;
        }else{
            $scope.showRegistValidation = true;
        }
    }
})
app.controller('photos',function($scope,$ionicModal){
    $ionicModal.fromTemplateUrl('template/take.html', {
        scope: $scope,
        animation:'slide-in-right'
    }).then(function(modal){
        $scope.modal_take = modal;
    })
    $scope.back = function(){
        $scope.modal_login.hide();
        $scope.modal_regist.hide();

        $scope.modal_photos.hide();
    }
    $scope.take = function(){
        $scope.modal_take.show();
        facetalk.loadVideo(function(stream){
            var video = document.getElementById("face");
            window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
            video.src = window.URL.createObjectURL(stream);
            $scope.stream = stream;
        })
    }
})
app.controller('take',function($scope,$http){
    $scope.back = function(){
        $scope.stream.stop();
        webrtc = null;
        $scope.modal_take.hide();
    }
    $scope.taking = function(){
        var video = document.getElementById('face'),take = document.getElementById('take'),choose = document.getElementById('choose');
        video.pause();
        take.className = 'hidden';
        choose.className = 'row';
    }
    $scope.choose = function(){
        var video = document.getElementById('face'),canvas = document.createElement('canvas');
        canvas.width = '300';
        canvas.height = '300';
        var ctx = canvas.getContext('2d'),para;
        ctx.drawImage(video,0,0,300,300);

        para = 'username=' + $scope.username + '&picData=' + encodeURIComponent(canvas.toDataURL());
        $http.post('/api/user/savePic',para).success(function(data){
            $scope.modal_login.hide();
            $scope.modal_regist.hide();
            $scope.modal_photos.hide();

            $scope.back();
        })
    }
    $scope.reset = function(){
        var video = document.getElementById('face'),take = document.getElementById('take'),choose = document.getElementById('choose');
        choose.className = 'hidden';
        take.className = '';
        video.play();
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
        var webrtc = new SimpleWebRTC({
            localVideoEl:'local',
            remoteVideosEl:'remote',
            autoRequestMedia:true
        });
        webrtc.on('readyToCall', function () {
            webrtc.joinRoom('test');
        });
        $scope.webrtc = webrtc;
    }
})

app.controller('chat',function($scope){
    $scope.back = function(){
        $scope.webrtc.leaveRoom();
        $scope.webrtc.stopLocalVideo();
        $scope.modal_chat.hide();
    }
})

var facetalk = {
    user:{
        name:Storage.cookie.get('_fh_username')
    },
    loadVideo:function(success){
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
        navigator.getUserMedia({video:true,audio:false}, success, function(error){});
    }
}

