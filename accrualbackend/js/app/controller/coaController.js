// var appControllers = angular.module('appControllers',[
// 	'accrualServices'
// 	]);



appControllers.controller('coaHdrController', ['$scope', 'coaHdrFactory','growl','$window','$rootScope',
	function($scope,coaHdrFactory,growl, $window, $rootScope){

	var idx=0;
	$scope.tutupGrid=false;
	$scope.classForm='';
	$scope.coaHdrs=[];
	$scope.orderCoa='namaAccount';
	$scope.coaHdr={
		idAccountHdr: 0,
		namaAccount: "",
		kodeAccount: ""
	};
	$scope.searchNama='';
	$scope.searchKode='';

	// Paging
	$scope.totalItems;
	$scope.itemsPerPage= 10;
	$scope.currentPage = 1;

 	$scope.pageChanged=function(){
 		getAllCoaHdr($scope.currentPage); 		  
    };

	$scope.jenisTransaksi;
	//1. add
	//2. edit
	//3. deleter	

	getAllCoaHdr(1);

	$scope.getAll=function(){
		getAllCoaHdr(1);
	};

	
	$scope.tambahCoaHdr=function(){
		$scope.jenisTransaksi=1;
		$scope.tutupGrid = !$scope.tutupGrid;
		$scope.classForm = 'formTambah';
		$scope.coaHdr.idAccountHdr='[Automatic]';		
		$scope.coaHdr.kodeAccount='';
		$scope.coaHdr.namaAccount='';
	};

	function getAllCoaHdr(halaman){
		//alert('get all kode arsip');

		if($scope.searchKode==='' ){
			if($scope.searchNama==='' ){
				//kode dan nama kosong, get ALL
				console.log("kode kosong nama kosong");
				coaHdrFactory
					.getCoaHdrByPage(halaman,$scope.itemsPerPage)
					.success(function (data){
					 	$scope.coaHdrs = data.content ;
					 	$scope.totalItems = data.totalElements;
					 	growl.addInfoMessage(data.content.length);
					}).error(function(data){
						growl.addWarnMessage("Error Loading getAll data !",{ttl: 4000});		
					});				
			}else{
				//kode kosong nama isi, get by nama
				console.log("kode kosong nama isi");
				coaHdrFactory
					.getCoaHdrByNamaPage($scope.searchNama,halaman,$scope.itemsPerPage)
					.success(function (data){
					 	$scope.coaHdrs = data.content ;
					 	$scope.totalItems = data.totalElements;
					}).error(function(data){
						growl.addWarnMessage("Error Loading getAll data by nama customer !",{ttl: 4000});		
					});					
			}
		}else{
			if($scope.searchNama==='' ){
				//kode isi nama kosong, get by kode
				console.log("kode isi  nama kosong");
				coaHdrFactory
					.getCoaHdrByKodePage($scope.searchKode,halaman,$scope.itemsPerPage)
					.success(function (data){
					 	$scope.coaHdrs = data.content ;
					 	$scope.totalItems = data.totalElements;
					}).error(function(data){
						growl.addWarnMessage("Error Loading getAll data by nama customer !",{ttl: 4000});		
					});					
			}else{
				//kode isi nama isi, get by kode by nama
				console.log("kode isi  nama isi");
				coaHdrFactory
					.getCoaHdrByKodeByNamaPage($scope.searchKode, $scope.searchNama,halaman,$scope.itemsPerPage)
					.success(function (data){
					 	$scope.coaHdrs = data.content ;
					 	$scope.totalItems = data.totalElements;
					}).error(function(data){
						growl.addWarnMessage("Error Loading getAll data by nama customer !",{ttl: 4000});		
					});					
			}			
		}		
	};

	$scope.urut=function(urut_berdasar){
		$scope.orderCoa=urut_berdasar;		
	};

	$scope.ubahCoa=function(id, indeks){
		idx=indeks;
		$scope.jenisTransaksi=2;
		$scope.tutupGrid = !$scope.tutupGrid;
		$scope.classForm = 'formUbah';
		coaHdrFactory
			.getCoaHdrById(id)
			.success(function(data){
				$scope.coaHdr =data;				
			})
			.error(function(data){
				growl.addWarnMessage("Error loading get by id ",{ttl:4000})
			});				
	};

	$scope.hapusCoa=function(id,kode,nama){
		$scope.jenisTransaksi=3;
		$scope.tutupGrid = !$scope.tutupGrid;
		$scope.classForm = 'formHapus';

		coaHdrFactory
			.getCoaHdrById(id)
			.success(function(data){
				$scope.coaHdr =data;				
			});				
	};

	$scope.proses=function(){
		switch($scope.jenisTransaksi){
			case 1:

				coaHdrFactory
					.isKodeExis($scope.coaHdr.kodeAccount)
					.success(function(data){
						if(data==='true'){
							growl.addWarnMessage('Kode Sudah ada ')
						}else{
							$scope.coaHdr.idAccountHdr='';
							coaHdrFactory
								.insertCoaHdr($scope.coaHdr)
								.success(function(data){
									growl.addInfoMessage('insert success ' + data );
									$scope.jenisTransaksi=2;
									$scope.coaHdr.idAccountHdr=data.idAccountHdr;
									$scope.tutupGrid = !$scope.tutupGrid;
									getAllCoaHdr(1);
								})
								.error(function(data){
									growl.addWarnMessage('Error insert ' + data);		
								})							
						}
					})

				
				break;
			case 2:
				coaHdrFactory
					.updateCoaHdr($scope.coaHdr.idAccountHdr, $scope.coaHdr)
					.success(function(data){
						//growl.addInfoMessage('edit success');						
						$scope.coaHdrs[idx]=$scope.coaHdr;
						$scope.tutupGrid = !$scope.tutupGrid;
						getAllCoaHdr(1);
					})
					.error(function(data){
						growl.addWarnMessage('Error Updata ' + data);
						console.log(data);		
					})				
				break;
			case 3:
				coaHdrFactory
					.deleteCoaHdr($scope.coaHdr.idAccountHdr)
					.success(function(data){
						//growl.addInfoMessage('Delete success');		
						getAllCoaHdr(1);
						$scope.tutupGrid = !$scope.tutupGrid;
					})
					.error(function(data){
						growl.addWarnMessage('Error Delete ' + data)								
					});				
				break;			
		}
	};

	$scope.tutupDetil=function(){
		$scope.tutupGrid = !$scope.tutupGrid;
	};

	$scope.previewLaporan=function(){
		 $window.open($rootScope.pathServerJSON + '/laporan/coa', '_blank');
	}
	
}]);

