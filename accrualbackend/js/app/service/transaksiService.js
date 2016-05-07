// appServices.factory('suratMasukFactory', ['$http','$rootScope', function($http,$rootScope){

// 	var urlApi =  $rootScope.pathServerJSON + '/arsip-rest-server/api/suratmasuk/';
// 	var suratMasuks ={};
	

// 	//http://10.1.0.11:8080/arsip-rest-server/api/suratmasuk/size/1/number/1

// 	suratMasuks.getSuratMasukByPage = function(hal,jumlah){
// 		return $http({
// 			method:'GET',
// 			url:urlApi + 'size/' + jumlah + '/number/' + hal + '/'
// 		});
// 	};	

// 	suratMasuks.getAllSuratMasuk = function(){
// 		return $http({
// 			method:'GET',
// 			url:urlApi
// 		});
// 	};

// 	suratMasuks.getByNamaSuratMasuk = function(nama){
// 		return $http({
// 			method:'GET',
// 			url:urlApi + '/nama/' +nama
// 		});			
// 	};

// 	suratMasuks.getByIdSuratMasuk = function(id){
// 		return $http({
// 			method:'GET',
// 			url:urlApi + '/id/' + id
// 		});			
// 	};

// 	suratMasuks.insertSuratMasuk = function(suratMasuk){
// 		return $http({
// 			method:'POST',
// 			url:urlApi,
// 			data:JSON.stringify(suratMasuk),
// 			headers:{'Content-Type':'application/json'}
// 		});
// 	};

// 	suratMasuks.deleteSuratMasuk = function (id){
// 		return $http({
// 			method:'DELETE',
// 			url:urlApi + '/' + id
// 		});
// 	}

// 	return suratMasuks;
// }]);