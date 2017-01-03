appControllers.controller('DialogConfirmCtrl', 
	['$scope', '$uibModalInstance','judul','pesan', 'id',
	function($scope, $uibModalInstance,judul, pesan, id){

	$scope.judul= judul;
	$scope.pesan = pesan;
	$scope.ok = function () {
    	$uibModalInstance.close(id);
  	};

  	$scope.cancel = function () {
    	$uibModalInstance.dismiss('cancel');
  	};
	
}])