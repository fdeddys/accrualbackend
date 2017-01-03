appControllers.controller('direktoratController', 
	['$scope','direktoratFactory','growl', '$window','$rootScope','focus',
	function($scope,direktoratFactory, growl, $window, $rootScope, focus){
	// 
	var idx=0;
	$scope.tutupGrid=false;
	$scope.classForm='';
	$scope.direktorats=[];
	$scope.orderDirektorat='kode';
	$scope.direktorat={
		id: 0,		
		nama: "",
		kode:""
	};
	$scope.search='';


	$scope.jenisTransaksi;
	//1. add
	//2. edit
	//3. deleter	

	getAllDirektorat();

	$scope.getAll=function(){
		getAllDirektorat();
	};
	
	$scope.tambahDirektorat=function(){
		$scope.jenisTransaksi=1;
		$scope.tutupGrid = !$scope.tutupGrid;
		$scope.classForm = 'formTambah';
		$scope.direktorat.id='[Automatic]';				
		$scope.direktorat.nama='';
		$scope.direktorat.kode='';
		focus('kode');
	};

	function getAllDirektorat(){
		//alert('get all kode arsip');

		if($scope.search===''){
			direktoratFactory
				.getAllDirektorat()
				.success(function (data){
				 	$scope.direktorats = data ;				 					 	
				}).error(function(data){
					growl.addWarnMessage("Error Loading getAll data !",{ttl: 4000});		
				});				
		}else{
			direktoratFactory
				.getDirektoratByNama($scope.search )
				.success(function (data){
				 	$scope.direktorats = data ;				 	
				}).error(function(data){
					growl.addWarnMessage("Error Loading getAll data by nama !",{ttl: 4000});		
				});					
		}
		
	};

	$scope.urut=function(urut_berdasar){
		$scope.orderDirektorat=urut_berdasar;		
	};

	$scope.ubahDirektorat=function(id, nama,urut){
		$scope.jenisTransaksi=2;
		$scope.tutupGrid = !$scope.tutupGrid;
		$scope.classForm = 'formUbah';
		idx=urut;
		direktoratFactory
			.getDirektoratById(id)
			.success(function(data){
				$scope.direktorat =data;
				focus('kode');				
			});
		
		growl.addInfoMessage(urut);

	};

	$scope.hapusDirektorat=function(id, urut){
		$scope.jenisTransaksi=3;
		$scope.tutupGrid = !$scope.tutupGrid;
		$scope.classForm = 'formHapus';
		idx=urut;
		direktoratFactory
			.getDirektoratById(id)
			.success(function(data){
				$scope.direktorat =data;				
			});
		
		growl.addInfoMessage(urut);		
	};

	$scope.proses=function(){
		switch($scope.jenisTransaksi){
			case 1:
				$scope.direktorat.id='';

				direktoratFactory
					.isKodeDirektoratAda($scope.direktorat.kode)
					.success(function(data){
						if(data==true){
							growl.addWarnMessage("kode sudah ada !!")
						}else{
							direktoratFactory
								.insertDirektorat($scope.direktorat)
								.success(function(data){
									growl.addInfoMessage('insert success ' + data );
									$scope.jenisTransaksi=2;
									$scope.direktorat.id =data.id;
									$scope.direktorats.push($scope.direktorat);
									$scope.tutupGrid = !$scope.tutupGrid;
								})
								.error(function(data){
									growl.addWarnMessage('Error insert ' + data);		
								})								
						}
					})
				
				break;
			case 2:
				direktoratFactory
					.updateDirektorat($scope.direktorat.id, $scope.direktorat)
					.success(function(data){
						growl.addInfoMessage('edit success');	
						//$scope.direktorats[idx]=$scope.direktorat;	
						getAllDirektorat();
						$scope.tutupGrid = !$scope.tutupGrid;				

					})
					.error(function(data){
						growl.addWarnMessage('Error Updata ' + data);
						console.log(data);		
					})				
				break;
			case 3:
				direktoratFactory
					.deleteDirektorat($scope.direktorat.id)
					.success(function(data){
						growl.addInfoMessage('Delete success ');		
						//delete $scope.direktorats[idx];
						getAllDirektorat();
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
		 $window.open($rootScope.pathServerJSON + '/api/direktorat/laporan', '_blank');
	}

}])