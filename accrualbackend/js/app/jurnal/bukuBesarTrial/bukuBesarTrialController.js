appControllers.controller('bukuBesarTrialController', 
	['$scope', '$rootScope','growl', 'focus','bukuBesarTrialFactory','coaDtlFactory','bankFactory','customerFactory',
	function($scope, $rootScope, growl, focus, bukuBesarTrialFactory, coaDtlFactory, bankFactory, customerFactory){

	$scope.pageChanged=function(){
 		getAllBukuBesarTrial($scope.currentPage); 		  
    };

    $scope.getAll = function(){
    	// if(typeof($scope.cariAcc)===  'object' ){
    	// 	console.log("object filled")
    	// }else{
    	// 	console.log("get all")
    	// }
		getAllBukuBesarTrial($scope.currentPage) ;		
    }

	$scope.getCoaDtlByKode = function(cari){

		return coaDtlFactory
				.getCoaDtlByKodePage(cari, 1, 10, true)
				.then(function(response){
					//console.log('load http' + response.data.nama); 
					coas=[];
					angular.forEach(response.data.content, function(item){
		                coas.push(item);		                
		            });
					return coas;
				})
    };   

    $scope.getCustomer=function(val){

        return customerFactory
        	.getCustomerByNamaPage(val,1,15)
        	.then(function (response) {
            var customers=[];            
            angular.forEach(response.data.content, function(item){
                customers.push(item);            
            });
            // growl.addInfoMessage('get all customer success');
            return customers;
        });			
		
    };

    $scope.closeCari = function(){
    	$scope.isCollapsed = !$scope.isCollapsed;
    }

    function getAllBukuBesarTrial(hal) {
    	var idCoa = -1;
    	if(typeof($scope.cariAcc)===  'object' ){
    		idCoa = $scope.cariAcc.idAccountDtl;
    		var rel;
    		var idCust;
    		var idBank;
    		if(typeof($scope.rel) == 'string'){
    			rel=$scope.rel;
    		}else{
    			rel="--";
    		}
    		if(typeof($scope.cariBank)===  'object' ){
    			idBank=$scope.cariBank.id;
    		}else{
    			idBank=0;
    		}
    		if(typeof($scope.cariCust)===  'object' ){
    			idCust=$scope.cariCust.id;
    		}else{
    			idCust=0;
    		}    	

			bukuBesarTrialFactory
		    	.getAll(idCoa, idBank, idCust, rel, hal, $scope.itemsPerPage)
			    .then(function(response){
				    $scope.bukuBesarTrials = response.data.content ;  
				    $scope.totalItems = response.data.totalElements;
	  			});
    		
    	}else{
    		//console.log("get all")
			//getAllBukuBesarTrial($scope.currentPage) ;		

    	}

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

	function startModule(){
		// Paging
		$scope.totalItems;
		$scope.itemsPerPage= 10;
		$scope.currentPage = 1;		
		$scope.isCollapsed = true;
		getAllBank();
		focus('kodeCoa');
		//getAllBukuBesarTrial($scope.currentPage);
	}

	startModule();
	
}])