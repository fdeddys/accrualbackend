appControllers.controller('accrualConfigController',['$scope','accrualConfigFactory','growl','coaDtlFactory',function($scope, accrualConfigFactory, growl, coaDtlFactory){		  	
	
	$scope.accrualConfig={
		id: 0,
		headerPenerimaan: "",
		headerPembayaran: "",
		headerPemindahan: "",
		coaBank: "",
		coaKas: "",
		coaJurnalBalik: ""
	};
	
	getConfig();


	function getConfig(){
		
		accrualConfigFactory
			.getConfig()
			.success(function (data){
			 	$scope.accrualConfig = data;
			}).error(function(data){
				growl.addWarnMessage("Error Loading get config !",{ttl: 4000});		
			});				
	};	

	$scope.proses=function(){		
		accrualConfigFactory
			.updateConfig($scope.accrualConfig)
			.success(function(data){
				growl.addInfoMessage('edit success');						
			})
			.error(function (data){
				growl.addWarnMessage('Error Updata ' + data);
				console.log(data);		
			})					
	};

	$scope.check=function(kode){

		coaDtlFactory
			.getCoaDtlByKodeByNamaPage(kode,'-',1,1,1)
			.success(function (data){
				$scope.accountDetil = data.content[0];
				// alert($scope.accountDetil.namaPerkiraan);
				if(data.content[0]==undefined){
					alert("Not Found");
				}else{
					alert(data.content[0].namaPerkiraan);					
				}
				//.namaPerkiraan
			})
			.error(function(data){
				growl.addWarnMessage("error loading data")
			})		
	}


}]);