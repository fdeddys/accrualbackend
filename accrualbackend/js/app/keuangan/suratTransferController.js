appControllers.controller('suratTransferController', 
	['$scope','suratTransferFactory','growl','$filter','$rootScope','focus',
	function($scope, suratTransferFactory, growl, $filter,$rootScope, focus){
	
	var userIdLogin;

	$scope.suratTransfers=[];
	$scope.searchNoApprove='';

	// Paging
	$scope.totalItems;
	$scope.itemsPerPage = 8;
	$scope.currentPage = 1;

  	$scope.pageChanged=function(){
 		getAllSuratTransfer($scope.currentPage); 		  
    };
	
	$scope.getAll=function(){	
		getAllSuratTransfer(1);
	};

	function getAllSuratTransfer(halaman){	
					
		var vTgl1 = $filter('date')($scope.tgl1,'yyyy-MM-dd');
		var vTgl2 = $filter('date')($scope.tgl2,'yyyy-MM-dd');
		var idUser = $rootScope.globals.currentUser.authdata;
		var noApprove;

		if($scope.searchNoApprove=='' || $scope.searchNoApprove == null){
			noApprove="--";
		}else{
			noApprove=$scope.searchNoApprove;
		}

	 	suratTransferFactory
			.getHdByTanggalNoApprove(vTgl1, vTgl2, noApprove, halaman, $scope.itemsPerPage)
			.success(function (data){
			 	$scope.suratTransfers = data.content ;
			 	$scope.totalItems = data.totalElements;
			 	//growl.addInfoMessage(data.content.length);
			}).error(function(data){
				growl.addWarnMessage("Error Loading getAll data !",{ttl: 4000});		
			});	
		 			
	};
	
	// tanggal
		$scope.today = function() {
	    	$scope.tgl1 = new Date();
	    	$scope.tgl2 = new Date();
		};
		

		$scope.open = function($event) {
		    $event.preventDefault();
		    $event.stopPropagation();
		    $scope.opened = true;		    
		};

		$scope.open2 = function($event) {
		    $event.preventDefault();
		    $event.stopPropagation();
		    $scope.opened2 = true;		    
		};

		$scope.dateOptions = {
			formatYear: 'yy',
			startingDay: 1
		};
	// END tanggal

	function startModule(){

		$scope.today();
		userIdLogin=$rootScope.globals.currentUser.authdata;
		getAllSuratTransfer(1);
		focus('searchNoApprove');
	};

	startModule();	

	

}])