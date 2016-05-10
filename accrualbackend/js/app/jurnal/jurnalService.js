	appServices.factory('jurnalHeaderFactory', ['$http','$rootScope', function($http,$rootScope){
	
	var urlApi = $rootScope.pathServerJSON + '/api/transaksi/jurnalHeader';
	var jurnalHeaderFactory={};

	jurnalHeaderFactory.getJurnalHeaderByPageByTgl=function(idUser, hal, jumlah, tgl1, tgl2, statusV){

		return $http({
			method:'GET',
			url:urlApi + '/idUser/' + idUser + '/hal/' + hal + '/jumlah/' + jumlah + '/tgl1/' + tgl1 + '/tgl2/' + tgl2	+'/statusV/' + statusV
		})
	};
						
	jurnalHeaderFactory.getJurnalHeaderByJurnalIdByUserId=function(jurnalId, userId){

		return $http({
			method:'GET',
			url:urlApi + '/id/'+jurnalId + '/user/'+userId 
		})
	};

	jurnalHeaderFactory.getJurnalPengeluaranByPageByTgl=function(hal, jumlah, tgl1, tgl2){
		return $http({
			method:'GET',
			url:urlApi + '/jurnalPengeluaran/hal/' + hal + '/jumlah/' + jumlah + '/tgl1/' + tgl1 + '/tgl2/' + tgl2
		})
	};

	jurnalHeaderFactory.getJurnalById=function(id){
		return $http({
			method:'GET',
			url:urlApi+'/id/'+id
		})
	}


	jurnalHeaderFactory.saveHeader=function(jurnalHeader){
		//alert(urlApi);
		return $http({
			method:'POST',
			url:urlApi ,
			data:JSON.stringify(jurnalHeader),
			headers:{'Content-Type':'application/json'}
		});
	};


	jurnalHeaderFactory.jurnalHeaderAdd=function(idUser, data){
		//alert(urlApi);
		return $http({
			method:'POST',
			url:urlApi +'/add/idUser/' + idUser ,
			data:JSON.stringify(data),
			headers:{'Content-Type':'application/json'}
		});
	};

	jurnalHeaderFactory.approveJurnal=function(id){
		//alert(urlApi);
		return $http({
			method:'POST',
			url:$rootScope.pathServerJSON +'/transaksi/jurnalHeader/approve/id/'+id 
		});
	};

	return jurnalHeaderFactory;

}])