appControllers.controller('jurnalPrintingController', ['$scope','$document', function($scope,$document ){

	$scope.printDiv = function (divName) {

    var printContents = $document.getElementById(divName).innerHTML;
    var originalContents = $document.body.innerHTML;      

    if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
        var popupWin = window.open('', '_blank', 'width=600,height=600,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
        popupWin.window.focus();
        popupWin.document.write('<!DOCTYPE html><html><head>' +
            '<link rel="stylesheet" type="text/css" href="style.css" />' +
            '</head><body onload="window.print()"><div class="reward-body">' + printContents + '</div></html>');
        popupWin.onbeforeunload = function (event) {
            popupWin.close();
            return '.\n';
        };
        popupWin.onabort = function (event) {
            popupWin.document.close();
            popupWin.close();
        }
    } else {
        var popupWin = window.open('', '_blank', 'width=800,height=600');
        popupWin.document.open();
        popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + printContents + '</html>');
        popupWin.document.close();
    }
    popupWin.document.close();

    return true;
}
}])