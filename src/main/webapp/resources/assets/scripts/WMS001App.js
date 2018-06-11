/**
 *  Module
 *
 * Description
 */
var app = angular.module('WMS001App', ['ui.bootstrap', 'ngResource', 'datatables', 'datatables.columnfilter', 'ngSanitize']);

function convertItemStatus(statusCode)
{
    var statusName;
    switch (statusCode)
    {
    case "1":
        statusName = "1 : Received";
        break;
    case "2":
        statusName = "2 : Completed";
        break;
    case "3":
        statusName = "3 : Isued";
        break;
    case "4":
        statusName = "4 : Transported";
        break;
    case "5":
        statusName = "5 : Transformed";
        break;
    default:
        break;
    }
    return statusName;
};

app.controller('WMS001Ctrl', function (WMS001Service, WMS100Service, $scope, $log, $http, $q, $window, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $sce)
{
    $scope.name = "ji";

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
    var warehouse = WMS100Service.post('/WMS/api/wms100',
        {
            "action" : "getWarehouse"
        }
        );
    warehouse.then(doneCallbacks, failCallbacks)
    function doneCallbacks(res)
    {
        $scope.warehouse.availableOptions = res.data;
        // $scope.warehouse.selectedWarehose = res.data[1]; // default วัดดอกไม้
    };
    function failCallbacks(err)
    {
        $log.log(err)
    }
    /*************************************************
     * #END Part Ctrl :: Warehouse :: Select Options
     * ************************************************/

    $scope.sortingOrder =
    {
        "availableOptions" : [
            {
                "value" : 1,
                "label" : "1: รหัสวัตถุดิบ",
            },
            {
                "value" : 2,
                "label" : "2: Tax Inv no, รหัสวัตถุดิบ",
            },
            {
                "value" : 3,
                "label" : "3: Mat. Ctrl"
            }
        ],
        "selectedSortingOrder" :
        {
            "value" : 1,
            "label" : "1: รหัสวัตถุดิบ",
        }
    };

    $scope.changeSortingOrder = changeSortingOrder
    function changeSortingOrder()
    {
        try
        {
            if (isUndefinedEmptyOrNull($scope.warehouse.selectedWarehose) || isUndefinedEmptyOrNull($scope.sortingOrder.selectedSortingOrder))
            {
                throw "isUndefinedEmptyOrNull";
            }
            else
            {
                $scope.dtOptions = DTOptionsBuilder.newOptions()
                    .withOption().withColumnFilter(
                    {
                        aoColumns : [
                            null,
                            {
                                type : 'text'
                            },
                            {
                                type : 'text'
                            },
                            {
                                type : 'text'
                            },
                            {
                                type : 'text'
                            },
                            {
                                type : 'text'
                            },
                        ]
                    }
                    );

                $scope.dtColumnDefs = [
                ];

                var getOnhand = $http.get('/WMS/api/wms001?action=findOnhandOrderbyQRMCodeByWarehouse&whse=' + $scope.warehouse.selectedWarehose.QWHCOD + '&st=' + $scope.sortingOrder.selectedSortingOrder.value);
                getOnhand.then(doneCallbacks, failCallbacks);
                function doneCallbacks(res)
                {
                    console.info(res.data);
                    if (res.data.length > 0)
                    {
                        try
                        {
                            $scope.onhandList = res.data;
                        }
                        catch (e)
                        {
                            console.error(e)
                        }
                    }
                };
                function failCallbacks(err)
                {
                    $log.error(err);
                };
            }
        }
        catch (e)
        {
            // statements
            console.error(e);
        }
    }

    changeSortingOrder();

    /**
     * find qr code id.
     */
    $scope.findQRId = findQRId;

    function findQRId(dts)
    {
        console.log(dts);
        // send to api get findQRMasterByItemCode
        try
        {
            if (dts === undefined || dts === null || dts === "")
                throw "is undefined empty or null.";
            else
            {
                $window.open('/WMS/WMS001/DP?action=findQRMasterByItemCode&st=' + $scope.sortingOrder.selectedSortingOrder.value  + '&itemCode=' + dts.QRMCODE + '&plant=' + dts.QRMPLANT + '&storage=' + dts.QRMSTORAGE + '&valType=' + dts.QRMVAL + '&taxInvNo=' + dts.QRMTAX + '&matCtrl=' + dts.SAPMCTRL , '_blank');
            }
        }
        catch (e)
        {
            console.error(e);
        }
    }

    /**
     * End find qr code id.
     */

    /**
     * find Images Raw Materials
     */
    $scope.findImagesRawMaterials = findImagesRawMaterials;
    function findImagesRawMaterials(itemCode)
    {
        var getFileLists = $http.get('/WMS/api/wms001?action=findImagesRawMaterials&itemCode=' + itemCode);
        getFileLists.then(doneCallbacks, failCallbacks);
        function doneCallbacks(res)
        {
            $scope.images = res.data;
            var textHtmlIndicators = "";
            var textHtmlWrapperForSlides = "";
            angular.element(document.querySelector('#myCarousel')).addClass('carousel slide');
            if ($scope.images.length > 0)
            {
                for (var i = 0; i < $scope.images.length; i++)
                {
                    if (i == 0)
                    {
                        textHtmlIndicators += "<li data-target=\"#myCarousel\" data-slide-to=\"" + i + "\" class=\"active\"></li>";
                        textHtmlWrapperForSlides += "<div class=\"item active\" ><img src=\"../images/raw-materials/" + $scope.images[i] + "\" class=\"img-thumbnail img-responsive center-block\"></div>";
                    }
                    else
                    {
                        textHtmlIndicators += "<li data-target=\"#myCarousel\" data-slide-to=\"" + i + "\"></li>";
                        textHtmlWrapperForSlides += "<div class=\"item\"><img src=\"../images/raw-materials/" + $scope.images[i] + "\" class=\"img-thumbnail img-responsive center-block\"></div>";
                    }
                }
            }
            else
            {
                textHtmlIndicators += "<li data-target=\"#myCarousel\" data-slide-to=\"0\" class=\"active\"></li>";
                textHtmlWrapperForSlides += "<div class=\"item active\" ><img src=\"../images/raw-materials/noimages.JPG\" class=\"img-thumbnail img-responsive center-block\"></div>";
            }

            $scope.indicators = $sce.trustAsHtml(textHtmlIndicators);
            $scope.wrapperForSlides = $sce.trustAsHtml(textHtmlWrapperForSlides);
        };
        function failCallbacks(err)
        {
            $log.error(err);
        };
    }
    /**
     * End find Images Raw Materials
     */
}
);
