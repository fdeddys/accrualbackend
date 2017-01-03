appServices.factory('isiBookingService', ['$http','$rootScope', 
	function($http, $rootScope){

	var isiBookingService = {};
	var urlApi = $rootScope.pathServerJSON + '/api/transaksi/jurnalHeader/isiBookingDate';

	isiBookingService.updateBookingDate =function(tgl, id){
		var datas ={
			'tglBook' : tgl,
			'userId' : $rootScope.globals.currentUser.authdata
		};
		
		return $http({
			method : 'POST',
			url : urlApi + '/id/' + id,
			data : JSON.stringify(datas)
		})
	}

	isiBookingService.getJurnalBayarIsTarikByPageByTgl=function(halaman, jumlah, vTgl1, vTgl2){

		return $http({
			method : 'GET',
			url : urlApi + '/jurnalPengeluaranIsTarik/' + vTgl1 + '/' + vTgl2 + '/' + halaman + '/' + jumlah			
		})
	}

	return  isiBookingService;
}])