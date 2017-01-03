appControllers.controller('bankController',
	['$scope','bankFactory','growl','focus','$window','$rootScope',	
	function($scope, bankFactory, growl, focus, $window, $rootScope){

	$scope.statusBanks=['ACTIVE','NONACTIVE'];
	$scope.tutupGrid=false;
	$scope.classForm='';
	$scope.customers=[];
	$scope.orderBank='nama';
	$scope.bank={
		id: 0,
		kode: "",
		nama: "",
		namaCabangBank: "",
		status: "",
		noAccount: "",
		kota:""
	};
	$scope.searchKode='';
	$scope.searchNama='';

	// Paging
	$scope.totalItems;
	$scope.itemsPerPage= 10;
	$scope.currentPage = 1;

 	$scope.pageChanged=function(){
 		getAllBank($scope.currentPage); 		  
    };

	$scope.jenisTransaksi;
	//1. add
	//2. edit
	var idxUbah;
	//3. deleter	

	getAllBank(1);

	$scope.getAll=function(){
		getAllBank(1);
	};

	
	$scope.tambahBank=function(){
		$scope.jenisTransaksi=1;
		$scope.tutupGrid = !$scope.tutupGrid;
		$scope.classForm = 'formTambah';
		
		$scope.bank={
			id: '[Automatic]',
			kode: "",
			nama: "",
			namaCabangBank: "",
			status: "ACTIVE",
			noAccount: "",
			kota: ""
		};
		focus('kode');
	};

	function getAllBank(halaman){
		//alert('get all kode arsip');

		var criteriaKode, criteriaNama;

		if($scope.searchKode==='' && $scope.searchNama===''){
			bankFactory
				.getAllBank(halaman,$scope.itemsPerPage)
				.success(function (data){
				 	$scope.banks = data.content ;
				 	$scope.totalItems = data.totalElements;
				 	growl.addInfoMessage(data.content.length);
				}).error(function(data){
					growl.addWarnMessage("Error Loading getAll data !",{ttl: 4000});		
				});				
		}else{
			if($scope.searchKode===''){
				criteriaKode='--';
		 	}else{
		 		criteriaKode=$scope.searchKode;	
		 	}

		 	if($scope.searchNama===''){
				criteriaNama='--';
		 	}else{
		 		criteriaNama=$scope.searchNama;	
		 	}

			bankFactory
				.getBankByKodeByNamaPage(criteriaKode, criteriaNama, halaman, $scope.itemsPerPage)
				.success(function (data){
				 	$scope.banks = data.content ;
				 	$scope.totalItems = data.totalElements;
				}).error(function(data){
					growl.addWarnMessage("Error Loading getAll data by nama customer !",{ttl: 4000});		
				});					
		}
		
	};

	$scope.urut=function(urut_berdasar){
		$scope.orderBank=urut_berdasar;		
	};

	$scope.ubahBank=function(id,urut){
		$scope.jenisTransaksi=2;
		$scope.tutupGrid = !$scope.tutupGrid;
		$scope.classForm = 'formUbah';
		idxUbah=urut;
		bankFactory
			.getBankById(id)
			.success(function(data){
				$scope.bank =data;	
				focus('kode');			
			});
		
		//growl.addInfoMessage(urut);

	};

	$scope.hapusBank=function(id){
		$scope.jenisTransaksi=3;
		$scope.tutupGrid = !$scope.tutupGrid;
		$scope.classForm = 'formHapus';

		bankFactory
			.getBankById(id)
			.success(function(data){
				$scope.bank =data;				
			});		
		//growl.addInfoMessage(urut);
	};

	$scope.proses=function(){

		if($scope.bank.kode==='' || $scope.bank.kode==null){
			growl.addWarnMessage("Kode bank belum diisi !!")
			return false;
		};

		if($scope.bank.nama==='' || $scope.bank.nama==null){
			growl.addWarnMessage("Nama bank belum diisi !!")
			return false;
		};

		if($scope.bank.noAccount==='' || $scope.bank.noAccount==null){
			growl.addWarnMessage("NO Account bank belum diisi !!")
			return false;
		};

		switch($scope.jenisTransaksi){
			case 1:
				$scope.bank.id='';
					bankFactory					
						.isKodeExis($scope.bank.kode)
						.success(function(data){

							if(data==='true'){
								growl.addWarnMessage('Kode bank sudah ada');							
							}else {
								bankFactory
									.insertBank($scope.bank)
									.success(function(data){
										growl.addInfoMessage('insert success ' + data );
										$scope.jenisTransaksi=2;
										$scope.banks.push(data);
										$scope.bank.id=data.id;
										$scope.tutupGrid = !$scope.tutupGrid;
									})
									.error(function(data){
										growl.addWarnMessage('Error insert ' + data);		
									})
							}						
						})
				break;
			case 2:
				bankFactory
					.updateBank($scope.bank.id, $scope.bank)
					.success(function(data){
						growl.addInfoMessage('edit success');						
						$scope.banks[idxUbah]=data;
						$scope.tutupGrid = !$scope.tutupGrid;
					})
					.error(function(data){
						growl.addWarnMessage('Error Updata ' + data);
						console.log(data);		
					})				
				break;
			case 3:
				bankFactory
					.deleteBank($scope.bank.id)
					.success(function(data){
						//growl.addInfoMessage('Delete success, silahkan Refresh ulang !');		
						getAllBank(1);
						$scope.tutupGrid = !$scope.tutupGrid;
					})
					.error(function(data){
						growl.addWarnMessage('Error Delete ' + data)								
					});				
				break;			
		}

		$scope.tutupGrid= true;
	};

	$scope.tutupDetil=function(){
		$scope.tutupGrid =!$scope.tutupGrid ;
	};

	$scope.previewLaporan=function(){
		 $window.open($rootScope.pathServerJSON + '/api/bank/laporan', '_blank');
	}

}]);
