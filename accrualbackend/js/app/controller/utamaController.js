
var appControllers = angular.module('appControllers',['ui.bootstrap','appServices'])
	.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return  input.slice(start);
    };
});


appControllers.controller('menuBarController', ['$scope','$rootScope','$location','$cookieStore','userFactory', '$window',
    function($scope,$rootScope,$location,$cookieStore,userFactory,$window){
    
    
    //alert('from cookies ' + $cookieStore.get('isLogin'));
    //alert('from rootscope ' + $rootScope.isLogin);
    //$scope.isLoginMenu=$rootScope.isLogin;
    //$rootScope.isLogin=false;
    
    $scope.namaLogin="Sign in as ";
    $scope.statusOption={ 
        open:false
    }

    $scope.$watch('isLogin',function(newVal,oldVal, scope){
        if(newVal!==oldVal){
            //alert(oldVal + '  berubah  ' + newVal );  
            if(newVal===true){
                //alert($rootScope.globals.currentUser.username);
                $scope.namaLogin=$rootScope.globals.currentUser.username;                
                //$scope.namaLogin=$cookieStore.globals.currentUser.username;                
            }
        }
    })

    $scope.keluar=function(){
        $scope.statusOption.open=false;
        //$location.path('#/login');
        $window.location = "#/login";
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

appControllers.controller('index2Controller', ['$scope','growl','AuthenticationService','$location','$rootScope','userFactory', function($scope,growl,AuthenticationService,$location,$rootScope,userFactory){
	
	$scope.userId='';
	$scope.password='';
	AuthenticationService.ClearCredentials();
    $rootScope.isLogin=false;
    
	// $rootScope.isLogin=false;
	$scope.login = function () {        
		
        // AuthenticationService.Login($scope.userId, $scope.password, function (response) {
        //     if (response.success) {
        //         AuthenticationService.SetCredentials($scope.userId, $scope.password);
        //         //alert('direct')      
        //         $rootScope.isLogin=true;          
        //         $location.path('#/');
        //     } else {
        //     	//alert('error login');                
        //     	growl.addErrorMessage('error login');
        //         // $scope.error = response.message;                
        //     }
        // });

        // AuthenticationService.SetCredentials(0, 'testing');
        // $rootScope.isLogin=true;          
        // $location.path('#/'); 
        
        // return true;

        AuthenticationService
            .loginAuth($scope.userId, $scope.password)
            .success(function(data){
                growl.addWarnMessage(data);
                //  alert('isi = ['+data+']');
                if ( data==true) {
                    var idUser=0 ; 
                    userFactory
                        .getIdByUserName($scope.userId)
                        .success(function(data){
                            // idUser=data;
                            AuthenticationService.SetCredentials($scope.userId, data);
                           //alert('direct')      
                            $rootScope.isLogin=true;          
                            $location.path('#/'); 
                            //$scope.parent.isLoginMenu=true;                           
                        });
                    
                } else {
                    //alert('error login');                
                    growl.addErrorMessage('Invalid user or password ');
                    // $scope.error = response.message;                
                }    
            })
            .error(function(data){
                growl.addWarnMessage('Error get Auth from Server !' );       
            })

    };

	
}])

