app.controller('WMS100DisplayCtrl', function (WMS100Service, $scope, $compile, $http, $q, $window, $log, $resource, $location)
{
    $scope.hi = "hi ji";

    $scope.display = $window.display;

    function total(dts, prop)
    {
        console.log(dts)
        return dts.reduce(function (a, b)
        {
            console.log(a, b);
            return a + Number(b[prop]);
        }, 0);
    }

    console.log($scope.display)

    $scope.display.total =
    {
        "unit" : total($scope.display, "UNIT"),
        "unitAlt" : total($scope.display, "QRMALQTY"),
        "alt" : $scope.display[0].QRMAUN,
        "unitStd" : total($scope.display, "QRMQTY"),
        "basic" : $scope.display[0].QRMBUN
    }

    console.log($scope.display)

    $scope.print = print;
    function print()
    {
        window.open($location.protocol() + '://' + $location.host() + ':' + $location.port() + '/WMS100RP/controller/GetDataCtrl.jsp?a=print&item=' + $scope.display[0].QRMCODE + '&from=' + $scope.display[0].QRMROLL + '&to=' + $scope.display[$scope.display.length - 1].QRMROLL);
        console.log($scope.display);
        // var callPrintService = $http.get('/WMS/api/wms100?action=print&from=' + $scope.display[0].QRMID + '&to=' + $scope.display[$scope.display.length - 1].QRMID);
        // callPrintService.then(doneCallbacks, failCallbacks);
        // function doneCallbacks(res)
        // {
        //     console.info(res);
        // };
        // function failCallbacks(err)
        // {
        //     $log.error(err);
        // };
    }
}
);
