var myApp = angular.module('appAccrual',[
	'ngRoute',
	'ngAnimate',
	'appControllers',
	'appServices',	
	'ngCookies',
	'angular-growl',	
	'ui.bootstrap'
]);

myApp.factory('focus', function($timeout, $window) {
	return function(id) {
      // timeout makes sure that it is invoked after any other event has been triggered.
      // e.g. click events that need to run before the focus or
      // inputs elements that are in a disabled state but are enabled when those events
      // are triggered.
      $timeout(function() {
      	var element = $window.document.getElementById(id);
      	if(element)
      		element.focus();
      });
  };
});

myApp.directive('eventFocus', function(focus) {
	return function(scope, elem, attr) {
		elem.on(attr.eventFocus, function() {
			focus(attr.eventFocusId);
		});

      // Removes bound events in the element itself
      // when the scope is destroyed
      scope.$on('$destroy', function() {
      	elem.off(attr.eventFocus);
      });
  };
});

myApp.run(['$window', '$rootScope', '$location', '$cookieStore', '$http', 
	function($window, $rootScope, $location, $cookieStore, $http){

	// buat hidden menu nya
	// kalo masuk form LOGIN sembunyikan
	// tapi logo nyo masih ado koq cumen bar menu bae yang ilang
	$rootScope.isLogin=false;

	// Pindahkan scroll selalu ke paling atas => efek dari animasi
	$rootScope.$on('$viewContentLoaded', function(){ window.scrollTo(0, 0); });

	// Path server database
	//$rootScope.pathServerJSON='http://127.0.0.1:8080/AccrualBasisDB';
	$rootScope.pathServerJSON='http://localhost:8088';


	// refresh masih tetep login brooo
    $rootScope.globals = $cookieStore.get('globals') || {};    
    if ($rootScope.globals.currentUser) {
        //$http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
    }
    $rootScope.isLogin = $cookieStore.get('isLogin') || {};
	

    $rootScope.$on('$routeChangeStart', function (event, next, current) {
        // redirect to login page, soalnya $rootScope blm login
        if ($location.path() !== '/login' && !$rootScope.globals.currentUser) {
            $location.path('/login');
        }
    });

}]);

myApp.config(['$routeProvider','$locationProvider','growlProvider',function($routeProvider,$locationProvider,growlProvider){
	
	// $locationProvider.html5Mode(true);
	growlProvider.globalTimeToLive(5000);

	$routeProvider.
		when('/',{
			templateUrl:'partials/utama.html'				
		}).
		when('/login',{
			templateUrl:'login.html',
			controller:'loginController'
		}).
		when('/masterDirektorat',{
			templateUrl:'partials/master/masterDirektorat.html',
		    controller:'direktoratController'
		}).
		when('/masterBagian',{
			templateUrl:'partials/master/masterBagian.html',
		    controller:'bagianController'
		}).		
		when('/masterCustomer',{
			templateUrl:'partials/master/masterCustomer.html',
			controller:'customerController'
		}).
		when('/masterBank',{
			templateUrl:'partials/master/masterBank.html',
			controller:'bankController'
		}).		
		when('/masterCoaHeader',{
			templateUrl:'partials/master/masterCoaHdr.html',
			controller:'coaHdrController'
		}).	
		when('/masterCoaDetil',{
			templateUrl:'partials/master/masterCoaDtl.html',
			controller:'coaDtlController'
		}).
		// when('/masterJurnal',{
		// 	templateUrl:'partials/transaksi/masterJurnal.html',
		// 	controller: 'jurnalController'
		// }).							
		when('/masterUser',{
			templateUrl:'partials/Utility/masterUser.html',
			controller: 'userController'
		}).	
		when('/transaksiJurnalHeader',{
			templateUrl:'partials/transaksi/jurnal.html',
			controller: 'jurnalController'
		}).
		when('/printJurnal',{
			templateUrl:'partials/printing/jurnalPrinting.html',
			controller: 'jurnalPrintingController'
		}).
		when('/transaksiJurnalDetil/:idDetil',{
			templateUrl:'partials/transaksi/jurnalDetil.html',
			controller: 'jurnalDetilController'
		}).
		when('/transaksiJurnalBalik/:idDetil',{
			templateUrl:'partials/transaksi/jurnalBalik.html',
			controller: 'jurnalBalikController'
		}).	
		when('/suratTransfer',{
			templateUrl:'partials/keuangan/suratTransfer.html',
			controller: 'suratTransferController'
		}).
		when('/suratTransferDetil/:idHd',{
			templateUrl:'partials/keuangan/suratTransferDetil.html',
			controller: 'suratTransferDetilController'
		}).			
		when('/inputBooking',{
			templateUrl:'partials/transaksi/isiBooking.html',
			controller: 'isiBookingController'
		}).	
		when('/config',{
			templateUrl:'partials/Utility/accrualConfig.html',
			controller: 'accrualConfigController'
		}).	
		when('/bukuBesar',{
			templateUrl:'partials/laporan/bukuBesar.html',			
			controller: 'bukuBesarController'
		}).	
		when('/tutupBulan',{
			templateUrl:'partials/laporan/tutupBulan.html',
			controller: 'tutupBulanController'
		}).				
		when('/posting/:isJurnalPengeluaran',{
			templateUrl:'partials/laporan/posting.html',
			controller: 'postingController'
		}).	
		when('/bbTrial',{
			templateUrl:'partials/transaksi/bukuBesarTrial.html',
			controller: 'bukuBesarTrialController'
		}).	
        otherwise({
			redirectTo:'/'
		});

}]);

