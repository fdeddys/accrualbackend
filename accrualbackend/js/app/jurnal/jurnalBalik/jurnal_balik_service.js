appServices.factory('jurnalBalikFactory', 
	['$http','$rootScope', 
	function($http,$rootScope){
	
	var urlApi = $rootScope.pathServerJSON + '/api/transaksi/jurnalHeader';
	var jurnalBalikFactory={};

	jurnalBalikFactory.prosesJurnal=function(idUser, idDebet, idKredit, idBank){
		return $http({
			method:'POST',
			url:urlApi+'/jurnalBalik/idUser/'+idUser+'/debet/'+idDebet+'/kredit/'+idKredit+'/bank/'+idBank
		})
	}

	return jurnalBalikFactory;

}])
