appServices.factory('isiBookingService', ['$http','$rootScope', 
	function($http, $rootScope){

	var isiBookingService = {};
	var urlApi = $rootScope.pathServerJSON + '/transaksi/isiBookingDate';

	isiBookingService.updateBookingDate=function(tgl, id){
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

	return  isiBookingService;
}])