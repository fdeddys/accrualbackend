appControllers.controller('dialogTarikJurnalController', 
	['$scope', '$uibModalInstance', 'idBank','jurnalDetilFactory','namaBank','suratTransferFactory','idHdSuratTransfer',
	function($scope, $uibModalInstance, idBank, jurnalDetilService, namaBank, suratTransferFactory, idHdSuratTransfer){

  //alert('id surat ' +  idHdSuratTransfer);

  $scope.ok = function () {
      $uibModalInstance.close('close');
  };

  $scope.proses = function(index, jurnalId){

      // alert(index + '+' + jurnalId);
      // return ;
      var suratTransferDt={
        'suratTransferHdId' : idHdSuratTransfer,
        'jurnalDetilId' : jurnalId

      }
      suratTransferFactory
        .saveDt(suratTransferDt)
        .then(function(response){
          $scope.jurnalDetils.splice(index,1);          
        })
      
  }

  function tarikData(hal){
      jurnalDetilService      
        .listVoucST(hal, $scope.itemsPerPage)
        .then(function(response){
            $scope.jurnalDetils = response.data.content;
            $scope.totalItems = response.data.totalElements;
        })
  }

  function startModule(){
      $scope.totalItems;
      $scope.itemsPerPage= 7;
      $scope.currentPage = 1;
      tarikData($scope.currentPage);
      $scope.bank = namaBank;
      //$scope.supplier = namaCustomer;
  }

  $scope.pageChanged=function(){
      tarikData($scope.currentPage);       
  };

  startModule();

}])