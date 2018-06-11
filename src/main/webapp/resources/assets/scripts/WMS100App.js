var app = angular.module('WMS100App', ['ui.bootstrap', 'ngResource', 'datatables']);

app.controller('WMS100Ctrl', function (WMS100Service, $scope, $compile, $http, $q, $window, $log, $resource, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder)
{
    $scope.display = [];
    $scope.hi = "ji";
    /**
     * #set date default.
     */
    // $scope.selectedDt = moment().format('DD-MM-YYYY');

    $scope.dateReceive = "";

    $scope.listPreview = [];
    $scope.listPreviewTemp = [];

    $scope.dtOptions = DTOptionsBuilder.newOptions();
    $scope.dtColumnDefs = [
        DTColumnDefBuilder.newColumnDef(0),
        DTColumnDefBuilder.newColumnDef(1),
        DTColumnDefBuilder.newColumnDef(2).notSortable(),
        DTColumnDefBuilder.newColumnDef(3).notSortable(),
        DTColumnDefBuilder.newColumnDef(4).notSortable(),
        DTColumnDefBuilder.newColumnDef(5).notSortable(),
        DTColumnDefBuilder.newColumnDef(6).notSortable(),
        DTColumnDefBuilder.newColumnDef(7).notSortable()
    ];

    /**
     * #Start : check Item Code
     */
    $scope.findItem_Typeahead = function (value)
    {
        return $http.get('/WMS/api/wms100?action=findItem&item=' + value).then(function (res)
        {
            return res.data.map(function (elem)
            {
                return elem.SAPMAT;
            }
            );
        }
        );
    } // end findItem_Typeahead();
    $scope.itemCodeCheck = true;
    $scope.convertAltUMStatus = true;

    $scope.checkItemCode = function ()
    {
        if ($scope.itemCodeCheck)
        {
            $scope.itemCodeCheckStatus = false;
            $scope.convertAltUMStatus = true;
            var dts =
            {
                "data" :
                {
                    "itemCode" : isUndefinedEmptyOrNull($scope.itemCode) ? '' : $scope.itemCode,
                    // "valType" : parseInt($scope.valType.selectValType.value, 10),
                    "valType" : $scope.valType.selectValType.value
                },
                "action" : "findItem"
            };
            // console.log(dts);

            var config =
            {
                method : 'POST',
                url : '/WMS/api/wms100',
                contentType : 'application/json',
                data : JSON.stringify(dts)
            };

            var findItem = WMS100Service.service(config);
            findItem.then(doneCallbacks, failCallbacks);
            function doneCallbacks(res)
            {
                if (res.data.length > 0)
                {
                    // console.log(res);
                    $scope.itemName = res.data[0].SAPDESC;
                    $scope.unitSTD = res.data[0].SAPBUN;
                    $scope.itemCodeCheckStatus = true;
                    findConvertUnit(res);

                    findPlantAndStorage(res);

                }
                else
                {
                    $scope.itemName = "";
                    $scope.unitSTD = "";
                    $scope.basicUMAmount = "";
                    $scope.convertBasicUM = "";
                    $scope.convertAltUM = {};
                    $scope.itemCodeCheckStatus = false;
                }
            };
            function failCallbacks(err)
            {
                $log.error(err);
            }
        }
        else
        {
            $scope.itemCodeCheckStatus = true;
            $scope.convertAltUMStatus = false;
            $scope.altUMAmount = null;
            $scope.basicUMAmount = '';
            $scope.convertBasicUM = $scope.unitSTD;
            $scope.setUnit();
        }
    }
    $scope.findConvertUnit = findConvertUnit
    function findConvertUnit(input)
    {
        // console.log(input);

        var itemCode = angular.isObject(input) ? input.data[0].SAPMAT : input;

        var dts =
        {
            "data" :
            {
                "itemCode" : itemCode
            },
            "action" : "findConvertUnit"
        };
        var config =
        {
            method : 'POST',
            url : '/WMS/api/wms100',
            contentType : 'application/json',
            data : JSON.stringify(dts)
        };
        var findConvertUnit = WMS100Service.service(config);
        findConvertUnit.then(doneCallbacks, failCallbacks);
        function doneCallbacks(res)
        {
            if (res.data.length > 0)
            {
                // $scope.convertAltUMStatus = true;
                // console.log(res);
                $scope.altUMAmount = 1;
                $scope.convertAltUM.availableOptions = [];
                angular.forEach(res.data, function (el, index)
                {
                    var obj =
                    {
                        "value" : el.QCVAUN,
                        "lable" : el.QCVAUN
                    }
                    $scope.convertAltUM.availableOptions.push(obj);
                }
                );
                if (isUndefinedEmptyOrNull($scope.convertAltUM.selectConvertAltUM))
                {
                    $scope.convertAltUM.selectConvertAltUM = _.first($scope.convertAltUM.availableOptions);
                }
                // console.log($scope.convertAltUM.selectConvertAltUM.value)


                angular.forEach(res.data, function (el, index)
                {
                    // console.log(!isUndefinedEmptyOrNull($scope.convertAltUM.selectConvertAltUM))

                    if (!isUndefinedEmptyOrNull($scope.convertAltUM.selectConvertAltUM))
                    {
                        if (el.QCVAUN === $scope.convertAltUM.selectConvertAltUM.value)
                        {
                            // console.log(el, index)
                            $scope.basicUMAmount = el.QCVFAC;
                            $scope.convertBasicUM = el.QCVBUN;

                            $scope.unit.availableOptions = [
                                {
                                    "value" : $scope.unitSTD,
                                    "lable" : $scope.unitSTD
                                },
                                {
                                    "value" : $scope.convertAltUM.selectConvertAltUM.value,
                                    "lable" : $scope.convertAltUM.selectConvertAltUM.value
                                }
                            ];
                            $scope.unit.selectUnit =
                            {
                                "value" : $scope.convertAltUM.selectConvertAltUM.value,
                                "lable" : $scope.convertAltUM.selectConvertAltUM.value
                            };
                        }
                    }
                }
                );

            } //end if
            else
            {
                $scope.altUMAmount = 1; // set default equal 1
                $scope.convertAltUMStatus = false;
                $scope.basicUMAmount = 1; // set default equal 1
                $scope.convertBasicUM = $scope.unitSTD;
                $scope.convertAltUM.selectConvertAltUM =
                {
                    "value" : $scope.unitSTD
                };

                if ($scope.convertAltUM.selectConvertAltUM.value != $scope.unitSTD)
                {
                    $scope.unit.availableOptions = [
                        {
                            "value" : $scope.unitSTD,
                            "lable" : $scope.unitSTD
                        },
                        {
                            "value" : $scope.convertAltUM.selectConvertAltUM.value,
                            "lable" : $scope.convertAltUM.selectConvertAltUM.value
                        }
                    ];
                    $scope.unit.selectUnit =
                    {
                        "value" : $scope.convertAltUM.selectConvertAltUM.value,
                        "lable" : $scope.convertAltUM.selectConvertAltUM.value
                    };
                }
                else
                {
                    $scope.unit.availableOptions = [
                        {
                            "value" : $scope.unitSTD,
                            "lable" : $scope.unitSTD
                        }
                    ];
                    $scope.unit.selectUnit =
                    {
                        "value" : $scope.unitSTD,
                        "lable" : $scope.unitSTD
                    };
                }

            }
        };
        function failCallbacks(err)
        {
            $log.log(err);
        }
    }; // end findConvertUnit();

    function findPlantAndStorage(input)
    {
        var itemCode = angular.isObject(input) ? input.data[0].SAPMAT : input;

        // SET DEFAULT VALUE
        $scope.plant.selectPlant =
        {
            "value" : "1000",
            "lable" : "1000"
        };
        $scope.storage.selectStorage =
        {
            "value" : "RM04",
            "lable" : "RM04"
        };

        $http.get('/WMS/api/wms100?action=findSAPMasterAllByItem&item=' + itemCode).then(function (res)
        {

            $scope.plant.availableOptions = [];
            $scope.storage.availableOptions = [];

            var plant = [];
            var storage = [];
            angular.forEach(res.data, function (el, index)
            {
                plant.push(el.SAPPLANT);
                storage.push(el.SAPLOCATION);
            }
            );
            plant = _.uniq(plant);
            storage = _.uniq(storage);

            if (!_.contains(plant, '1000'))
            {
                $scope.plant.selectPlant =
                {
                    "value" : _.first(plant),
                    "lable" : _.first(plant)
                }
            }
            if (!_.contains(storage, 'RM04'))
            {
                $scope.storage.selectStorage =
                {
                    "value" : _.first(storage),
                    "lable" : _.first(storage)
                }
            }
            angular.forEach(plant, function (el, inx)
            {
                var objPlant =
                {
                    "value" : el,
                    "lable" : el
                }
                $scope.plant.availableOptions.push(objPlant);
            }
            );
            angular.forEach(storage, function (el, inx)
            {
                var objStorage =
                {
                    "value" : el,
                    "lable" : el
                }
                $scope.storage.availableOptions.push(objStorage);
            }
            );
        }
        );
    }

    $scope.setUnit = function ()
    {

        // console.log($scope.unitSTD);
        $scope.convertBasicUM = $scope.unitSTD;
        if (!isUndefinedEmptyOrNull($scope.unitSTD) && !isUndefinedEmptyOrNull($scope.convertAltUM.selectConvertAltUM.value))
        {
            if ($scope.convertAltUM.selectConvertAltUM.value != $scope.unitSTD)
            {
                $scope.unit.availableOptions = [
                    {
                        "value" : $scope.unitSTD,
                        "lable" : $scope.unitSTD
                    },
                    {
                        "value" : $scope.convertAltUM.selectConvertAltUM.value,
                        "lable" : $scope.convertAltUM.selectConvertAltUM.value
                    }
                ];
                $scope.unit.selectUnit =
                {
                    "value" : $scope.convertAltUM.selectConvertAltUM.value,
                    "lable" : $scope.convertAltUM.selectConvertAltUM.value
                };
            }
            else
            {
                $scope.unit.availableOptions = [
                    {
                        "value" : $scope.unitSTD,
                        "lable" : $scope.unitSTD
                    }
                ];
                $scope.unit.selectUnit =
                {
                    "value" : $scope.unitSTD,
                    "lable" : $scope.unitSTD
                };
            }

        }
        else if (isUndefinedEmptyOrNull($scope.unitSTD) && !isUndefinedEmptyOrNull($scope.convertAltUM.selectConvertAltUM.value))
        {
            $scope.unit.availableOptions = [
                {
                    "value" : $scope.convertAltUM.selectConvertAltUM.value,
                    "lable" : $scope.convertAltUM.selectConvertAltUM.value
                }
            ];
        }
        else if (!isUndefinedEmptyOrNull($scope.unitSTD) && isUndefinedEmptyOrNull($scope.convertAltUM.selectConvertAltUM.value))
        {
            $scope.unit.availableOptions = [
                {
                    "value" : $scope.unitSTD,
                    "lable" : $scope.unitSTD
                }
            ];
            $scope.unit.selectUnit =
            {
                "value" : $scope.unitSTD,
                "lable" : $scope.unitSTD
            };
        }
        else
        {
            $scope.unit.availableOptions = [];
        }
    }

    /**
     * #End :  check Item Code
     */

    /**
     * #Start : check Bill no.
     */
    $scope.findBill_Typeahead = function (val)
    {
        // return $http.get('/WMS/api/wms100?action=findBill&item=' + $scope.itemCode + '&po=' + $scope.poNo + '&bill=' + val).then(function (res)
        return $http.get('/WMS/api/wms100?action=findBill&item=' + $scope.itemCode + '&bill=' + val).then(function (res)
        {
            return res.data.map(function (elem)
            {
                return elem.SAPBILL;
            }
            )
        }
        );
    } // end findBill_Typeahead();
    $scope.checkBillNo = checkBillNo
    function checkBillNo()
    {
        // console.log($scope.itemCode, $scope.billNo);
        if (!isUndefinedEmptyOrNull($scope.billNo))
        {
            $http.get('/WMS/api/wms100?action=checkBillNo&item=' + $scope.itemCode + '&bill=' + $scope.billNo).then(doneCallbacks, failCallbacks);
            function doneCallbacks(res)
            {
                // console.log(isUndefinedEmptyOrNull(res.data[0]) )
                if (!isUndefinedEmptyOrNull(res.data[0]))
                {
                    $scope.poNo = res.data[0].SAPPO;
                    $scope.dateReceive = moment(res.data[0].SAPRCDT, "YYYYMMDD");
                    checkPO();
                }
            };
            function failCallbacks(err)
            {
                $log.error(err);
            }

        }
    }
    /**
     * #End : check Bill no.
     */

    /**
     * #Start : check PO no.
     */
    $scope.poNoCheck = true;
    $scope.findPO_Typeahead = function (val)
    {
        $scope.billNo = $scope.billNo === undefined ? '' : $scope.billNo;
        // console.log('/WMS/api/wms100?action=findPO&item=' + $scope.itemCode + '&bill=' + $scope.billNo + '&po=' + val);
        return $http.get('/WMS/api/wms100?action=findPO&item=' + $scope.itemCode + '&bill=' + $scope.billNo + '&po=' + val).then(function (res)
        {
            return res.data.map(function (elem)
            {
                return elem.SAPPO;
            }
            )
        }
        );
    } // end findPO_Typeahead();
    $scope.checkPO = checkPO;
    function checkPO()
    {
        if ($scope.poNoCheck)
        {
            $scope.poNoCheckStatus = false;
            var checkPO = $http.get('/WMS/api/wms100?action=checkPO&item=' + $scope.itemCode + '&po=' + $scope.poNo);
            checkPO.then(doneCallbacks, failCallbacks);
            function doneCallbacks(res)
            {
                // console.info(res);
                if (res.data.length > 0)
                {
                    $scope.poNoCheckStatus = true;
                }
                else
                {
                    // $scope.billNo = '';
                    $scope.poNoCheckStatus = false;
                }
            };
            function failCallbacks(err)
            {
                $log.error(err);
            };
        }
        else
        {
            $scope.poNoCheckStatus = true;
        }
    } // end checkPO();
    /**
     * #End :  check PO no.
     */

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
        // console.log(res)
        $scope.warehouse.availableOptions = res.data;
        // $scope.warehouse.selectedWarehose = res.data[1];    // default วัดดอกไม้
    };
    function failCallbacks(err)
    {
        $log.log(err)
    }
    /*************************************************
     * #END Part Ctrl :: Warehouse :: Select Options
     * ************************************************/

    /**
     * #Start : Val. Type :: Select Options
     */
    $scope.valType =
    {
        "availableOptions" : [
            {
                "value" : "00",
                "lable" : "00"
            },
            {
                "value" : "01",
                "lable" : "01"
            },
            {
                "value" : "03",
                "lable" : "03"
            }
        ],
        "selectValType" :
        {
            "value" : "01",
            "lable" : "01"
        }
    }
    /**
     * #End : Val. Type :: Select Options
     */

    /**
     * #Start : Conversion Factor :: Select Options
     */
    $scope.convertAltUM =
    {
        "availableOptions" : [],
        "selectConvertAltUM" : {}
    };
    /**
     * #End : Conversion Factor :: Select Options
     */

    /**
     * #Start : Unit
     */
    $scope.unit =
    {
        "availableOptions" : [
            {
                "value" : "M",
                "lable" : "M"
            }
        ],
        "selectUnit" :
        {}
    };
    /**
     * #End : Unit :: Select Options
     */

    /**
     * #Start : Plant
     */
    $scope.plant =
    {
        "availableOptions" : [],
        "selectPlant" :
        {
            "value" : "1000",
            "lable" : "1000"
        }
    };
    /**
     * #End : Plant
     */

    /**
     * #Start : Storage
     */
    $scope.storage =
    {
        "availableOptions" : [],
        "selectStorage" :
        {
            "value" : "RM04",
            "lable" : "RM04"
        }
    };
    /**
     * #End : Storage
     */

    /**
     * #Start : Package Type :: Select Options
     */
    $scope.packageType =
    {
        "availableOptions" : [
            {
                "value" : "BAG",
                "lable" : "BAG"
            },
            {
                "value" : "BOX",
                "lable" : "BOX"
            },
            {
                "value" : "ROL",
                "lable" : "ROLL"
            },
            {
                "value" : "PACK",
                "lable" : "PACK"
            }
        ],
        "selectPackageType" :
        {
            "value" : "BAG",
            "lable" : "BAG"
        }
    }
    /**
     * #End : Package Type :: Select Options
     */

    /**
     *
     */
    $scope.generateIdButtonShow = function ()
    {
        if ($scope.totalQty === undefined && $scope.listPreview.grandTotal === undefined)
        {
            return false;
        }
        else
        {
            return $scope.totalQty - $scope.listPreview.grandTotal == 0.0000
        }
    };

    $scope.generateId = function ()
    {
        var dts =
        {
            "action" : "add",
            "data" : $scope.listPreview
        }
        console.log("generateId()", dts);
        var config =
        {
            method : 'POST',
            url : '/WMS/api/wms100',
            contentType : 'application/json',
            data : JSON.stringify(dts)
        };

        $scope.btnGenerateIdIsClick = true;         /// disabled when click btn Generate ID

        // Call APIs
        var add = WMS100Service.service(config);
        add.then(doneCallbacks, failCallbacks);
        function doneCallbacks(res)
        {
            console.log("dts after add() => ", res);
            if (res.data.response.length > 0)
            {
                var $display = $window.open('/WMS/WMS100/RE?action=display', '_blank');
                $display.display = res.data.response;

                $window.location.reload();
            }
            else
            {
                $log.errer("fail");
            }

        };
        function failCallbacks(err)
        {
            $log.log(err);
        }

    }

    /**
     * #Start : add()
     */
    $scope.addOrEdit = function ()
    {
        try
        {
            var dts =
            {
                "data" :
                {
                    "warehouse" : $scope.warehouse.selectedWarehose.QWHCOD,
                    "itemCode" : $scope.itemCode,
                    "valType" : $scope.valType.selectValType.value,
                    "plant" : $scope.plant.selectPlant.value,
                    "storage" : $scope.storage.selectStorage.value,
                    "itemName" : $scope.itemName,
                    "unitSTD" : $scope.unitSTD,
                    "totalQty" : $scope.totalQty,
                    // "dateReceive" : $scope.dateReceive.search(/\//gi) === -1 ? $scope.dateReceive : $scope.dateReceive.split("/")[2] + "" + $scope.dateReceive.split("/")[1] + "" + $scope.dateReceive.split("/")[0],
                    "dateReceive" : moment($scope.dateReceive).isValid() ? moment($scope.dateReceive).format("YYYYMMDD") : null,
                    "poNo" : $scope.poNo,
                    "billNo" : $scope.billNo,
                    "altUMAmount" : $scope.altUMAmount,
                    "convertAltUM" : $scope.convertAltUM.selectConvertAltUM.value,
                    "basicUMAmount" : $scope.basicUMAmount,
                    "convertBasicUM" : $scope.convertBasicUM,
                    "unitAmount" : $scope.unit.selectUnit.value == $scope.convertAltUM.selectConvertAltUM.value ? Number.parseFloat((($scope.unitAmount / $scope.altUMAmount) * $scope.basicUMAmount).toFixed(3)) : Number.parseFloat($scope.unitAmount.toFixed(3)),
                    "packageAmount" : $scope.packageAmount,
                    "packageType" : $scope.packageType.selectPackageType.value,
                    "unit" : $scope.unit.selectUnit.value,
                }
                // ,
                // "action" : "add"
            };

            // check หน่วยแปลง ต้นทางกับปลายทาง ตรงกันไหม
            if ($scope.convertAltUM.selectConvertAltUM.value != $scope.convertBasicUM)
            {
                Object.assign(dts.data,
                {
                    "unitAltAmount" : $scope.unit.selectUnit.value == $scope.convertAltUM.selectConvertAltUM.value ? Number.parseFloat($scope.unitAmount.toFixed(3)) : 0,
                    "unitAltAmountConverted" : $scope.unit.selectUnit.value == $scope.convertAltUM.selectConvertAltUM.value ? Number.parseFloat($scope.unitAmount.toFixed(3)) : Number.parseFloat((($scope.unitAmount * $scope.altUMAmount) / $scope.basicUMAmount).toFixed(3)),
                    "unitStdAmount" : $scope.unit.selectUnit.value == $scope.convertBasicUM ? Number.parseFloat($scope.unitAmount.toFixed(3)) : 0,
                }
                );
            }
            else
            {
                Object.assign(dts.data,
                {
                    "unitAltAmount" : 0,
                    "unitAltAmountConverted" : $scope.unit.selectUnit.value == $scope.convertAltUM.selectConvertAltUM.value ? $scope.unitAmount : ($scope.unitAmount * $scope.altUMAmount) / $scope.basicUMAmount,
                    "unitStdAmount" : $scope.unit.selectUnit.value == $scope.convertBasicUM ? $scope.unitAmount : 0,
                }
                );
            }

            console.log(dts);

            validate(dts);
            var dtsTemp = angular.copy(dts);

            if (!$scope.actionEdit)
            {

                // check grand total
                $scope.listPreviewTemp.push(dtsTemp);
                // Cal Total Temp
                calculateTotal($scope.listPreviewTemp);
                console.log($scope.listPreviewTemp.grandTotal, $scope.totalQty, $scope.listPreviewTemp.grandTotal - $scope.totalQty);
                if (($scope.listPreviewTemp.grandTotal - $scope.totalQty) > 0.0000)
                {
                    $scope.listPreviewTemp.splice([$scope.listPreviewTemp.length - 1], 1);
                    throw ("Grand Total มากกว่า Total QTY.");
                }

                /*************
                 *  #$ Add data into list preview.
                 */
                console.log(dts);
                $scope.listPreview.push(dts);
                clearFieldAfterAddOrEdit();
                angular.element('#unitAmount').focus();

            }
            else
            {

                // angular.merge($scope.listPreviewTemp[$scope.actionEditIndex], dts);
                Object.assign($scope.listPreviewTemp[$scope.actionEditIndex], dtsTemp);

                calculateTotal($scope.listPreviewTemp);
                console.log($scope.listPreviewTemp.grandTotal, $scope.totalQty, $scope.listPreviewTemp.grandTotal - $scope.totalQty);
                if ($scope.listPreviewTemp.grandTotal - $scope.totalQty > 0.0000)
                {
                    // $scope.listPreviewTemp.splice([$scope.listPreviewTemp.length - 1], 1);
                    throw ("Grand Total มากกว่า Total QTY.");
                }

                Object.assign($scope.listPreview[$scope.actionEditIndex], dtsTemp);

                $scope.actionEdit = false;
                $scope.actionEditIndex = null;
                clearFieldAfterAddOrEdit();
                angular.element('#unitAmount').focus();
            }
            // console.log($scope.listPreview)
            calculateTotal($scope.listPreview);
        }
        catch (err)
        {
            alertify.error(err);
        }

    };

    function validate(dts)
    {

        if (isUndefinedEmptyOrNull(dts.data.itemCode))
            throw "รหัสวัตถุดิบ ห้ามว่าง";
        else if (!$scope.itemCodeCheckStatus)
            throw "รหัสวัตถุดิบ " + $scope.itemCode + " และ Value Type นี้ไม่มีอยู่ใน SAP MASTER";
        if (isUndefinedEmptyOrNull(dts.data.plant))
            throw "plant ห้ามว่าง";
        if (isUndefinedEmptyOrNull(dts.data.storage))
            throw "storage ห้ามว่าง";
        if (isUndefinedEmptyOrNull(dts.data.itemName))
            throw "ชื่อวัตถุดิบ ห้ามว่าง";
        if (isUndefinedEmptyOrNull(dts.data.unitSTD))
            throw "unitSTD ห้ามว่าง";
        if (dts.data.totalQty === undefined || dts.data.totalQty === null)
            throw "Total QTY. ห้ามว่าง";
        if (isUndefinedEmptyOrNull(dts.data.dateReceive))
            throw "วันที่ของเข้า ห้ามว่าง";
        if (_.isEqual(dts.data.dateReceive, "00000101") || _.isEqual(dts.data.dateReceive, "null"))
            throw "วันที่ของเข้า ไม่ถูกต้อง";
        if (isUndefinedEmptyOrNull(dts.data.poNo))
            throw "เลขที่ PO ห้ามว่าง";
        else if (!$scope.poNoCheckStatus)
            throw "PO นี้ไม่มีอยู่ใน SAP PO MASTER";
        // if (isUndefinedEmptyOrNull(dts.data.billNo))
        //     throw "เลขที่ Bill ห้ามว่าง";
        if (dts.data.altUMAmount === undefined || dts.data.altUMAmount === null)
            throw "จำนวนหน่วยแปลงต้นทาง ห้ามว่าง";
        else if (dts.data.altUMAmount === 0)
            throw "จำนวนหน่วยแปลงต้นทาง ต้องไม่เท่ากับ 0";
        if (isUndefinedEmptyOrNull(dts.data.convertAltUM))
            throw "หน่วยแปลงต้นทาง ห้ามว่าง";
        if (dts.data.basicUMAmount === undefined || dts.data.basicUMAmount === null || dts.data.basicUMAmount === '')
            throw "จำนวนหน่วยแปลงปลายทาง ห้ามว่าง";
        else if (dts.data.basicUMAmount == 0)
            throw "จำนวนหน่วยแปลงปลายทาง ต้องไม่เท่ากับ 0";
        if (isUndefinedEmptyOrNull(dts.data.convertBasicUM))
            throw "หน่วยแปลงปลายทาง ห้ามว่าง";
        if (dts.data.unitAmount === undefined || dts.data.unitAmount === null)
            throw "ปริมาณ ห้ามว่าง";
        else if (dts.data.unitAmount === 0)
            throw "ปริมาณ ต้องไม่เท่ากับ 0";
        if (dts.data.packageAmount === undefined || dts.data.packageAmount === null)
            throw "Package Amount ห้ามว่าง";
        else if (dts.data.packageAmount === 0)
            throw "Package ต้องไม่เท่ากับ 0";
        else if (!dts.data.packageType)
            throw "Package Type ห้ามว่าง";
        if (isUndefinedEmptyOrNull(dts.data.unit))
            throw "หน่วยนับ ห้ามว่าง";
    }

    function clearFieldAfterAddOrEdit()
    {
        $scope.unitAmount = null;
        $scope.packageAmount = 1;
        if ($scope.convertAltUM.selectConvertAltUM.value != $scope.unitSTD)
        {
            $scope.unit.selectUnit =
            {
                "value" : $scope.convertAltUM.selectConvertAltUM.value,
                "lable" : $scope.convertAltUM.selectConvertAltUM.value
            };
        }
        else
        {
            $scope.unit.selectUnit =
            {
                "value" : $scope.unitSTD,
                "lable" : $scope.unitSTD
            };
        }
    }

    /**
     * #End : add()
     */

    /**
     * #Start : calculate total function
     */
    function listPreviewTotal(listPreview, prop)
    {
        if (prop === 'packageAmount')
        {
            return listPreview.reduce(function (a, b)
            {
                return a + b.data[prop];
            }, 0);
        }
        else if (prop === 'unitAlt')
        {
            return listPreview.reduce(function (a, b)
            {
                return a + (b.data['unitAltAmount'] * b.data['basicUMAmount'] * b.data['packageAmount']);
            }, 0);
        }
        else
        {
            return listPreview.reduce(function (a, b)
            {
                return a + (b.data[prop] * b.data['packageAmount']);
            }, 0);
        }
    };

    function calculateTotal(list)
    {
        // Cal Total
        list.packageTotal = listPreviewTotal(list, 'packageAmount');
        list.unitAltTotal = listPreviewTotal(list, 'unitAltAmount');
        list.unitStdTotal = listPreviewTotal(list, 'unitStdAmount');
        /*-----------------------------*/

        list.unitAmountTotal = listPreviewTotal(list, 'unitAlt');

        // sum and convert to standard or basic unit
        list.totalUnitStd =
        {
            // "unitAlt" : list.unitAltTotal * $scope.basicUMAmount,
            "unitAlt" : list.unitAmountTotal,
            "unitStd" : list.unitStdTotal
        };

        list.grandTotal = Number.parseFloat((list.totalUnitStd.unitAlt + list.totalUnitStd.unitStd).toFixed(3));
    }
    /**
     * #End : calculate total function
     */

    /**
     * #Start : remove()
     */

    $scope.selectedRemove = false;

    $scope.remove = remove
    function remove(index)
    {
        $scope.listPreview.splice(index, 1);

        $scope.listPreviewTemp.splice(index, 1);
        // Cal Total Temp
        calculateTotal($scope.listPreviewTemp);

        calculateTotal($scope.listPreview);
    }

    /**
     * #End : remove()
     */

    /**
     * #Start : edit()
     */
    $scope.edit = edit
    function edit(index)
    {
        console.log(index, $scope.listPreview[index]);
        // SET Edit flag
        $scope.actionEdit = true;
        $scope.actionEditIndex = index;
        // SET data to form
        $scope.dateReceive = $scope.listPreview[index].data.dateReceive;
        // $scope.dateReceive = moment($scope.listPreview[index].data.dateReceive).format("DD/MM/YYYY")
        $scope.poNo = $scope.listPreview[index].data.poNo;
        $scope.billNo = $scope.listPreview[index].data.billNo;
        $scope.altUMAmount = $scope.listPreview[index].data.altUMAmount;
        $scope.convertAltUM.selectConvertAltUM =
        {
            "lable" : $scope.listPreview[index].data.convertAltUM,
            "value" : $scope.listPreview[index].data.convertAltUM
        };
        $scope.basicUMAmount = $scope.listPreview[index].data.basicUMAmount;
        $scope.convertBasicUM = $scope.listPreview[index].data.convertBasicUM;
        // $scope.unitAmount = ( $scope.listPreview[index].data.convertAltUM == $scope.listPreview[index].data.convertBasicUM ) && ( $scope.listPreview[index].data.unit == $scope.listPreview[index].data.convertAltUM )  ? $scope.listPreview[index].data.unitStdAmount : $scope.listPreview[index].data.unitAltAmount;

        if ($scope.listPreview[index].data.convertAltUM == $scope.listPreview[index].data.convertBasicUM)
        {
            $scope.unitAmount = $scope.listPreview[index].data.unitStdAmount;
        }
        else
        {
            if ($scope.listPreview[index].data.unit == $scope.listPreview[index].data.convertAltUM)
            {
                $scope.unitAmount = $scope.listPreview[index].data.unitAltAmount;
            }
            else
            {
                $scope.unitAmount = $scope.listPreview[index].data.unitStdAmount;
            }
        }

        $scope.packageAmount = $scope.listPreview[index].data.packageAmount;

        $scope.packageType.selectPackageType = {
            "lable" : $scope.listPreview[index].data.packageType,
            "value" : $scope.listPreview[index].data.packageType
        }

        $scope.unit.selectUnit =
        {
            "lable" : $scope.listPreview[index].data.unit,
            "value" : $scope.listPreview[index].data.unit
        };
    }
    /**
     * #End : edit()
     */
}
); // end WMS100Ctrl :: Select Options


/**
 * Filter Custom for date
 */
app.filter('dateFormat', function ($filter)
{
    return function (inputDateStr)
    {

        if (inputDateStr == '')
        {
            return "";
        }
        var input = moment(inputDateStr)
            var _date = $filter('date')(new Date(input), 'dd/MM/yyyy');

        return _date.toUpperCase();
    }
}
);