appControllers.controller('coaDtlController', ['$scope','coaDtlFactory','growl','coaHdrFactory', function($scope, coaDtlFactory, growl,coaHdrFactory){
	var idx=0;
	$scope.statusCoaDetils=['ACTIVE','NONACTIVE'];
	$scope.tipeVouchers=['DEBET','KREDIT'];

	$scope.tutupGrid=false;
	$scope.classForm='';
	$scope.coaDtls=[];
	$scope.orderCoa='namaPerkiraan';
	$scope.coaDtl={
		idAccountDtl: 0,
		namaPerkiraan: "",
		kodePerkiraan: "",
		rel: false,
		cust: false,
		cashBank: false,
		accountHeader: {
			idAccountHdr: 0,
			namaAccount: "",
			kodeAccount: ""
		},		
		status:'ACTIVE',
		autoGenerateNo: false,
		headerAutoGenerateNo: ''
	};
	$scope.searchNama='';
	$scope.searchKode='';
	

	// Paging
	$scope.totalItems;
	$scope.itemsPerPage= 10;
	$scope.currentPage = 1;

 	$scope.pageChanged=function(){
 		getAllCoaDtl($scope.currentPage); 		  
    };

	$scope.jenisTransaksi;
	//1. add
	//2. edit
	//3. deleter	
	$scope.selected = undefined;
	$scope.coaHdrs=[];
	getAllCoaDtl(1);
	getAllAccountHeader();

	$scope.getAll=function(){
		getAllCoaDtl(1);
	};

	
	$scope.tambahCoaDtl=function(){
		$scope.jenisTransaksi=1;
		$scope.tutupGrid = !$scope.tutupGrid;
		$scope.classForm = 'formTambah';		
		$scope.coaDtl={
			idAccountDtl: '[Automatic]',
			namaPerkiraan: "",
			kodePerkiraan: "",
			rel: false,
			cust: false,
			cashBank: false,
			accountHeader:'',		
			status:'ACTIVE',
			tipeVoucher:'DEBET'
			//  {
			// 	idAccountHdr: 0,
			// 	namaAccount: "",
			// 	kodeAccount: ""
			// }
		};
	};

	function getAllCoaDtl(halaman){
		//alert('get all kode arsip');
		$scope.criteriaKode;
		$scope.criteriaNama;

		if($scope.searchKode===''  && $scope.searchNama==='' ){
		 	coaDtlFactory
				.getCoaDtlByPage(halaman,$scope.itemsPerPage, 1)
				.success(function (data){
				 	$scope.coaDtls = data.content ;
				 	$scope.totalItems = data.totalElements;
				 	growl.addInfoMessage(data.content.length);
				}).error(function(data){
					growl.addWarnMessage("Error Loading getAll data !",{ttl: 4000});		
				});	
		 }else{
		 	
		 	if($scope.searchKode===''){
				criteriaKode='-';
		 	}else{
		 		criteriaKode=$scope.searchKode;	
		 	}

		 	if($scope.searchNama===''){
				criteriaNama='-';
		 	}else{
		 		criteriaNama=$scope.searchNama;	
		 	}
			coaDtlFactory
				.getCoaDtlByKodeByNamaPage(criteriaKode, criteriaNama, halaman, $scope.itemsPerPage, 1)
				.success(function (data){
				 	$scope.coaDtls = data.content ;
				 	$scope.totalItems = data.totalElements;
				 	growl.addInfoMessage(data.content.length);
				}).error(function(data){
					growl.addWarnMessage("Error Loading getAll data !",{ttl: 4000});		
				});	

		 }
		
		// if($scope.searchKode==='' ){
		// 	if($scope.searchNama==='' ){
		// 		//kode dan nama kosong, get ALL
		// 		console.log("kode kosong nama kosong");
		// 		coaHdrFactory
		// 			.getCoaHdrByPage(halaman,$scope.itemsPerPage)
		// 			.success(function (data){
		// 			 	$scope.coaHdrs = data.content ;
		// 			 	$scope.totalItems = data.totalElements;
		// 			 	growl.addInfoMessage(data.content.length);
		// 			}).error(function(data){
		// 				growl.addWarnMessage("Error Loading getAll data !",{ttl: 4000});		
		// 			});				
		// 	}else{
		// 		//kode kosong nama isi, get by nama
		// 		console.log("kode kosong nama isi");
		// 		coaHdrFactory
		// 			.getCoaHdrByNamaPage($scope.searchNama,halaman,$scope.itemsPerPage)
		// 			.success(function (data){
		// 			 	$scope.coaHdrs = data.content ;
		// 			 	$scope.totalItems = data.totalElements;
		// 			}).error(function(data){
		// 				growl.addWarnMessage("Error Loading getAll data by nama customer !",{ttl: 4000});		
		// 			});					
		// 	}
		// }else{
		// 	if($scope.searchNama==='' ){
		// 		//kode isi nama kosong, get by kode
		// 		console.log("kode isi  nama kosong");
		// 		coaHdrFactory
		// 			.getCoaHdrByKodePage($scope.searchKode,halaman,$scope.itemsPerPage)
		// 			.success(function (data){
		// 			 	$scope.coaHdrs = data.content ;
		// 			 	$scope.totalItems = data.totalElements;
		// 			}).error(function(data){
		// 				growl.addWarnMessage("Error Loading getAll data by nama customer !",{ttl: 4000});		
		// 			});					
		// 	}else{
		// 		//kode isi nama isi, get by kode by nama
		// 		console.log("kode isi  nama isi");
		// 		coaHdrFactory
		// 			.getCoaHdrByKodeByNamaPage($scope.searchKode, $scope.searchNama,halaman,$scope.itemsPerPage)
		// 			.success(function (data){
		// 			 	$scope.coaHdrs = data.content ;
		// 			 	$scope.totalItems = data.totalElements;
		// 			}).error(function(data){
		// 				growl.addWarnMessage("Error Loading getAll data by nama customer !",{ttl: 4000});		
		// 			});					
		// 	}			
		// }		
	};

	$scope.urut=function(urut_berdasar){
		$scope.orderCoa=urut_berdasar;		
	};

	$scope.ubahCoa=function(id, indeks){
		idx=indeks;
		$scope.jenisTransaksi=2;
		$scope.tutupGrid = !$scope.tutupGrid;
		$scope.classForm = 'formUbah';
		coaDtlFactory
			.getCoaDtlById(id)
			.success(function(data){
				$scope.coaDtl =data;				
			})
			.error(function(data){
				growl.addWarnMessage("Error loading get by id ",{ttl:4000})
			});				
	};

	$scope.hapusCoa=function(id){
		$scope.jenisTransaksi=3;
		$scope.tutupGrid = !$scope.tutupGrid;
		$scope.classForm = 'formHapus';

		coaDtlFactory
			.getCoaDtlById(id)
			.success(function(data){
				$scope.coaDtl =data;				
			});				
	};

	$scope.proses=function(){
		switch($scope.jenisTransaksi){
			case 1:

				coaDtlFactory
					.isKodeExis($scope.coaDtl.kodePerkiraan)
					.success(function(data){
						if(data==='Y'){
							growl.addWarnMessage('Kode sudah ada !!')
						}else{
							$scope.coaDtl.idAccountDtl='';
							coaDtlFactory
								.insertCoaDtl($scope.coaDtl)
								.success(function(data){
									growl.addInfoMessage('insert success ' + data );
									// $scope.jenisTransaksi=2;
									$scope.coaDtl.idAccountDtl=data.idAccountDtl;
									getAllCoaDtl(1);
									$scope.tutupGrid = !$scope.tutupGrid;
								})
								.error(function(data){
									growl.addWarnMessage('Error insert ' + data);		
								})							
						}
					})


				
				break;
			case 2:
				coaDtlFactory
					.updateCoaDtl($scope.coaDtl.idAccountDtl, $scope.coaDtl)
					.success(function(data){
						$scope.coaDtls[idx]=$scope.coaDtl;
						growl.addInfoMessage('edit success');	
						$scope.tutupGrid = !$scope.tutupGrid;					
					})
					.error(function(data){
						growl.addWarnMessage('Error Updata ' + data);
						//console.log(data);		
					})				
				break;
			case 3:
				coaDtlFactory
					.deleteCoaDtl($scope.coaDtl.idAccountDtl)
					.success(function(data){
						//growl.addInfoMessage('Delete success');
						$scope.currentPage=1;	
						getAllCoaDtl(1);
						$scope.tutupGrid = !$scope.tutupGrid;	
					})
					.error(function(data){
						growl.addWarnMessage('Error Delete ' + data)								
					});				
				break;			
		}
	};

	$scope.tutupDetil=function(){
		$scope.tutupGrid = !$scope.tutupGrid;
	};

	function getAllAccountHeader() {
		coaHdrFactory
	    	//.getCoaHdrByNamaPage('',1,1000)
	    	.getCoaHdrByPage(1,1000)
		    .success(function(response){
			    $scope.coaHdrs = response.content  ;  
  			});
		};

}]);





