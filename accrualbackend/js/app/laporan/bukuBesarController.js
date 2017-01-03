appControllers.controller('bukuBesarController', 
	['$scope','growl','$window', '$rootScope','focus','bukuBesarFactory',
	function($scope, growl, $window, $rootScope, focus, bukuBesarFactory){

	var isKode;
	var isKodeCari;

 	$scope.pageChanged=function(){
 		getAllBukuBesar($scope.currentPage); 		  
    };

	$scope.getAll=function(){
		getAllBukuBesar(1);
		$scope.currentPage = 1;
	};

	function getAllBukuBesar(hal) {

		var ket ;
		if($scope.cariKeterangan=="" || $scope.cariKeterangan==undefined ){
			ket="--"
		}else{
			ket = $scope.cariKeterangan;
		}

		bukuBesarFactory
	    	.getAll('072016',ket, isKodeCari, hal, $scope.itemsPerPage)
		    .then(function(response){
			    $scope.bukuBesars = response.data.content ;  
			    $scope.totalItems = response.data.totalElements;
  			});
		};	

	$scope.preview = function(id){
		$window.open($rootScope.pathServerJSON +'/api/transaksi/jurnalDetil/voucher/'+id, 'Jurnal');
		//$window.open($rootScope.pathServerJSON + '/laporan/jurnal/'+id, '_blank');
	}

	$scope.ambilKode = function(idCoa){
		if(isKode==true){
			isKode=false;
			isKodeCari=0;
		}else{
			isKode=true;	
			isKodeCari=idCoa;
		}		
		console.log(idCoa);		
		getAllBukuBesar(1); 
		$scope.currentPage = 1;
	}

	$scope.resetField=function(){
		isKode =false;
		isKodeCari=0;
		$scope.cariKeterangan="";
		focus('cari');
		getAllBukuBesar(1);
		$scope.currentPage = 1;
	}

	function startModule(){
		// Paging
		$scope.totalItems;
		$scope.itemsPerPage= 10;
		$scope.currentPage = 1;		
		isKode =false;
		isKodeCari=0;
		focus('cari');
		getAllBukuBesar($scope.currentPage);
	}

	startModule();

}])