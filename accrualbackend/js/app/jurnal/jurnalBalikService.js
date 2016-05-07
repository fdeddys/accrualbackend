appServices.factory('jurnalBalikFactory', ['$http','$rootScope', function($http,$rootScope){
	
	var urlApi = $rootScope.pathServerJSON + '/transaksi/jurnalBalik';
	var jurnalBalikFactory={};
	
	jurnalBalikFactory.save=function(jurnalBalik){
		//jurnalBalikalert(urlApi);
		return $http({
			method:'POST',
			url:urlApi ,
			data:JSON.stringify(jurnalBalik),
			headers:{'Content-Type':'application/json'}
		});
	};	

	return jurnalBalikFactory;

}])