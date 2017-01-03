appControllers.controller('tutupBulanController', 
	['$scope','growl','$window', '$rootScope','focus','bukuBesarFactory',
	function($scope, growl, $window, $rootScope, focus, bukuBesarFactory){

	// var	$scope.tglBulan;

	function startModule(){
		$scope.disableButton=false;
		$scope.nilai = 0;
		bukuBesarFactory
			.getBulanTahunBerjalan()
			.success(function(data){
				$scope.tglBulan = data;				
			})			
	}

	function countController(){
	        
	    var timer = setInterval(function(){
	    	if($scope.nilai>199){
	    		$scope.nilai=0;
	    	}else{
	        	$scope.nilai++;	    		
	    	}
	        $scope.$apply();
	        console.log($scope.nilai);
	    }, 200);  
	}

	$scope.prosesTutupBulan=function(){
		$scope.disableButton=true;
		countController();
		bukuBesarFactory
			.prosesTutupBulan()
			.then(function(data){
				alert('Success !!!');
				$window.location = "#/bukuBesar"
			})	
	}

	startModule();

}])