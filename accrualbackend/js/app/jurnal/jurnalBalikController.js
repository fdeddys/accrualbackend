
appControllers.controller('jurnalBalikController', ['$scope','jurnalHeaderFactory','jurnalDetilFactory','accrualConfigFactory','$routeParams','$rootScope','growl','bankFactory','jurnalBalikFactory','$filter','$rootScope','$modal','$location',
	function($scope, jurnalHeaderFactory, jurnalDetilFactory, accrualConfigFactory, $routeParams, $rootScope, growl, bankFactory, jurnalBalikFactory, $filter, $rootScope, $modal, $location){

	// tempo 30 hari
	// var lamaTempo=30;

	// Paging
	$scope.totalItems;
	$scope.itemsPerPage= 10;
	$scope.currentPage = 1;

	$scope.bankId;

	$scope.banks;

	$scope.jurnalBalik={
		idJurnalHeader:0,
    	bankId:'',
    	dibayarKe:'',    	
    	idUser:'',
    	kodeCoa:''
	}

	$scope.pageChanged=function(){
 		getAllDetil();
    };		

    $scope.proses= function(idBank, dibayarKe){
    	alert(idBank.id + ' ' + dibayarKe);
    }

    $scope.prosesJurnal=function(){

		$scope.jurnalBalik.idJurnalHeader = $scope.jurnalHeader.id;
    	//$scope.jurnalBalik.tglBayar= $filter('date')($scope.tglBayar,'yyyy-MM-dd');
    	$scope.jurnalBalik.bankId=$scope.jurnalBalik.bankId.id;
    	$scope.jurnalBalik.idUser=$rootScope.globals.currentUser.authdata;
    	    	
    	jurnalBalikFactory
    		.save($scope.jurnalBalik)
    		.success(function(data){
    			//alert(data);
    			var modalInstance = $modal.open({
					templateUrl: 'myModalContentJurnalBalik.html',
					controller: 'ModalInstanceJurnalBalikCtrl',
					size: '',
				    resolve: {
				        		pesan: function () {
				          			return data;
				        		}
			      			}
			    });

			    modalInstance.result.then(function () {	    
			      		//Tombol OK - direct
			      		$location.path('/transaksiJurnalHeader');
				    }, function () {
				      	//Tombol close
				      	growl.addInfoMessage('close form : ' + new Date());
				});

    		})
    }

	function bacaConfig(){
		accrualConfigFactory
			.getConfig()
			.success(function(data){
				jumlahMaxRecord=data.jumlahMaxVoucher;
				coaBank=data.coaBank;
				coaKas=data.coaKas;
			})
	};

	function startModule(){
		
		bacaConfig();
		// Cek pengirim
		var param=$routeParams.idDetil;
		if(param==='' || param==null){			
			alert('tidak ada parameter untuk jurnal balik !!');		
		}else{
						
			jurnalHeaderFactory
				.getJurnalHeaderByJurnalIdByUserId($routeParams.idDetil,$rootScope.globals.currentUser.authdata)
				.success(function(data){
					//alert(data);
					if(data===''){
						alert('data tidak ketemu');
						$location.path('/');
					}else{				
						$scope.jurnalHeader=data;
						getAllBank();
						getAllDetil();											
					}					
				})
				.error(function(data){
					alert('gagal get jurnal header');				
				})				
		}	
		// $scope.today();					
	};
	

	function getAllBank(){
		
		bankFactory
			.getAllBank(1,1000)
			.success(function(data){
				$scope.banks = data.content;
				growl.addInfoMessage('get bank success');	
			})
			.error(function(data){
				growl.addWarnMessage("error loading bank ");	
			})
	};	


    function getAllDetil(){
    
		jurnalDetilFactory	
    		.getJurnalDetilByIdJurnalHeaderPage($scope.jurnalHeader.id,$scope.currentPage, $scope.itemsPerPage)
    		.success(function(data){
    			$scope.jurnalDetils=data.content;
    			$scope.totalItems = data.totalElements;
    			growl.addInfoMessage('get list detil success');    			
				
    		});    	
    };   

    // tanggal
		// $scope.today = function() {
	 //    	var tglHariIni= new Date() ;	   
	 //    	tglHariIni.setDate(tglHariIni.getDate()+lamaTempo);
	 //    	$scope.tglBayar =tglHariIni;
		// };
		
		// $scope.open = function($event) {
		//     $event.preventDefault();
		//     $event.stopPropagation();
		//     $scope.opened = true;		    
		// };

		// $scope.dateOptions = {
		// 	formatYear: 'yy',
		// 	startingDay: 1
		// };
	// END tanggal

	startModule();

}]);


appControllers.controller('ModalInstanceJurnalBalikCtrl', ['$scope', '$modalInstance', 'pesan',
	function($scope, $modalInstance, pesan){

	$scope.pesan = pesan;
	
	$scope.ok = function () {
    	$modalInstance.close('close');
  	};

  	$scope.cancel = function () {
    	$modalInstance.dismiss('cancel');
  	};
	
}])