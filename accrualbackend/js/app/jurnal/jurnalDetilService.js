appServices.factory('jurnalDetilFactory', ['$http','$rootScope', function($http,$rootScope){
	
	var urlApi = $rootScope.pathServerJSON + '/transaksi/jurnalDetil';
	var jurnalDetilFactory={};

	jurnalDetilFactory.getById=function(id){
		return $http({
			method:'GET',
			url:urlApi+'/id/'+id
		})
	}

	jurnalDetilFactory.getJurnalDetilByIdJurnalHeader=function(id){

		return $http({
			method:'GET',
			url:urlApi + '/' + id 
		})
	};

	jurnalDetilFactory.getJurnalDetilByIdJurnalHeaderPage=function(id, hal, jumlah){

		return $http({
			method:'GET',
			url:urlApi + '/' + id +'/hal/' + hal + '/jumlah/' + jumlah
		})
	};

	jurnalDetilFactory.save=function(jurnalDetil){
		//alert(urlApi);
		return $http({
			method:'POST',
			url:urlApi ,
			data:JSON.stringify(jurnalDetil),
			headers:{'Content-Type':'application/json'}
		});
	};

	jurnalDetilFactory.delete=function(id){
		return $http({
			method:'DELETE',
			url:urlApi + '/id/' + id 			
		})
	}
	
	return jurnalDetilFactory;

}])