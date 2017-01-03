appControllers.controller('loginController', ['$scope','growl','AuthenticationService','$location','$rootScope','userFactory','focus','$window',
    function($scope,growl,AuthenticationService,$location,$rootScope,userFactory, focus, $window){
	
	$scope.userId='';
	$scope.password='';
	AuthenticationService.ClearCredentials();
    $rootScope.isLogin=false;
    focus('inputID');  
    
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

        // NO auth 
         // AuthenticationService.SetCredentials(0, 'testing');
         // $rootScope.isLogin=true; 
         // $rootScope.xAuth=true;          
         // //$location.path('#/masterUser'); 
         // $window.location = "#/masterUser";   
        
         // return true;
        // -- NO auth 

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
