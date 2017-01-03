
var appControllers = angular.module('appControllers',['ui.bootstrap','appServices'])
	.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return  input.slice(start);
    };
});


appControllers.controller('menuBarController', 
    ['$scope','$rootScope','$location','$cookieStore','userFactory', '$window',
    function($scope,$rootScope,$location,$cookieStore,userFactory,$window){
    
    
    //alert('from cookies ' + $cookieStore.get('isLogin'));
    //alert('from rootscope ' + $rootScope.isLogin);
    //$scope.isLoginMenu=$rootScope.isLogin;
    //$rootScope.isLogin=false;
    
    $scope.namaLogin="Sign in as ";
    $scope.statusOption={ 
        open:false
    };
    $scope.visibleUser=true;

    $scope.$watch('isLogin',function(newVal,oldVal, scope){
        //console.log("is login " + oldVal + '  berubah  ' + newVal ); 
        if(newVal===true){
            //alert($rootScope.globals.currentUser.username);
            $scope.namaLogin= "Login as [" + $rootScope.globals.currentUser.username + "]";                
            //$scope.namaLogin=$cookieStore.globals.currentUser.username;                
            userFactory
                .isAdmin($rootScope.globals.currentUser.username)
                .success(function(data){
                    $scope.visibleUser=data;                    
                })
            
        }else{
            $scope.namaLogin="Logout ";
        }
        // if(newVal!==oldVal){
        //     //console.log(oldVal + '  berubah  ' + newVal );  
        // }
    })

    $scope.keluar=function(){
        $scope.statusOption.open=false;
        //$location.path('#/login');
        $window.location = "#/bukuBesar";
    }

    //var isAlreadyLogin = $cookieStore.get('isLogin');

    // var isAlreadyLogin = $rootScope.isLogin;    

    // // alert('from variable '+ isAlreadyLogin);
    
    // $scope.authMasterDirektorat=false; 
    // // if(isAlreadyLogin===true){
    // //     alert('login true');
    // // }
    // if(isAlreadyLogin===true){
    //     userFactory
    //         .getUserById($rootScope.globals.currentUser.authdata)
    //         .success(function(data){
    //             $scope.authMasterDirektorat=data.authMasterDirektorat;
    //             alert('masukk');
    //         });
    // }else{
    //     alert('Anda belum login !!');
    //     //$location.path('/login').replace();
    //     window.location = "#/login";   
    // }
    

}])


