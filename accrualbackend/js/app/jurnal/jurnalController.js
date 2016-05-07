appControllers.controller('jurnalController', ['$scope','jurnalHeaderFactory','growl','$filter','statusVoucherFactory','$rootScope',
	function($scope, jurnalHeaderFactory, growl, $filter, statusVoucherFactory,$rootScope){
	
	var userIdLogin;

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
	$scope.itemsPerPage= 12;
	$scope.currentPage = 1;

  	$scope.pageChanged=function(){
 		getAllJurnalHeader($scope.currentPage); 		  
    };
	

	$scope.getAll=function(){
		//alert('getAll');
		getAllJurnalHeader(1);
	};

	
	$scope.tambahJurnalHeader=function(){

		var vTgl1 = $filter('date')($scope.tgl1,'yyyy-MM-dd');
		//alert(vTgl1);
		// $scope.jenisTransaksi=1;
		// $scope.tutupGrid = !$scope.tutupGrid;
		// $scope.classForm = 'formTambah';		
		// $scope.jurnalHeader={
		// 	id: 0,
		// 	kode: "",
		// 	nama: "",		
		// 	direktorat: {
		// 		id: 0,
		// 		nama: ""
		// 	}
		// };
	};

	function getAllJurnalHeader(halaman){
		//alert('get all kode arsip');
		$scope.criteriaKode;
		$scope.criteriaNama;
			

		// '/idUser/' + idUser + '/hal/' + hal + '/jumlah/' + jumlah + '/tgl1/' + tgl1 + '/tgl2/' + tgl2
		//var vTglSuratMasuk = $filter('date')($scope.tglSuratMasuk,'yyyy-MM-dd');
		var vTgl1 = $filter('date')($scope.tgl1,'yyyy-MM-dd');
		var vTgl2 = $filter('date')($scope.tgl2,'yyyy-MM-dd');

		if($scope.searchNoUrut===''  && $scope.searchNoVoucher==='' ){
		 	jurnalHeaderFactory
				.getJurnalHeaderByPageByTgl(2, halaman, $scope.itemsPerPage, vTgl1, vTgl2,$scope.cariStatus) //userIdLogin
				.success(function (data){
				 	$scope.jurnalHeaders = data.content ;
				 	$scope.totalItems = data.totalElements;
				 	//growl.addInfoMessage(data.content.length);
				}).error(function(data){
					growl.addWarnMessage("Error Loading getAll data !",{ttl: 4000});		
				});	
		 }else{
		 	
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
				.getJurnalHeaderByKodeByNamaPage(criteriaKode, criteriaNama, halaman, $scope.itemsPerPage, $scope.cariStatus)
				.success(function (data){
				 	$scope.jurnalHeaders = data.content ;
				 	$scope.totalItems = data.totalElements;
				 	//growl.addInfoMessage(data.content.length);
				}).error(function(data){
					growl.addWarnMessage("Error Loading getAll data !",{ttl: 4000});		
				});	
		 }					
	};

	$scope.urut=function(urut_berdasar){
		$scope.orderJurnalHeader=urut_berdasar;		
	};

	$scope.ubahJurnalHeader=function(id){
		$scope.jenisTransaksi=2;
		$scope.tutupGrid = !$scope.tutupGrid;
		$scope.classForm = 'formUbah';
		jurnalHeaderFactory
			.getJurnalHeaderById(id)
			.success(function(data){
				$scope.jurnalHeader =data;				
			})
			.error(function(data){
				growl.addWarnMessage("Error loading get by id ",{ttl:4000})
			});				
	};

	$scope.hapusJurnalHeader=function(id){
		$scope.jenisTransaksi=3;
		$scope.tutupGrid = !$scope.tutupGrid;
		$scope.classForm = 'formHapus';

		jurnalHeaderFactory
			.getJurnalHeaderById(id)
			.success(function(data){
				$scope.jurnalHeader =data;				
			})
			.error(function(data){
				growl.addWarnMessage("Error loading get by id ",{ttl:4000})
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


	function getAllStatusVoucher(){
			
			statusVoucherFactory
				.getAllStatus()
				.success(function(data){					
					$scope.statusVouchers=data;	
					$scope.statusVouchers.push("ALL");						
				})
				.error(function(data){
					growl.addWarnMessage('Error loading status vouchers ');
				})
			
		}

	function startModule(){

		$scope.today();
		userIdLogin=$rootScope.globals.currentUser.authdata;
		getAllJurnalHeader(1);	
		getAllStatusVoucher();

	};

	startModule();	

	

}])