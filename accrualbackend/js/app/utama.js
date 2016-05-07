var myApp = angular.module('appAccrual',[
	'ngRoute',
	'ngAnimate',
	'appControllers',
	'appServices',	
	'ngCookies',
	'angular-growl',	
	'ui.bootstrap'
]);



myApp.run(['$window', '$rootScope', '$location', '$cookieStore', '$http', function($window, $rootScope, $location, $cookieStore, $http){

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
			templateUrl:'index2.html',
			controller:'index2Controller'
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
			templateUrl:'partials/transaksi/masterJurnal.html',
			controller: 'jurnalController'
		}).
		when('/printJurnal',{
			templateUrl:'partials/printing/jurnalPrinting.html',
			controller: 'jurnalPrintingController'
		}).
		when('/transaksiJurnalDetil/:idDetil',{
			templateUrl:'partials/transaksi/detilJurnal.html',
			controller: 'jurnalDetilController'
		}).
		when('/transaksiJurnalBalik/:idDetil',{
			templateUrl:'partials/transaksi/jurnalBalik.html',
			controller: 'jurnalBalikController'
		}).	
		when('/inputBooking',{
			templateUrl:'partials/transaksi/bookingPembayaran.html',
			controller: 'isiBookingController'
		}).	
		when('/config',{
			templateUrl:'partials/Utility/accrualConfig.html',
			controller: 'accrualConfigController'
		}).				
        otherwise({
			redirectTo:'/'
		});

}]);

