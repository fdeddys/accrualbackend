appControllers.controller('jurnalBalikController', 
	['$scope', '$uibModalInstance', 'id','focus','$filter','jurnalDetilFactory','bankFactory','growl',
	function($scope, $uibModalInstance, id, focus, $filter, jurnalDetilFactory, bankFactory, growl ){

	$scope.banks;
	$scope.total=0;
	// tanggal
		$scope.today = function() {
	    	$scope.tglBayar = new Date();	    	
		};
		

		$scope.open = function($event) {
		    $event.preventDefault();
		    $event.stopPropagation();
		    $scope.opened = true;		    
		};


		$scope.dateOptions = {
			formatYear: 'yy',
			startingDay: 1
		};
	// END tanggal


	function startModule(){
		$scope.id=id;		
		getDataHd();	
	}

	function getDataHd(){
		jurnalDetilFactory	
    		.getJurnalKreditDetilByIdJurnalHeaderPage($scope.id,1, 25)
    		.success(function(data){    			    
    			$scope.jurnalDetils = data.content;
    		})    	

		jurnalDetilFactory
    		.getJurnalDebetFirstByIdJurnalHeader($scope.id)
    		.success(function(data){    			    
    			$scope.jurnalDebet = data;
    		})    	
		
		bankFactory
			.getAllBank(1,1000)
			.success(function(data){
				$scope.banks = data.content;
				growl.addInfoMessage('get bank success');	
			})
			.error(function(data){
				growl.addWarnMessage("error loading bank ");	
			})
	}


	$scope.ok = function () {
		$uibModalInstance.close('sukses');    	
  	};

  	$scope.prosesBalik =function (idDetil){
  		//console.log(typeof($scope.bankPilih));
  		if(typeof($scope.bankPilih) == 'object'){
  			// bank sudah di pilih
  			jurnalBalikFactory
  				.prosesJurnal(idUser, idDebet, idKredit, idBank)
  				.success(function(data){
  					var hasil = data;
  					if(data.idBaru==null){
  						//gagal maning
  					}else{
  						//redirect to voucher
  						growl.addInfoMessage("success broo");
  					}
  				})
  		}else{
  			growl.addWarnMessage("Bank belum diisi !!");
  		}
  	}

  	startModule();
}])