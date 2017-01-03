appControllers.controller('suratTransferDetilController', 
	['$scope','suratTransferFactory','growl','$filter','$rootScope','focus','bankFactory','$uibModal','$routeParams','$window', 
	function($scope, suratTransferFactory, growl, $filter,$rootScope, focus, bankService,  $uibModal, $routeParams , $window){
	
	var userIdLogin;

	$scope.suratTransfers=[];
	$scope.searchNoApprove='';
	$scope.ipServer=$rootScope.pathServerJSON;

	// Paging
	$scope.totalItems;
	$scope.itemsPerPage = 8;
	$scope.currentPage = 1;

  	$scope.pageChanged=function(){
 		getAllDetil($scope.currentPage); 		  
    };

    function getAllBank(){
    	bankService
    		.getAllBank(1,1000)
    		.then(function(response){
    			$scope.banks = response.data.content;  
    			if(response.data.totalElements>1){
    				$scope.bankSelected = $scope.banks[0];
    			}  		
    		})
    }
	
    $scope.transaksiBaru = function(){

		$scope.today();		

		$scope.suratTransferHd={
			id: null,				
			bank: null,
			tglSurat: null,
			noApprove: null,
			noCek: null,
			isApprove: false,
			userUpdate: null,
			lastUpdate: null,
			total: 0
		};

		$scope.suratTransferDts=[];				
		$scope.currentPage = 1;
		$scope.bankSelected = $scope.banks[0];		

    }

    // $scope.getSupplierByNama = function(nama){
    // 	return customerService.getCustomerByNamaPage(nama,1,15)
    // 	.then(function(response){
    // 		var suppliers=[];
    // 		angular.forEach(response.data.content,function(supplier){
    // 			suppliers.push(supplier);
    // 		})
    // 		return suppliers;
    // 	})    	
    // }

    $scope.preview = function(){
		$window.open($rootScope.pathServerJSON + '/api/suratTransfer/report/'+$scope.suratTransferHd.id, '_blank'); 
    }

    $scope.tarikJurnal = function(){
    	

    	// if($scope.supplierSelected==null){
    	// 	growl.addInfoMessage("supplier belum terpilih !!")
    	// 	return false;
    	// };

    	// if($scope.supplierSelected.id==null){
    	// 	growl.addInfoMessage("supplier belum terpilih !!")
    	// 	return false;
    	// };

		var openDialog = false;
    	
    	if($scope.suratTransferHd.id==null){
	    	var vTgl = $filter('date')($scope.tglSurat,'yyyy-MM-dd');
	    	var idUser = $rootScope.globals.currentUser.authdata;

	    	var SuratTransferHdDto={
	    		'id':'',
	    		// 'customerId':$scope.supplierSelected.id,
	    		'bankId':$scope.bankSelected.id,
	    		'tglSurat':vTgl,
	    		'noApprove':$scope.suratTransferHd.noApprove,
	    		'noCek':$scope.suratTransferHd.noCek,
	    		'userUpdate':idUser
	    	}
    		
    		suratTransferFactory
    			.saveHd(SuratTransferHdDto)
    			.then(function(response){
    				$scope.suratTransferHd = response.data;
    				openDialogTarikJurnal();
    			})

    	}else{
    		openDialogTarikJurnal();
    	}
    }

    function openDialogTarikJurnal(){
    	var modalInstance = $uibModal.open({
				templateUrl: 'partials/dialog/dialogTarikJurnalSuratTransfer.html',
				controller: 'dialogTarikJurnalController',
				size: 'lg',
			    resolve: 
			    	{	        
		        		idBank: function () {
		          			return $scope.bankSelected.id;
		        		},
		        		// idCustomer: function () {
		          // 			return $scope.supplierSelected.id;
		        		// },
		        		namaBank: function () {
		          			return $scope.bankSelected.nama;
		        		},
		        		// namaCustomer: function () {
		          // 			return $scope.supplierSelected.nama;
		        		// },
		        		idHdSuratTransfer : function () {
		        			return $scope.suratTransferHd.id;
		        		}

	      			}
		    });

		    modalInstance
		    	.result.then(function(idHd){
			    	// tarik all detil
			    	growl.addInfoMessage("close success" );
			    	getAllDetil($scope.suratTransferHd.id);
			    	//getAll(1);		
		    	},function(pesan){
		    		//growl.addInfoMessage(pesan);
		    	})
    		
    	
    }

	// tanggal
		$scope.today = function() {
	    	$scope.tglSurat = new Date();	    	
		};
		
		$scope.open = function($event) {
		    $event.preventDefault();
		    $event.stopPropagation();
		    $scope.opened = true;		    
		};

		$scope.dateOptions = {
			formatYear: 'yy',
			startingDay: 1
		};
	// END tanggal

	//$scope.totalItems;
	//$scope.itemsPerPage = 8;
	//$scope.currentPage = 1;
	function getAllDetil(idHd){
		suratTransferFactory
			.getDtByIdHd(idHd, $scope.currentPage, $scope.itemsPerPage  )
			.then(function(response){
				$scope.suratTransferDts = response.data.content;
			})
	}

	function startModule(){

		$scope.bankSelected;
		//$scope.supplierSelected;
		getAllBank();
		$scope.today();		
		userIdLogin=$rootScope.globals.currentUser.authdata;		

		var idHD=$routeParams.idHd;

		if(idHD == 'new'){

			$scope.suratTransferHd={
				id: null,				
				bank: null,
				tglSurat: null,
				noApprove: null,
				noCek: null,
				isApprove: false,
				userUpdate: null,
				lastUpdate: null,
				total: 0
			}
		}else{
			$scope.suratTransferHd ={};
			suratTransferFactory
				.getHdById(idHD)
				.success(function(data){
					$scope.suratTransferHd = data;
					$scope.tglSurat =new Date(data.tglSurat) ;
					$scope.bankSelected = $scope.suratTransferHd.bank;
					// $scope.supplierSelected = $scope.suratTransferHd.customer;
					getAllDetil($scope.suratTransferHd.id);
				})

		}
		focus('idSupplier');

	};

	startModule();	

	

}])