<%@ include file="../includes/taglibs.jsp" %>
<%@ include file="../includes/imports.jsp" %>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>WMS</title>
  <!-- css & js :: main -->
  <jsp:include page = "../includes/css.jsp" />
  <jsp:include page = "../includes/script.jsp" />

  <!-- css & js :: additional -->

  <script src="../js/myScripts.js"></script>

</head>
<body ng-app="WMS600App" ng-controller="WMS600QRPrintCtrl">
	<div id="wrapper">
    <!-- /#sidebar-wrapper -->
    <%@ include file="../includes/slidebar.jsp" %>
    <!-- Page Content -->
    <!-- nav-head-custom -->
    <%@ include file="../includes/WMS_head.jsp" %>
    <div class="container-fluid">
      <form accept-charset="utf-8" name="form" action="../report/wms600Report.jsp" method="POST" target="_blank">
          <div style=" padding-top: 15px;" class="">
              <strong class="page-header" style="font-size:18px;">
                  <div class="row form-horizontal" >
                      <div class="col-xs-6 col-md-6 ">
                        <div class="form-group">
                          <label class="col-xs-5 control-label">คลังสินค้า</label>
                          <div class="col-xs-7 ">
                            <select class="form-control" name="warehouse"
                                  ng-options="whse.QWHNAME for whse in warehouse.availableOptions track by whse.QWHCOD"
                                  ng-model="warehouse.selectedWarehose"
                            ></select>
                          </div>
                        </div>
                      </div>
                      <div class="col-xs-2 col-xs-offset-4">
                        <button type="submit" class="btn btn-outline btn-info" ng-click="previewPDF()"><b><i class="fa fa-file-pdf-o"></i> Preview</b></button>
                      </div>
                  </div>
              </strong>
              <hr>
              <div class="row">
                <div class="col-xs-9 col-xs-offset-1 col-md-9 col-md-offset-1">
                  <div class="row">
                    <div class="col-xs-3"></div>
                    <div class="col-xs-4"><strong>From</strong></div>
                    <div class="col-xs-1"></div>
                    <div class="col-xs-4"><strong>To</strong></div>
                  </div>
                  <br>
                    <!-- Tax Inv No. -->
                  <div class="row">
                    <div class="col-xs-3"><strong>Tax Inv No.</strong></div>
                    <div class="col-xs-4">
                      <div class="form-group">
                        <input type="text" name="taxInvNoFrom" id="" class="form-control" placeholder=""
                        uppercase-text
                        ng-model="taxInvNoFrom"
                        uib-typeahead="item for item in findTaxInvNo_Typeahead('from', $viewValue)"
                        ng-change="checkHaveTaxInvNo('from', taxInvNoFrom); checkInputIsNotEmpty();"
                        ng-blur="checkHaveTaxInvNo('from', taxInvNoFrom); checkInputIsNotEmpty();"
                        />
                      </div>
                    </div>
                    <div class="col-xs-1"></div>
                    <div class="col-xs-4">
                      <div class="form-group">
                        <input type="text" name="taxInvNoTo" id="" class="form-control" placeholder=""
                        uppercase-text
                        ng-model="taxInvNoTo"
                        uib-typeahead="item for item in findTaxInvNo_Typeahead('to', $viewValue)"
                        ng-change="checkHaveTaxInvNo('to', taxInvNoTo);  checkInputIsNotEmpty();"
                        ng-blur="checkHaveTaxInvNo('to', taxInvNoTo);  checkInputIsNotEmpty();"
                        ng-disabled="!taxInvNoFrom || checkHaveTaxInvNoFrom"
                        />
                      </div>
                    </div>
                  </div>
                    <!-- Receive date -->
                  <div class="row">
                    <div class="col-xs-3"><strong>Receive date</strong></div>
                    <div class="col-xs-4">
                      <div class="form-group">
                        <div class='input-group date'>
                          <input type='text' class="form-control form-valid" placeholder="วัน / เดือน / ปี(ค.ศ.)" name="receiptDateFrom"  ng-model="receiptDateFrom" date-time-picker text-date-input ng-change="checkInputIsNotEmpty()" ng-blur="checkInputIsNotEmpty()"/>
                          <span class="input-group-addon">
                            <span class="glyphicon glyphicon-calendar"></span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="col-xs-1"></div>
                    <div class="col-xs-4">
                      <div class="form-group">
                        <div class='input-group date'>
                          <input type='text' class="form-control form-valid" placeholder="วัน / เดือน / ปี(ค.ศ.)" name="receiptDateTo" ng-model="receiptDateTo" date-time-picker text-date-input ng-change="checkInputIsNotEmpty()" ng-blur="checkInputIsNotEmpty()" ng-disabled="!receiptDateFrom" />
                          <span class="input-group-addon">
                            <span class="glyphicon glyphicon-calendar"></span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                    <!-- QR ID -->
                  <div class="row">
                    <div class="col-xs-3"><strong>ID</strong></div>
                    <div class="col-xs-4">
                      <div class="form-group">
                        <input type="text" name="qrIdFrom" id="" class="form-control" placeholder="" uppercase-text
                        ng-model="qrIdFrom"
                        ng-change="checkHaveQRCodeID('from', qrIdFrom); checkInputIsNotEmpty();"
                        ng-blur="checkHaveQRCodeID('from', qrIdFrom); checkInputIsNotEmpty();"
                        uib-typeahead="item for item in findQRId_Typeahead('from',$viewValue)"
                        />
                      </div>
                    </div>
                    <div class="col-xs-1"></div>
                    <div class="col-xs-4">
                      <div class="form-group">
                        <input type="text" name="qrIdTo" id="" class="form-control" placeholder=""
                        uppercase-text
                        uib-typeahead="item for item in findQRId_Typeahead('to', $viewValue)"
                        ng-model="qrIdTo"
                        ng-change="checkHaveQRCodeID('to', qrIdTo); checkInputIsNotEmpty();"
                        ng-blur="checkHaveQRCodeID('to', qrIdTo); checkInputIsNotEmpty();"
                        ng-disabled="!qrIdFrom || checkHaveQRCodeIDFrom"
                        />
                      </div>
                    </div>
                  </div>
                    <!-- Material Code -->
                  <div class="row">
                    <div class="col-xs-3"><strong>Material Code</strong></div>
                    <div class="col-xs-4">
                      <div class="form-group">
                        <input type="text" name="materialCodeFrom" id="" class="form-control" placeholder="" uppercase-text
                        uib-typeahead="item for item in findMaterialCode_Typeahead('from',$viewValue)"
                        ng-model="materialCodeFrom"
                        ng-change="checkHaveMaterialCode('from', materialCodeFrom); checkInputIsNotEmpty()"
                        ng-blur="checkHaveMaterialCode('from', materialCodeFrom); checkInputIsNotEmpty()"
                        />
                      </div>
                    </div>
                    <div class="col-xs-1"></div>
                    <div class="col-xs-4">
                      <div class="form-group">
                        <input type="text" name="materialCodeTo" id="" class="form-control" placeholder="" uppercase-text
                        uib-typeahead="item for item in findMaterialCode_Typeahead('to',$viewValue)"
                        ng-model="materialCodeTo"
                        ng-change="checkHaveMaterialCode('to', materialCodeTo); checkInputIsNotEmpty()"
                        ng-blur="checkHaveMaterialCode('to', materialCodeTo); checkInputIsNotEmpty()"
                        ng-disabled="!materialCodeFrom || checkHaveMaterialCodeFrom"
                        />
                      </div>
                    </div>
                  </div>
                    <!-- Material Control -->
                  <div class="row">
                    <div class="col-xs-3"><strong>Material Control</strong></div>
                    <div class="col-xs-4">
                      <div class="form-group">
                        <input type="text" name="materialCtrlFrom" id="" class="form-control" placeholder="" uppercase-text
                        uib-typeahead="item for item in findMaterialCtrl_Typeahead('from',$viewValue)"
                        ng-model="materialCtrlFrom"
                        ng-change="checkHaveMaterialCtrl('from', materialCtrlFrom); checkInputIsNotEmpty()"
                        ng-blur="checkHaveMaterialCtrl('from', materialCtrlFrom); checkInputIsNotEmpty()"
                        />
                      </div>
                    </div>
                    <div class="col-xs-1"></div>
                    <div class="col-xs-4">
                      <div class="form-group">
                        <input type="text" name="materialCtrlTo" id="" class="form-control" placeholder="" uppercase-text
                        uib-typeahead="item for item in findMaterialCtrl_Typeahead('to',$viewValue)"
                        ng-model="materialCtrlTo"
                        ng-change="checkHaveMaterialCtrl('to', materialCtrlTo); checkInputIsNotEmpty()"
                        ng-blur="checkHaveMaterialCtrl('to', materialCtrlTo); checkInputIsNotEmpty()"
                        ng-disabled="!materialCtrlFrom || checkHaveMaterialCtrlFrom"
                        />
                      </div>
                    </div>
                  </div>                  
                </div>
              </div>
              <hr>
          </div>
      </form>
    </div>
  </div>

  <script defer>

      var sidebarVisible = localStorage.getItem('wrapper');
      var sidebarVisible2 = localStorage.getItem('wrapper-top');
      var checkIMenu = $("#i-menu").html();
      var checkToggleTop = $("#i-toggle-top").html();

      $(document).ready(function() {

          toggleClick();

          toggleLoad();

          toggleClick2();

          toggleLoad2();

          new headerDateTime.setDateTimeTo("#time");

          if ("${CHECK}" == "1") {
              $('#sCHECK').prop('checked', true);
          }

      });

      function toggleLoad2() {
          if (sidebarVisible2 != null && sidebarVisible2 == 1) {
              $("#wrapper-top").css({"-webkit-transition":"all 0.0s ease"},{"-moz-transition":"all 0.0s ease"},{"-o-transition":"all 0.0s ease"},{"transition":"all 0.0s ease"});
              $("#sidebar-wrapper-top").css({"-webkit-transition":"all 0.0s ease"},{"-moz-transition":"all 0.0s ease"},{"-o-transition":"all 0.0s ease"},{"transition":"all 0.0s ease"});
              $("#wrapper-top").toggleClass("toggled");
              $("#i-toggle-top").html("<b class=\"custom-text\">Show search</b>");
              // $("#set-height").css({"margin-top":"50px"});
          } 
                      
          else {
              $("#i-toggle-top").html("<b class=\"custom-text\">Hide search</b>");
          }
      }

  </script>

  <!-- Additional Script JS -->
  <script src="../js/assets/scripts/WMS600App.js" charset="utf-8" defer></script> 
  <script src="../js/assets/scripts/services/services.js" charset="utf-8" defer></script>
  <script src="../js/assets/scripts/directives/directives.js" charset="utf-8" defer></script>

</body>
</html>