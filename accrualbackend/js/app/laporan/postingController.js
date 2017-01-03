appControllers.controller('postingController', 
	['$scope','jurnalHeaderFactory','growl','$filter', '$rootScope','focus','$routeParams','bukuBesarFactory',
	function($scope, jurnalHeaderFactory, growl, $filter, $rootScope, focus, $routeParams, bukuBesarFactory){
	
	var userIdLogin;

	$scope.isJurnalPengeluaran;
	$scope.jurnalHeaders=[];
	$scope.orderJurnalHeader='noUrut';
	$scope.jurnalHeader={
		id: 0,
		kode: "",
		nama: "",		
		direktorat: {
			id: 0,
			nama: ""
		}
	};
	$scope.searchNoUrut='';
	$scope.searchNoVoucher='';


	// untuk pencarian pakek status voucher
	$scope.statusVouchers=[];
	$scope.cariStatus='ALL';

	// Paging
	$scope.totalItems;
	$scope.itemsPerPage= 8;
	$scope.currentPage = 1;

  	$scope.pageChanged=function(){
 		getAllJurnalHeader($scope.currentPage); 		  
    };
	
	$scope.getAll=function(){
		//alert('getAll');

		// console.log($scope.jenisVouch);
		// return true;
		getAllJurnalHeader(1);
	};

	$scope.posting=function(idHdr, noVoucher){		
		if($scope.isJurnalPengeluaran==true){
			// validasi jurnal pengeluaran
			jurnalHeaderFactory
				.validasiVouchPengeluaran(idHdr)
				.then(function(response){
					if(response.data.status=="OK"){
						//refresh
						getAllJurnalHeader($scope.currentPage);
					}else{
						growl.addWarnMessage(response.data.status);
					}
				})
		}else{
			// posting jurnal penerimaan pemindahan
			// masuk Buku Besar
			bukuBesarFactory
				.postingTrial(idHdr)
				.then(function(response){
					getAllJurnalHeader($scope.currentPage);
				})
		}

		// if(noVoucher==null){
		// 	growl.addWarnMessage("No Voucher belum diisi !!")
		// }else{
		// }
	};


	function getAllJurnalHeader(halaman){

		$scope.criteriaKode;
		$scope.criteriaNama;
		var jenisVouc1;
			
		var vTgl1 = $filter('date')($scope.tgl1,'yyyy-MM-dd');
		var vTgl2 = $filter('date')($scope.tgl2,'yyyy-MM-dd');
		//var idUser = $rootScope.globals.currentUser.authdata;
		if($scope.jenisVouch=="PENGELUARAN"){
			jenisVouc1=1;
		}else{
			if($scope.jenisVouch=="PENERIMAAN"){
				jenisVouc1=0;
			}else{
				jenisVouc1=2;
			}			
		}
		//.getJurnalHeaderByPageByTgl(idUser, halaman, $scope.itemsPerPage, vTgl1, vTgl2,$scope.cariStatus) //userIdLogin

		//if($scope.searchNoUrut===''  && $scope.searchNoVoucher==='' ){

		 	jurnalHeaderFactory
		 		.getByJenis(vTgl1, vTgl2, jenisVouc1,  halaman, $scope.itemsPerPage)
				.success(function (data){
				 	$scope.jurnalHeaders = data.content ;
				 	$scope.totalItems = data.totalElements;
				}).error(function(data){
					growl.addWarnMessage("Error Loading getAll data !",{ttl: 4000});		
				});	
		 /* }else{
		 	
		 	if($scope.searchNoUrut===''){
				criteriaKode='-';
		 	}else{
		 		criteriaKode=$scope.searchNoUrut;	
		 	}

		 	if($scope.searchNoUrut===''){
				criteriaNama='-';
		 	}else{
		 		criteriaNama=$scope.searchNoUrut;	
		 	}

			jurnalHeaderFactory
				.getJurnalHeaderByKodeByNamaPage(criteriaKode, criteriaNama, halaman, $scope.itemsPerPage, 'UNPOSTING')
				.success(function (data){
				 	$scope.jurnalHeaders = data.content ;
				 	$scope.totalItems = data.totalElements;				 	
				}).error(function(data){
					growl.addWarnMessage("Error Loading getAll data !",{ttl: 4000});		
				});	

		 }	*/				
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
		
		if($routeParams.isJurnalPengeluaran=='false'){
			$scope.isJurnalPengeluaran=false;			
		}else{
			$scope.isJurnalPengeluaran=true;			
		}


		if($scope.isJurnalPengeluaran){
			$scope.jenisVouch="PENGELUARAN";	
		}else{
			$scope.jenisVouch="PENERIMAAN";				
		}		

		getAllJurnalHeader(1);		
	};

	startModule();	


}])