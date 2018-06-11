app.controller('WMS001QRListCtrl', function ($scope, $http, $window, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder)
{
    $scope.hi = "ji";
    // console.info(_GET);

    if (_GET.action == "findQRMasterByItemCode")
    {
        var getQRId = $http.get('/WMS/api/wms001?action=findQRMasterByItemCode&st=' + _GET.st + '&itemCode=' + _GET.itemCode + '&plant=' + _GET.plant + '&storage=' + _GET.storage + '&valType=' + _GET.valType + '&taxInvNo=' + _GET.taxInvNo + '&matCtrl=' + _GET.matCtrl);

        getQRId.then(doneCallbacks, failCallbacks);
        function doneCallbacks(res)
        {
            // console.log(res);
            $scope.onhandList = res.data;
            for (var i = 0; i < $scope.onhandList.length; i++)
            {
                $scope.onhandList[i].QRMSTS = convertItemStatus($scope.onhandList[i].QRMSTS);
            }
        };
        function failCallbacks(err)
        {
            $log.error(err);
        };
    }
    else if (_GET.action == "findQRMasterByQRId")
    {
        var getQRIdDetail = $http.get('/WMS/api/wms001?action=findQRMasterByQRId&id=' + _GET.id);

        getQRIdDetail.then(doneCallbacks, failCallbacks);
        function doneCallbacks(res)
        {
            // console.info(res);
            $scope.onhandList = res.data.QRMMAS;
            $scope.transaction = res.data.QRMTRA;
            try
            {
                var getWhseName = $http.get('/WMS/api/wms001?action=findWarehouseName&whseCode=' + $scope.onhandList.QRMWHSE);
                getWhseName.then(doneCallbacks, failCallbacks);
                function doneCallbacks(res)
                {
                    $scope.onhandList.QRMWHSE = res.data.QWHNAME
                };
                function failCallbacks(err)
                {
                    $log.error(err);
                };
                $scope.onhandList.QRMSTS = convertItemStatus($scope.onhandList.QRMSTS);
            }
            catch (err)
            {
                console.error(err);
            }

        };
        function failCallbacks(err)
        {
            $log.error(err);
        };
    }
    $scope.findQRIdDetail = function (id)
    {
        $window.open('/WMS/WMS001/DP?action=findQRMasterByQRId&id=' + id, '_blank');
    }
}
);
