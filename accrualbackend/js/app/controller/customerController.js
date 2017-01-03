appControllers.controller('customerController',
	['$scope','customerFactory','growl','$window', '$rootScope','focus',
	function($scope, customerFactory, growl, $window, $rootScope, focus){
		
	var idx;	  
	$scope.statusCustomers=['ACTIVE','NONACTIVE'];

	$scope.tutupGrid=false;
	
	$scope.classForm='';
	$scope.customers=[];
	$scope.orderCustomer='nama';
	$scope.customer={
		id: 0,
		kode: "",
		nama: "",
		alamat: "",
		kota: "",
		telp: "",
		fax: "",
		npwp: "",
		namaBank: "",
		noRekening: "",
		namaCabangBank: "",
		kontakPerson:"",
		kotaBank:"",
		isSupplier:0
	};
	$scope.search='';

	// Paging
	$scope.totalItems;
	$scope.itemsPerPage= 10;
	$scope.currentPage = 1;

 	$scope.pageChanged=function(){
 		getAllCustomer($scope.currentPage); 		  
    };

	$scope.jenisTransaksi;
	//1. add
	//2. edit
	//3. deleter	

	getAllCustomer(1);

	$scope.getAll=function(){
		getAllCustomer(1);
	};

	
	$scope.tambahCustomer=function(){
		$scope.jenisTransaksi=1;
		$scope.tutupGrid = !$scope.tutupGrid;
		$scope.classForm = 'formTambah';
		$scope.customer.id='[Automatic]';		
		// $scope.customer.kode='';
		// $scope.customer.nama='';
		$scope.customer={
			id: '[Automatic]',
			kode: "",
			nama: "",
			alamat: "",
			kota: "",
			telp: "",
			fax: "",
			npwp: "",
			namaBank: "",
			noRekening: "",
			namaCabangBank: "",
			kontakPerson:"",
			status:"ACTIVE",
			kotaBank:"",
			isSupplier:0
		};
		// $scope.statusCustomers='ACTIVE';
		
		focus('kode');
	};

	function getAllCustomer(halaman){
		//alert('get all kode arsip');

		if($scope.search===''){
			customerFactory
				.getCustomerByPage(halaman,$scope.itemsPerPage)
				.success(function (data){
				 	$scope.customers = data.content ;
				 	$scope.totalItems = data.totalElements;
				 	growl.addInfoMessage(data.content.length);
				}).error(function(data){
					growl.addWarnMessage("Error Loading getAll data !",{ttl: 4000});		
				});				
		}else{
			customerFactory
				.getCustomerByNamaPage($scope.search,halaman,$scope.itemsPerPage)
				.success(function (data){
				 	$scope.customers = data.content ;
				 	$scope.totalItems = data.totalElements;
				}).error(function(data){
					growl.addWarnMessage("Error Loading getAll data by nama customer !",{ttl: 4000});		
				});					
		}
		
	};

	$scope.urut=function(urut_berdasar){
		$scope.orderCustomer=urut_berdasar;		
	};

	$scope.ubahCustomer=function(id,nama,urut){
		
		$scope.jenisTransaksi=2;
		$scope.tutupGrid = !$scope.tutupGrid;
		$scope.classForm = 'formUbah';
		customerFactory
			.getCustomerById(id)
			.success(function(data){
				$scope.customer =data;	
				idx=urut;	
				focus('kode');		
				
			});
	};

	$scope.hapusCustomer=function(id,kode,nama){
		$scope.jenisTransaksi=3;
		$scope.tutupGrid = !$scope.tutupGrid;
		$scope.classForm = 'formHapus';

		customerFactory
			.getCustomerById(id)
			.success(function(data){
				$scope.customer =data;				
			});
	};

	$scope.proses=function(){
		switch($scope.jenisTransaksi){
			case 1:				
				customerFactory					
					.isKodeExis($scope.customer.kode)
					.success(function(data){						
						if(data==true){
							growl.addWarnMessage('Kode sudah ada');
							return 0;
						}else{
							$scope.customer.id='';
							customerFactory
								.insertCustomer($scope.customer)
								.success(function(data){
									growl.addInfoMessage('insert success ' + data );
									$scope.jenisTransaksi=2;
									$scope.customer.idCustomer=data.idCustomer;
									$scope.tutupGrid = !$scope.tutupGrid;
									getAllCustomer(1);
								})
								.error(function(data){
									growl.addWarnMessage('Error insert ' + data);		
								})
						}
					})								
				break;
			case 2:
				customerFactory
					.updateCustomer($scope.customer.id, $scope.customer)
					.success(function(data){
						growl.addInfoMessage('edit success');	
						
						//$scope.customers[idx]=$scope.customer;					
						getAllCustomer($scope.currentPage);
						$scope.tutupGrid = !$scope.tutupGrid;
					})
					.error(function(data){
						growl.addWarnMessage('Error Updata ' + data);
						console.log(data);		
					})				
				break;
			case 3:
				customerFactory
					.deleteCustomer($scope.customer.id)
					.success(function(data){						
						growl.addInfoMessage('Delete success');		
						$scope.currentPage=1;
						getAllCustomer(1);
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
		 $window.open($rootScope.pathServerJSON + '/laporan/customer', '_blank');
	};

}]);