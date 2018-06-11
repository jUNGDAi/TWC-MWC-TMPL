<%@ include file="../fragments/taglibs.jsp" %>
<%@ include file="../fragments/imports.jsp" %>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>WMS</title>
    <!-- css :: vendors -->
    <jsp:include page = "../fragments/css.jsp" />
    <!-- additional custom :: my-style -->
    <link rel="stylesheet" href="../resources/assets/styles/myStyles.css">

    <!-- js :: vendors -->
    <jsp:include page = "../fragments/script.jsp" />
    <!-- additional custom :: my-script -->
    <script src="../resources/assets/scripts/myScripts.js" async></script>
    <script src="../resources/assets/scripts/toggleLoad.js" async></script>



    <style type="text/css" media="screen"> /* add something code to your style */ </style>
    <script type="text/javascript"> /* add something code to your script */</script>
  </head>    
  <body >
    <div id="wrapper">

      <!-- /#sidebar-wrapper -->
      <%@ include file="../fragments/sidebar.jsp" %>

      <!-- Page Content -->
      <!-- nav-head-custom -->
      <%@ include file="../fragments/nav_head.jsp" %>

      <div class="container-fluid">
        <div id="wrapper-top">
          <%-- PART 2 --%>
          <div class="row">
            <div class="col-lg-12">
              <div id="set-height" style="height:415px;margin-top:0px;">
                <div id="sidebar-wrapper-top" class="">
                  <b class="page-header" style="padding-left:5px;font-size:18px;">
                    <%-- <hr style="margin:0px;margin-top:10px;margin-bottom:10px;"> --%>
                  </b>
                </div>
              </div>
            </div>
          </div> 

          <%-- Hide Search Button --%>
          <div id="toggle-top" style="position:relative;">
            <a style="position:absolute;right:0 ;top:-40px;width:15%;z-index: 2000;" href="#menu-toggle2" class="btn btn-outline btn-default  custom-toggle-menu" id="menu-toggle2">
              <div id="i-toggle-top"></div>
            </a>
            <hr style="margin:0px;margin-top:10px;margin-bottom:10px;">
          </div>

          <%-- PART 3 --%>
          <div class="row">
            <div class="col-lg-12">
              <div class="panel panel-primary" style="min-height: 485px;">
                <div class="panel-heading">
                  <h4 style="margin:0px;">Display data | Data Table</h4>
                </div> <!-- .panel-heading -->
                <div class="panel-body">
                  <div class="dataTable_wrapper">
                    <!-- ------------ ############################### -------------- -->
                    <%-- code something --%>
                    <!-- ------------ ############################### -------------- -->
                  </div>
                </div> <!-- end .panel-body -->
              </div> <!-- end .panel .panel-primary -->
            </div> <!-- end col-lg-12 --> 
          </div> <!-- end row -->
        </div> <!-- end #wrapper-top -->
      </div> <!-- end .container-fluid -->
    </div> <!-- end #wrapper -->


  </body>

</html>