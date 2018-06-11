/**
 *  Module
 *
 * Description
 */
var app = angular.module('WMS600App', ['ui.bootstrap', 'ngResource', 'datatables', 'datatables.columnfilter']);

app.controller('WMS600QRPrintCtrl', function ($scope, $http, $q, $window, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder)
{
    $scope.hi = "ดีจ้า";
    /**************************************************
     * #Start Part Ctrl :: Warehouse :: Select Options
     * *************************************************/
    $scope.warehouse =
    {
        "availableOptions" : [],
        "selectedWarehose" :
        {
            "QWHCOM" : "TWC",
            "QWHCOD" : "WH2",
            "QWHNAME" : "วัดดอกไม้",
            "QWHUSER" : "YANTHANAT"
        }
    };
    var warehouse = $http.post('/WMS/api/wms100',
        {
            "action" : "getWarehouse"
        }
        );
    warehouse.then(doneCallbacks, failCallbacks)
    function doneCallbacks(res)
    {
        $scope.warehouse.availableOptions = res.data;
    };
    function failCallbacks(err)
    {
        $log.log(err)
    }
    /*************************************************
     * #END Part Ctrl :: Warehouse :: Select Options
     * ************************************************/

    /**
     * #Start : [checkInputIsNotEmpty description]
     */
    $scope.checkInputIsNotEmpty = checkInputIsNotEmpty;
    $scope.showBtnPreview = null;
    var validateInputFrom = null;
    var validateInputTo = null;

    function checkInputIsNotEmpty()
    {
        //เพิ่ม input ที่นี่ที่เดียวถ้ามีตัวอื่นมาเพิ่มอีกเรื่อยๆในอนาคตจะได้ไม่ก็อปปี้เพสพลาด
        validateInputFrom = [
            {
                name : 'taxInvNoFrom',
                value : $scope.taxInvNoFrom
            },
            {
                name : 'receiptDateFrom',
                value : $scope.receiptDateFrom
            },
            {
                name : 'qrIdFrom',
                value : $scope.qrIdFrom
            },
            {
                name : 'materialCodeFrom',
                value : $scope.materialCodeFrom
            },
            {
                name : 'materialCtrlFrom',
                value : $scope.materialCtrlFrom
            }
        ];

        validateInputTo = [
            {
                name : 'taxInvNoTo',
                value : $scope.taxInvNoTo
            },
            {
                name : 'receiptDateTo',
                value : $scope.receiptDateTo
            },
            {
                name : 'qrIdTo',
                value : $scope.qrIdTo
            },
            {
                name : 'materialCodeTo',
                value : $scope.materialCodeTo
            },
            {
                name : 'materialCtrlTo',
                value : $scope.materialCtrlTo
            }
        ];

        // if (checkAllInput())
        //     $scope.showBtnPreview = false;
        // else
        //     checkEachInput();
    }

    function checkAllInput()
    {
        var isAllValid = true;
        validateInputFrom.forEach(function (elm)
        {
            if (!isUndefinedEmptyOrNull(elm.value))
                isAllValid = false;
        }
        );
        validateInputTo.forEach(function (elm)
        {
            if (!isUndefinedEmptyOrNull(elm.value))
                isAllValid = false;
        }
        );
        return isAllValid;
    }

    function checkEachInput()
    {
        for (var i = 0; i < validateInputFrom.length; i++)
        {
            if (!isUndefinedEmptyOrNull(validateInputFrom[i].value))
            {
                $scope.showBtnPreview = !isUndefinedEmptyOrNull(validateInputTo[i].value) ? true : false;
            }
        }
    }

    /**
     * #End : [checkInputIsNotEmpty description]
     */

    /**
     * #Start : Tax Inv No. [Typeahead]
     */
    $scope.findTaxInvNo_Typeahead = function (src, text)
    {
        var uri = src === "from" ? '/WMS/api/wms600?action=findTaxInvNo&text=' + text : '/WMS/api/wms600?action=findTaxInvNo&taxInvNo=' + $scope.taxInvNoFrom + '&text=' + text;
        return $http.get(uri).then(function (res)
        {
            return res.data.map(function (elem)
            {
                return elem.QRMTAX;
            }
            );
        }
        );
    };
    /**
     * #End : Tax Inv No. [Typeahead]
     */

    /**
     * #Start : Check have tax invoice number.
     */
    $scope.checkHaveTaxInvNoFrom = true;
    $scope.checkHaveTaxInvNo = function (src, taxInvNo)
    {
        return $http.get('/WMS/api/wms600?action=checkHaveTaxInvNo&taxInvNo=' + taxInvNo).then(function (res)
        {
            if (src === "from")
            {
                $scope.checkHaveTaxInvNoFrom = res.data.length > 0 ? false : true;
                $scope.taxInvNoTo = !$scope.checkHaveTaxInvNoFrom ? $scope.taxInvNoTo : undefined;
            }
        }
        );
    };
    /**
     * #End : Check have tax invoice number.
     */

    /**
     * #Start : QR ID. [Typeahead]
     */
    $scope.findQRId_Typeahead = function (src, text)
    {
        var uri = src === "from" ? '/WMS/api/wms600?action=findQRId&text=' + text : '/WMS/api/wms600?action=findQRId&qrid=' + $scope.qrIdFrom + '&text=' + text;
        return $http.get(uri).then(function (res)
        {
            return res.data.map(function (elem)
            {
                return elem.QRMID;
            }
            );
        }
        );
    };
    /**
     * #End : QR ID. [Typeahead]
     */

    /**
     * #Start : Check have tax invoice number.
     */
    $scope.checkHaveQRCodeIDFrom = true;
    $scope.checkHaveQRCodeID = function (src, qrID)
    {
        return $http.get('/WMS/api/wms600?action=checkHaveQRCodeID&qrid=' + qrID).then(function (res)
        {
            // console.log(res)
            if (src === "from")
            {
                $scope.checkHaveQRCodeIDFrom = !!!res.data.QRMID; // !!res.data.QRMID = have data return from server == true ;
                $scope.qrIdTo = !$scope.checkHaveQRCodeIDFrom ? $scope.qrIdTo : undefined;
            }
            $scope.showBtnPreview = !!res.data.QRMID > 0 ? true : false;
        }
        );
    };
    /**
     * #End : Check have tax invoice number.
     */

    /**
     * #Start : Material Code. [Typeahead]
     */
    $scope.findMaterialCode_Typeahead = function (src, text)
    {
        var uri = src === "from" ? '/WMS/api/wms600?action=findMaterialCode&text=' + text : '/WMS/api/wms600?action=findMaterialCode&matcode=' + $scope.materialCodeFrom + '&text=' + text;
        return $http.get(uri).then(function (res)
        {
            return res.data.map(function (elem)
            {
                return elem.QRMCODE;
            }
            );
        }
        );
    };
    /**
     * #End : Material Code. [Typeahead]
     */

    /**
     * #Start : Check have Material Code.
     */
    $scope.checkHaveMaterialCodeFrom = true;
    $scope.checkHaveMaterialCode = function (src, matCode)
    {
        return $http.get('/WMS/api/wms600?action=checkHaveMaterialCode&matcode=' + matCode).then(function (res)
        {
          // console.log(res);
            if (src === "from")
            {
                $scope.checkHaveMaterialCodeFrom = res.data.length > 0 ? false : true;
                $scope.materialCodeTo = !$scope.checkHaveMaterialCodeFrom ? $scope.materialCodeTo : undefined;
            }
            if ( res.data.length > 0 ) {
              $scope.showBtnPreview = !!res.data[0].QRMCODE > 0 ? true : false;
            }
        }
        );
    };
    /**
     * #End : Check have Material Code.
     */

    $scope.receiptDateFrom = "";
    $scope.receiptDateTo = "";

    /**
     * #Start : Material Ctrl. [Typeahead]
     */
    $scope.findMaterialCtrl_Typeahead = function (src, text)
    {
        var uri = src === "from" ? '/WMS/api/wms600?action=findMaterialCtrl&text=' + text : '/WMS/api/wms600?action=findMaterialCtrl&matctrl=' + $scope.materialCtrlFrom + '&text=' + text;
        return $http.get(uri).then(function (res)
        {
            return res.data.map(function (elem)
            {
                return elem.SAPMCTRL;            //// MAT Ctrl.
            }
            );
        }
        );
    };
    /**
     * #End : Material Ctrl. [Typeahead]
     */

    /**
     * #Start : Check have Material Code.
     */
    $scope.checkHaveMaterialCtrlFrom = true;
    $scope.checkHaveMaterialCtrl = function (src, matCtrl)
    {
        return $http.get('/WMS/api/wms600?action=checkHaveMaterialCtrl&matctrl=' + matCtrl).then(function (res)
        {
          // console.log(res);
            if (src === "from")
            {
                $scope.checkHaveMaterialCtrlFrom = res.data.length > 0 ? false : true;
                $scope.materialCtrlTo = !$scope.checkHaveMaterialCtrlFrom ? $scope.materialCtrlTo : undefined;
            }
            if ( res.data.length > 0 ) {
              $scope.showBtnPreview = !!res.data[0].SAPMCTRL > 0 ? true : false;
            }
        }
        );
    };
    /**
     * #End : Check have Material Code.
     */
}
);
