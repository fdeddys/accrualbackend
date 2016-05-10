

appControllers.controller('jurnalDetilController', ['$scope','$routeParams','coaDtlFactory','growl','bankFactory','coaHdrFactory','jurnalHeaderFactory', 'userFactory', '$rootScope','$filter','customerFactory','jurnalDetilFactory','$location','accrualConfigFactory', '$uibModal', '$window','$document','focus',
	function($scope, $routeParams, coaDtlFactory, growl, bankFactory, coaHdrFactory, jurnalHeaderFactory,userFactory, $rootScope, $filter, customerFactory, jurnalDetilFactory, $location, accrualConfigFactory, $uibModal, $window, $document, focus){


	//Variabel
	var jumlahMaxRecord;
	var lastDesc;
	var lastDuit=0;
	var editData=false;

	//untuk cek kalo kas bank di kredit wajib isi customer
	var coaBank;
	var coaKas;

	//
	var customers=[];

	// untuk Badge jurnal Balik
	$scope.statusJurnalBalik='X';

	// Edit Detil
	$scope.editDetil=false;

	$scope.jenisVouchers=['PENERIMAAN', 'PENGELUARAN', 'PEMINDAHAN'];
	$scope.dks=['D','K'];
	

	// untuk hitung total debet / kredit di bawah
	$scope.totalDebet=0;
	$scope.totalKredit=0;

	//untuk iterate display grid
	$scope.jurnalDetils;
	$scope.coaDetils;
	$scope.banks;

		
	// untuk tampilan di UI berupa tombol
	// DISPLAY
	// ADD
	// EDIT
	// APPROVED
	$scope.StatusData='DISPLAY';
	// untuk enable / disable object
	$scope.kondisiView=true;
	$scope.disableDibayarKe=true;

	// approved
	$scope.approved=false;

	$scope.jurnalHeader={		
		id: 0,
		noUrut: '-',
		issueDate: '',
		bookingDate: '',
		noVoucher: '-',
		diBayar: '',
		statusVoucher: 'UNAPPROVED',
		jenisVoucher: null,
		idUser: '1'
	};

	$scope.jurnalDetil={
		id: null,
		jurnalHeader: null,
		accountDetil: null,
		bagian: null,
		keterangan: null,
		debet: null,
		kredit: null,
		bank: null,
		rel: null,
		customer: null,
		dk:'D',
		jumlah:null,
		tipeVoucher:null
	};

	// ENABLE bank - rel - cust
	$scope.enableBank=false;
	$scope.enableRel=false;
	$scope.enableCust=false;

	// Paging
	$scope.totalItems;
	$scope.itemsPerPage= 9;
	$scope.currentPage = 1;

	$scope.pageChanged=function(){
 		getAllDetil();
    };
	
	// tanggal
		$scope.today = function() {
	    	$scope.jurnalHeader.issueDate = new Date();	   
		};
		
		$scope.open = function($event) {
		    $event.preventDefault();
		    $event.stopPropagation();
		    $scope.opened = true;		    
		};

		$scope.dateOptions = {
			formatYear: 'yy',
			startingDay: 1
		};
	// END tanggal

	startModule();

	function bacaConfig(){
		accrualConfigFactory
			.getConfig()
			.success(function(data){
				jumlahMaxRecord=data.jumlahMaxVoucher;
				coaBank=data.coaBank;
				coaKas=data.coaKas;
			})
	};

	function startModule(){

		// untuk tanda = di keterangan
		lastDesc='';

		$scope.today();	
		$scope.jurnalHeader.jenisVoucher="PENERIMAAN";
		getAllCoaDetil();
		getAllBank();
		// default max record pada display 25 jika baca config gagal
		jumlahMaxRecord=25;
		bacaConfig();
		// Cek pengirim
		var param=$routeParams.idDetil;
		if(param==='new'){			
				
		}else{
			
			//alert($routeParams.idDetil);	
			//
			jurnalHeaderFactory
				.getJurnalHeaderByJurnalIdByUserId($routeParams.idDetil,$rootScope.globals.currentUser.authdata)
				.success(function(data){
					//alert(data);
					if(data==''){
						//alert('data tidak ketemu');
						$location.path('/');
					}else{				
						$scope.jurnalHeader=data;
						getAllDetil();
						$scope.StatusData='EDIT';	
						$scope.kondisiView=false;	
						//alert($scope.jurnalHeader.statusVoucher);
						if($scope.jurnalHeader.statusVoucher==='APPROVED'){
							$scope.approved=true;
					    	$scope.StatusData='APPROVED';		
							$scope.kondisiView=true;
							growl.addInfoMessage('Voucher approved');   
							if($scope.jurnalHeader.jenisVoucher==='PEMINDAHAN'){
								$scope.statusJurnalBalik='Ok';					
							}else{
								$scope.statusJurnalBalik='X';					
							} 			
						}
							

					}					
				})
				.error(function(data){
					//alert('gagal get jurnal header');				
				})				
		}						
	};

	
	function getAllCoaDetil(){
		coaDtlFactory
			.getCoaDtlByPage(1,1000,0)
			.success(function(data){
				$scope.coaDetils = data.content;
			})
			.error(function(data){
				growl.addWarnMessage("error loading coa ");	
			})
	};

	function getAllBank(){
		
		bankFactory
			.getAllBank(1,1000)
			.success(function(data){
				$scope.banks = data.content;
				growl.addInfoMessage('get bank success');	
			})
			.error(function(data){
				growl.addWarnMessage("error loading bank ");	
			})
	};

	$scope.cekLastDesc=function(keyEvent, idx){
		// alert('cek last desc');
		if($scope.jurnalDetil.keterangan==='='){
			$scope.jurnalDetil.keterangan=lastDesc;
		}
	};

	$scope.myFunct = function(keyEvent, idx) {
		
		if($scope.jurnalDetil.accountDetil===null){
			return false;	
		}
		var kodeBagian;

		coaHdrFactory
		  	.getBagianById($scope.jurnalDetil.accountDetil.accountHeader.idAccountHdr)
		  	.success(function(data){
		  		if(data ==='ERROR'){
		  			//KODE not found
		  			growl.addWarnMessage('kode bagian belum ada');
		  		}else{
		  			if(data.length<4){
		  				//kode bagian tidak diisi
		  				console.log("isi kode bagian = ["+data+"]")
		  				$scope.jurnalDetil.bagian ='';
		  				focus('idBagian');			
		  			}else{
		  				// lancar jaya
		  				console.log("LANCAR jaya = ["+data+"]")
		  				$scope.jurnalDetil.bagian =data;	
		  				focus('txtKeterangan');
		  			};
		  			$scope.enableBank=$scope.jurnalDetil.accountDetil.cashBank;
		  			$scope.enableCust=$scope.jurnalDetil.accountDetil.cust;
		  			$scope.enableRel = $scope.jurnalDetil.accountDetil.rel;	  

					if($scope.jurnalDetil.accountDetil.kodePerkiraan===coaBank || $scope.jurnalDetil.accountDetil.kodePerkiraan===coaKas){
				    	// alert('masuk coa bank');
						if($scope.jurnalDetil.dk==='K'){
							// alert('masuk K');
							if($scope.jurnalHeader.jenisVoucher==='PENGELUARAN')
								// alert('masuk pengeluaran');
								$scope.enableCust=true;
						}			
					}		
		  		}
		  		growl.addInfoMessage('get kode bagian success');	  		
		  	})
		  	.error(function(data){
		  		growl.addWarnMessage('error get kode bagian');
		  	})	  

	};

	$scope.transaksiBaru=function(){
		//$location.path('/#/transaksiJurnalDetil/new');
		$scope.jurnalHeader={		
			id: 0,
			noUrut: '-',
			issueDate: '',
			bookingDate: '',
			noVoucher: '-',
			diBayar: '',
			statusVoucher: 'UNAPPROVED',
			jenisVoucher: null,
			idUser: '1'
		};

		$scope.jurnalDetil={
			id: null,
			jurnalHeader: null,
			accountDetil: null,
			bagian: null,
			keterangan: null,
			debet: null,
			kredit: null,
			bank: null,
			rel: null,
			customer: null,
			dk:'D'
		};
		getAllDetil();

		lastDesc='';

		$scope.today();	
		$scope.jurnalHeader.jenisVoucher="PENERIMAAN";
		//angular.element('#comboJenis').trigger('focus');	
		//$scope.$broadcast('newItemAdded');	
		
		$scope.disableDibayarKe=true;
		$scope.kondisiView=false;
		$scope.StatusData='ADD';
		$scope.totalDebet=0;
		$scope.totalKredit=0;
		//$('#comboJenis').focus();
		//$document[0].getElementById('#comboJenis').focus();
  		//document.getElementById("comboJenis").focus();	
		//angular.element('#comboJenis').focus();	
		//angular.element('#id');
		//$document.find('#comboJenis').focus();
		//angular.element( document.querySelector('comboJenis')).focus();
		focus('comboJenis');
	};

	$scope.cekJenisVoucher=function(){
		if($scope.jurnalHeader.jenisVoucher==='PENGELUARAN'){
			$scope.disableDibayarKe=false;		
			focus('idDibayarKe');
		}else{
			$scope.disableDibayarKe=true;

		}
	};

	$scope.tambahDetil=function(){		

		if($scope.jurnalDetils!==undefined){
			if($scope.jurnalDetils.length>=jumlahMaxRecord){
				alert('max jumlah data = ' + jumlahMaxRecord);
				growl.addWarnMessage('max jumlah data = ' + jumlahMaxRecord);
				return false;
			}
		};

		if ($scope.jurnalDetil.accountDetil === null) {
			growl.addWarnMessage("id coa belum ada");
			return false;
		};

		if ($scope.jurnalDetil.accountDetil === '') {
			growl.addWarnMessage("id coa belum ada");
			return false;
		};

		if ($scope.jurnalDetil.accountDetil.length <6) {
			growl.addWarnMessage("id coa belum cukup");
			return false;
		};		

		if (!($scope.jurnalDetil.keterangan)) 
		{
			growl.addWarnMessage("Keterangan belum diisi")
			return false;
		};

		if (isNaN($scope.jurnalDetil.jumlah)) 
		{
			growl.addWarnMessage("Jumlah harus angka")
			return false;
		};

		var userNew;
		var vTgl1 = $filter('date')($scope.jurnalHeader.issueDate,'yyyy-MM-dd');
		var suksesTambahDetil =false;
		//var vTgl1 = $filter('date')($scope.jurnalHeader.issueDate,'dd-MMM-yyyy');
		// userFactory
		// 	.getUserById($rootScope.globals.currentUser.authdata)
		// 	.success(function(data){
		// 		userNew = data; 
		// 	});

		
		$scope.jurnalHeader.issueDate=vTgl1;
		$scope.jurnalHeader.bookingDate=vTgl1;
		$scope.jurnalHeader.idUser = $rootScope.globals.currentUser.authdata;	

		if($scope.jurnalHeader.id===0){
			jurnalHeaderFactory
				.jurnalHeaderAdd($rootScope.globals.currentUser.authdata,$scope.jurnalHeader)
				.success(function(data){
					$scope.jurnalHeader = data;							
					$scope.jurnalDetil.jurnalHeader=$scope.jurnalHeader;
					growl.addInfoMessage('save header success');
					simpanDetil($scope.jurnalDetil.jurnalHeader.id);				
				
				focus('cmbDK');
			});	
		}else{
			simpanDetil($scope.jurnalHeader.id);				
		}
		$scope.enableBank=false;
		$scope.enableRel=false;
		$scope.enableCust=false;
		//$('#comboJenis').focus();
		//if(suksesTambahDetil===true){
		focus('cmbDK');
		//}

	};

	$scope.editDetil=function(id){
		editData=true;
		$scope.jurnalDetil=null;
		jurnalDetilFactory
			.getById(id)
			.success(function(data){
				$scope.jurnalDetil=data;
				
				if(data.debet==0){
					$scope.jurnalDetil.jumlah=data.kredit;	

				}else{
					$scope.jurnalDetil.jumlah=data.debet;
				}
			})
			.error(function(data){
				growl.addWarnMessage(data);
			});
		//document.getElementById("kodeCoa").focus();	
		//angular.element('#kodeCoa').focus();
		focus(kodeCoa);

		// var selection = window.getSelection();
  //       var range = document.createRange();
  //       range.selectNodeContents(document.getElementById("kodeCoa"));
  //       selection.removeAllRanges();
  //       selection.addRange(range);
	};

	function simpanDetil(idHeader){

		var jurnalDetilDTO={			
			jurnalHeaderId:idHeader,
    		accountDetilId:$scope.jurnalDetil.accountDetil.idAccountDtl,
    		bagian:$scope.jurnalDetil.bagian,
    		keterangan:$scope.jurnalDetil.keterangan,
    		debet:$scope.jurnalDetil.debet,
    		kredit:$scope.jurnalDetil.kredit,    		
    		dk : $scope.jurnalDetil.dk,
    		rel:$scope.jurnalDetil.rel    		
		}

		if($scope.jurnalDetil.dk==="D"){
			jurnalDetilDTO.debet=$scope.jurnalDetil.jumlah;	
			jurnalDetilDTO.kredit=0;		
		}else{
			jurnalDetilDTO.debet=0;
			jurnalDetilDTO.kredit=$scope.jurnalDetil.jumlah;			
		};

		if(editData===true){
			jurnalDetilDTO.id=$scope.jurnalDetil.id;			
		}else{
			jurnalDetilDTO.id=0;
		}

		// cek apakah customer diisi, jika tidak isi dengan "0" 
		// agar di proses jadi null di server
		if($scope.jurnalDetil.customer===''){
			jurnalDetilDTO.customerId=0;
		}else{
			if(($scope.jurnalDetil.customer===null)){
				jurnalDetilDTO.customerId=0;	
			}else{
				jurnalDetilDTO.customerId=$scope.jurnalDetil.customer.id ;   			
			}			
		};

		// cek apakah Bank diisi, jika tidak isi dengan " - " agar di proses jadi null di server
		//bankId:$scope.jurnalDetil.bank.kode,
		if($scope.jurnalDetil.bank===''){
			jurnalDetilDTO.bankId=0;	
		}else{
			if($scope.jurnalDetil.bank===null){
				jurnalDetilDTO.bankId=0;	
			}else{
				jurnalDetilDTO.bankId=$scope.jurnalDetil.bank.kode ;   			
			}			
		};

		// coaDtlFactory
		// 	.isKodeCoaDtlExis(jurnalDetilDTO.accountDetilId)
		// 	.success(function(data){
		// 		if (data!=='Y') {
		// 			growl.addWarnMessage('Kode belum ada !!');
		// 			return false;
		// 		};
		// 	})
		
		jurnalDetilFactory
			.save(jurnalDetilDTO)
			.success(function(data){
				//refresh
				//alert('sukses');
				editData=false;
				growl.addInfoMessage('save detil success');				
				getAllDetil();
			})

	};

	$scope.getCustomer=function(val){
		growl.addInfoMessage('TYPE head function');
        return customerFactory.getCustomerByNamaPage(val,1,15).then(function (response) {
            //var customers=[];
            //console.log('jumlah response : ' + response.data.content.length);
            angular.forEach(response.data.content, function(item){
                customers.push(item);
                // console.log('tambah :' + item.namaSatuan);
            });
            growl.addInfoMessage('get all customer success');
            return customers;
        });
    };

    function getAllDetil(){
    	// jurnalDetilFactory
    	// 	.getJurnalDetilByIdJurnalHeader(idHeader)
    	// 	.success(function(data){
    	// 		$scope.jurnalDetils=data;
    	// 	})
		var vDebet=0;
		var vKredit=0;
		var d_k;
		jurnalDetilFactory	
    		.getJurnalDetilByIdJurnalHeaderPage($scope.jurnalHeader.id,$scope.currentPage, $scope.itemsPerPage)
    		.success(function(data){
    			$scope.jurnalDetils=data.content;
    			$scope.totalItems = data.totalElements;
    			growl.addInfoMessage('refresh list detil success');
    			//alert($scope.jurnalDetils);
    			d_k=$scope.jurnalDetil.dk;
    			lastDesc=$scope.jurnalDetil.keterangan;

    // 			angular.forEach($scope.jurnalDetils, function(jurnaldetil){
    // 				//alert(jurnaldetil);
    // 				//alert(jurnaldetil.debet);
    // 				//alert(jurnaldetil.kredit);
				// 	vDebet=vDebet + jurnaldetil.debet;
				// 	vKredit=vKredit + jurnaldetil.kredit;
				// });

				// $scope.totalDebet = vDebet;
				// $scope.totalKredit = vKredit;

				hitungDebetkredit();
				
    			$scope.jurnalDetil={
					id: null,
					jurnalHeader: null,
					accountDetil: null,
					bagian: null,
					keterangan: null,
					debet: null,
					kredit: null,
					bank: null,
					rel: null,
					customer: null,
					dk: d_k				
				};

				growl.addInfoMessage('Jumlah data ' + $scope.totalItems);
    		});    	
    };

 	function hitungDebetkredit(){
    	var vDebet=0;
		var vKredit=0;
		jurnalDetilFactory	
    		.getJurnalDetilByIdJurnalHeaderPage($scope.jurnalHeader.id,1, 25)
    		.success(function(data){
    			    			
    			angular.forEach(data.content, function(jurnaldetil){    				
					vDebet=vDebet + jurnaldetil.debet;
					vKredit=vKredit + jurnaldetil.kredit;
				});

				$scope.totalDebet = vDebet;
				$scope.totalKredit = vKredit;

    		});    		
    }

    $scope.approvedVoucher=function(){

    	if($scope.totalDebet==0){
    		alert('Total debet / kredit  masih nol');
    		growl.addWarnMessage('Total debet / kredit masih Nol !!');
    		return false;
    	};

    	if($scope.totalKredit==0){
    		alert('Total debet / kredit masih nol');
    		growl.addWarnMessage('Total debet / kredit masih Nol !!');
    		return false;
    	};

		if($scope.totalDebet != $scope.totalKredit){
    		alert('Total debet / kredit tidak sama');
    		growl.addWarnMessage('Total debet / kredit tidak sama !!');
    		return false;
    	};    	


    	jurnalHeaderFactory
    		.approveJurnal($scope.jurnalHeader.id)
    		.success(function(data){
    			var hasil=data;
    			if(hasil==='Y'){
    				$scope.approved=true;
			    	$scope.StatusData='APPROVED';		
					$scope.kondisiView=true;
					growl.addInfoMessage('Voucher approved');    
					if($scope.jurnalHeader.jenisVoucher==='PEMINDAHAN'){
						$scope.statusJurnalBalik='Ok';					
					}else{
						$scope.statusJurnalBalik='X';					
					}
					
    			}else{
    				growl.addWarnMessage('Error approve jurnal');
    			}
    		})	
    };

    $scope.batal=function(){
    	$scope.StatusData='DISPLAY';	
		$scope.kondisiView=true;	
    };

    $scope.jurnalBalik=function(){
    	
    	if($scope.jurnalHeader.id==='' || $scope.jurnalHeader.id== 0){
    		alert('jurnal Balik belum ada ID');
    	}else{
    		jurnalHeaderFactory
    			.getJurnalHeaderByJurnalIdByUserId($scope.jurnalHeader.id, $rootScope.globals.currentUser.authdata)
    			.success(function(data){
    				if(data.statusVoucher!=='APPROVED'){
    					alert('status belum approved');
    					growl.addWarnMessage('status belum approved')
    				}else{
    					if(data.idJurnalBalik==null ||data.idJurnalBalik=='' ){
    						//proses
    						if(data.jenisVoucher!=='PEMINDAHAN'){
    							alert('Tipe Jurnal Pemindahan baru bisa dibuat Jurnal Balik');
    							growl.addWarnMessage('Tipe Jurnal Pemindahan baru bisa dibuat Jurnal Balik')
    						}else{
    							$location.path('/transaksiJurnalBalik/'+$scope.jurnalHeader.id);	
    						}    						
    						
    					}else{
    						alert('Sudah ada jurnal balik nya!')
    						growl.addWarnMessage('Sudah ada jurnal balik nya!')
    					}
    				}
    			})
    			.error(function(data){
    				alert('Header ID tidak ditemukan');
    				growl.addWarnMessage('Header ID tidak ditemukan')
    			})
    	}
    }

    $scope.hapusDetil =function(id, nama){

    	var modalInstance = $modal.open({
			templateUrl: 'myModalContent.html',
			controller: 'ModalInstanceCtrl',
			size: '',
		    resolve: {
		        		idHeader: function () {
		          			return id;
		        		},
		        		kode: function () {
		          			return nama;
		        		}

	      			}
	    });

    	//alert(id);

    	modalInstance.result.then(function (id) {
	      	//$scope.selected = selectedItem;
	      	// /alert(id);
	      	//delete
	      	jurnalDetilFactory
	      		.delete(id)
	      		.success(function(data){
	      			growl.addInfoMessage("delete success ... ");
	      			getAllDetil();
	      		})
	      		.error(function(data){
	      			growl.addWarnMessage("error delete detail " + data)
	      		})
		    }, function () {
		      	growl.addInfoMessage('Batal delete : ' + new Date());
		    });
    	
	    };

    $scope.printJurnal=function(){
    	$location.path('/printJurnal');    	
    };

    $scope.previewLaporan=function(){
		 $window.open($rootScope.pathServerJSON + '/laporan/jurnal/'+$scope.jurnalHeader.id, '_blank');
	};

}]);


appControllers.controller('ModalInstanceCtrl', ['$scope', '$uibModalInstance','idHeader','kode', function($scope, $modalInstance,idHeader, kode){

	$scope.idHeader=idHeader;
	$scope.kode=kode;
	$scope.ok = function () {
    	$uibModalInstance.close($scope.idHeader);
  	};

  	$scope.cancel = function () {
    	$uibModalInstance.dismiss('cancel');
  	};
	
}])