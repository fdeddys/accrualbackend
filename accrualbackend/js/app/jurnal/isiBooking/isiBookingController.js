appControllers.controller('isiBookingController', ['$scope','jurnalHeaderFactory','growl','$filter','statusVoucherFactory','$rootScope','jurnalDetilFactory','isiBookingService',
	function($scope, jurnalHeaderFactory, growl, $filter, statusVoucherFactory,$rootScope, jurnalDetilFactory, isiBookingService){

	var userIdLogin;
	var jurnalHdrId;
	var idxUbah;

	$scope.jurnalHeaders=[];
	$scope.jurnalDetils=[];
	$scope.isiJurnalHeader={};
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

	// Paging Header
	$scope.totalItems;
	$scope.itemsPerPage= 8;
	$scope.currentPage = 1;

	// paging detil	
	$scope.totalItems2;
	$scope.itemsPerPage2= 6;
	$scope.currentPage2 = 1;

	// untuk hitung total debet / kredit di bawah
	$scope.totalDebet=0;
	$scope.totalKredit=0;

 	$scope.pageChanged=function(){
 		getAllJurnalHeader($scope.currentPage); 		  
    };
	

	$scope.getAll=function(){
		//alert('getAll');
		getAllJurnalHeader(1);
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
		 	isiBookingService
				.getJurnalBayarIsTarikByPageByTgl( halaman, $scope.itemsPerPage, vTgl1, vTgl2)
				.success(function (data){
				 	$scope.jurnalHeaders = data.content ;
				 	$scope.	totalItems = data.totalElements;
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
				// .getJurnalPengeluaranByPageByTgl(criteriaKode, criteriaNama, halaman, $scope.itemsPerPage, $scope.cariStatus)
				.getJurnalPengeluaranByPageByTgl( halaman, $scope.itemsPerPage, vTgl1, vTgl2)
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


	// tanggal
		$scope.today = function() {
	    	$scope.tgl1 = new Date();
	    	$scope.tgl2 = new Date();
	    	$scope.tgl3 = new Date();
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

		$scope.open3 = function($event) {
		    $event.preventDefault();
		    $event.stopPropagation();
		    $scope.opened3 = true;		    
		};

		// $scope.dateOptions = {
		// 	formatYear: 'yy',
		// 	startingDay: 1
		// };

		$scope.dateOptions = {
		    dateDisabled: false,
		    formatYear: 'yy',
		    maxDate: new Date(2020, 5, 22),
		    // minDate: new Date(),
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
		$scope.tutupGrid=true	;
		//$scope.isiJurnalHeader.bookingDate = new Date();
	};

	$scope.prosesBookingDate=function(id, idx){
	    	    
		jurnalHeaderFactory
			.getJurnalById(id)
			.success(function(data){
				//alert('get isi ' + id)
				$scope.isiJurnalHeader=data;
				$scope.isiJurnalHeader.bookingDate=new Date();

				$scope.tutupGrid = false;
				console.log("tutup  "+$scope.tutupGrid);
				console.log("book date nya adalah  "+$scope.isiJurnalHeader.bookingDate);
				$scope.isiJurnalHeader.bookingDate= new Date($scope.isiJurnalHeader.bookingDate);

				if($scope.isiJurnalHeader.statusVoucher!=='UNPOSTING'){
	    			growl.addErrorMessage("status voucher tidak boleh jika TIDAK UNPOSTING , status sekarang = " + $scope.isiJurnalHeader.statusVoucher);
	    			jurnalHdrId=data.id;
					getAllDetil();	
					hitungDebetkredit();	
					idxUbah=idx;
	    		}else {
	    			if($scope.isiJurnalHeader.noVoucher!=='' && $scope.isiJurnalHeader.noVoucher!==null){
		    			growl.addErrorMessage("No Voucher = " + $scope.isiJurnalHeader.noVoucher);
		    		}else {
		    			jurnalHdrId=data.id;
						//$scope.tutupGrid = !$scope.tutupGrid;
						getAllDetil();	
						hitungDebetkredit();	
						idxUbah=idx;
					}
	    		}				
			})
			.error(function(data){
				growl.addWarnMessage("error loading jurnal header !");
			})	  

	};

	$scope.pageChanged2=function(){
 		getAllDetil();
    };

    function getAllDetil(){
    	console.log("get all detil " + jurnalHdrId);
    	var vDebet=0;
		var vKredit=0;
		jurnalDetilFactory	
    		.getJurnalDetilByIdJurnalHeaderPage(jurnalHdrId,$scope.currentPage2, $scope.itemsPerPage2)
    		.success(function(data){
    			$scope.jurnalDetils=data.content;
    			$scope.totalItems2 = data.totalElements;
    			growl.addInfoMessage('refresh list detil success');				
    		});    	
    };
	
    function hitungDebetkredit(){
    	var vDebet=0;
		var vKredit=0;
		jurnalDetilFactory	
    		.getJurnalDetilByIdJurnalHeaderPage(jurnalHdrId,1, 25)
    		.success(function(data){
    			    			
    			angular.forEach(data.content, function(jurnaldetil){    				
					vDebet=vDebet + jurnaldetil.debet;
					vKredit=vKredit + jurnaldetil.kredit;
				});

				$scope.totalDebet = vDebet;
				$scope.totalKredit = vKredit;

    		});    		
    };

    $scope.updateData=function(){

    	var prosesData = false;

    	if($scope.isiJurnalHeader.noVoucher == null){
    		prosesData = true;
    	}else{
	    	if( $scope.isiJurnalHeader.noVoucher.length >8){	    		
	    		growl.addWarnMessage("sudah ada no voucher !!!")
	    	}    		
    	}

    	if( prosesData){
	    	var vTgl = $filter('date')($scope.isiJurnalHeader.bookingDate,'yyyy-MM-dd');
	    	isiBookingService
	    		.updateBookingDate(vTgl,$scope.isiJurnalHeader.id)
	    		.success(function(hasil){
	    			//$scope.isiJurnalHeader.noVoucher=hasil;
	    			//$scope.jurnalHeaders[idxUbah]=$scope.isiJurnalHeader;
	    			$scope.tutupGrid=!$scope.tutupGrid
	    			getAllJurnalHeader(1);
	    		})
    		console.log("proses no voucher")
    	}
    	
    };

	startModule();	
}])

