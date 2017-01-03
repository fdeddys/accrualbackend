appControllers.controller('bagianController', ['$scope','bagianFactory','growl','direktoratFactory', '$window', '$rootScope','focus',
	function($scope, bagianFactory, growl, direktoratFactory, $window, $rootScope, focus){
	var idx=0;

	$scope.statusBagians=['ACTIVE','NONACTIVE'];
	$scope.tutupGrid=false;
	$scope.classForm='';
	$scope.bagians=[];
	$scope.orderCoa='nama';
	$scope.bagian={
		id: 0,
		kode: "",
		nama: "",		
		direktorat: {
			id: 0,
			nama: ""
		},		
		status: "ACTIVE"
	};
	$scope.searchNama='';
	$scope.searchKode='';
	

	// Paging
	$scope.totalItems;
	$scope.itemsPerPage= 10;
	$scope.currentPage = 1;

 	$scope.pageChanged=function(){
 		getAllBagian($scope.currentPage); 		  
    };

	$scope.jenisTransaksi;
	//1. add
	//2. edit
	//3. deleter	
	$scope.selected = undefined;
	
	getAllBagian(1);
	getAllDirektorat();

	$scope.getAll=function(){
		getAllBagian(1);
	};

	
	$scope.tambahBagian=function(){
		focus(nama);
		$scope.jenisTransaksi=1;
		$scope.tutupGrid = !$scope.tutupGrid;
		$scope.classForm = 'formTambah';		
		$scope.bagian={
			id: 0,
			kode: "",
			nama: "",		
			direktorat: {
				id: 0,
				nama: ""
			},			
			status: "ACTIVE"
		};
		focus('kode');
	};

	function getAllBagian(halaman){
		//alert('get all kode arsip');
		$scope.criteriaKode;
		$scope.criteriaNama;
			

		if($scope.searchKode===''  && $scope.searchNama==='' ){
		 	bagianFactory
				.getAllBagianPage(halaman,$scope.itemsPerPage)
				.success(function (data){
				 	$scope.bagians = data.content ;
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

			bagianFactory
				.getBagianByKodeByNamaPage(criteriaKode, criteriaNama, halaman, $scope.itemsPerPage)
				.success(function (data){
				 	$scope.bagians = data.content ;
				 	$scope.totalItems = data.totalElements;
				 	growl.addInfoMessage(data.content.length);
				}).error(function(data){
					growl.addWarnMessage("Error Loading getAll data !",{ttl: 4000});		
				});	
		 }					
	};

	$scope.urut=function(urut_berdasar){
		$scope.orderBagian=urut_berdasar;		
	};

	$scope.ubahBagian=function(id, urut){
		$scope.jenisTransaksi=2;
		$scope.tutupGrid = !$scope.tutupGrid;
		$scope.classForm = 'formUbah';
		idx=urut;
		bagianFactory
			.getBagianById(id)
			.success(function(data){
				$scope.bagian =data;
				focus('kode');				
			})
			.error(function(data){
				growl.addWarnMessage("Error loading get by id ",{ttl:4000})
			});				
	};

	$scope.hapusBagian=function(id){
		$scope.jenisTransaksi=3;
		$scope.tutupGrid = !$scope.tutupGrid;
		$scope.classForm = 'formHapus';

		bagianFactory
			.getBagianById(id)
			.success(function(data){
				$scope.bagian =data;				
			})
			.error(function(data){
				growl.addWarnMessage("Error loading get by id ",{ttl:4000})
			});				
	};

	$scope.proses=function(){
		switch($scope.jenisTransaksi){
			case 1:
				$scope.bagian.id='';
				bagianFactory
					.isKodeBagianSudahAda($scope.bagian.kode)
					.success(function(data){
						if(data==true){
							growl.addWarnMessage("kode bagian sudah ada !");
						}else{
							bagianFactory
								.insertBagian($scope.bagian)
								.success(function(data){
									growl.addInfoMessage('insert success ' + data );
									// $scope.jenisTransaksi=2;
									$scope.bagian.id=data.id;
									$scope.bagians.push($scope.bagian) ;
									$scope.tutupGrid= !$scope.tutupGrid;
								})
								.error(function(data){
									growl.addWarnMessage('Error insert ' + data);		
								})
							
						}
					})
				
				break;
			case 2:
				bagianFactory
					.updateBagian($scope.bagian.id, $scope.bagian)
					.success(function(data){
						$scope.bagians[idx]=$scope.bagian;	
						growl.addInfoMessage('edit success');						
						$scope.tutupGrid= !$scope.tutupGrid;
					})
					.error(function(data){
						growl.addWarnMessage('Error Updata ' + data);
						//console.log(data);		
					})				
				break;
			case 3:
				bagianFactory
					.deleteBagian($scope.bagian.id)
					.success(function(data){
						growl.addInfoMessage('Delete success');		
						$scope.currentPage=1;
						getAllBagian(1);
						$scope.tutupGrid= !$scope.tutupGrid;
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

	function getAllDirektorat() {
		direktoratFactory
	    	.getAllDirektorat()
		    .success(function(response){
			    $scope.direktorats = response ;  
  			});
		};	

	$scope.preview = function(){
		$window.open($rootScope.pathServerJSON +'/api/bagian/laporan', 'Jurnal');
	}

}])