<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<%@ page import="java.sql.*" %>
<%@ page import="java.io.*" %>
<%@ page import="java.util.*" %>



<%@ page import="wacoal.connection.*" %>

<%@ page import="net.sf.jasperreports.engine.*" %>
<%@ page import="net.sf.jasperreports.engine.util.*" %>
<%@ page import="net.sf.jasperreports.engine.export.*" %>
<%@ page import="net.sf.jasperreports.j2ee.servlets.*" %>

<!DOCTYPE>
<html>
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<title>WMS600 Report</title>
	<link rel="stylesheet" href="">
</head>
<body>
	<h1>WMS600 Reports</h1>

	<%
		String warehouse = request.getParameter("warehouse");
		String taxInvNoFrom = request.getParameter("taxInvNoFrom");
		String taxInvNoTo = request.getParameter("taxInvNoTo");
		String receiptDateFrom = request.getParameter("receiptDateFrom");
		String receiptDateTo = request.getParameter("receiptDateTo");
		String materialCodeFrom = request.getParameter("materialCodeFrom");
		String materialCodeTo = request.getParameter("materialCodeTo");
		String qrIdFrom = request.getParameter("qrIdFrom");
		String qrIdTo = request.getParameter("qrIdTo");
		String materialCtrlFrom = request.getParameter("materialCtrlFrom");
		String materialCtrlTo = request.getParameter("materialCtrlTo");


		try {
			MSSQLConnection mssqlc = new MSSQLConnection();
			Connection connection = mssqlc.getConnection();
			String sql = "";
			String WHERE_QRMTAX = "";
			String WHERE_QRMRCDATE = "";
			String WHERE_QRMCODE = "";
			String WHERE_QRMID = "";
			String WHERE_SAPMCTRL = "";
			if ( !taxInvNoFrom.equals("") ) { 
				if ( !taxInvNoTo.equals("") ) {
					WHERE_QRMTAX = " AND (QRMTAX BETWEEN '"+taxInvNoFrom+"' AND '"+taxInvNoTo+"') ";
				} else {
					WHERE_QRMTAX =  " AND QRMTAX = '"+ taxInvNoFrom +"'  ";
				}
			}
			if ( !receiptDateFrom.equals("") ) {
				if ( !receiptDateTo.equals("") ) {
					receiptDateFrom = receiptDateFrom.split("/")[2]+""+receiptDateFrom.split("/")[1]+""+receiptDateFrom.split("/")[0];
					receiptDateTo = receiptDateTo.split("/")[2]+""+receiptDateTo.split("/")[1]+""+receiptDateTo.split("/")[0];
					WHERE_QRMRCDATE = " AND (QRMRCDATE BETWEEN '"+receiptDateFrom+"' AND '"+receiptDateTo+"') ";
				} else {
					receiptDateFrom = receiptDateFrom.split("/")[2]+""+receiptDateFrom.split("/")[1]+""+receiptDateFrom.split("/")[0];
					WHERE_QRMRCDATE = " AND QRMRCDATE = '"+ receiptDateFrom +"' ";
				}
			}
			if ( !materialCodeFrom.equals("") ) {
				if ( !materialCodeTo.equals("") ) {
					WHERE_QRMCODE = " AND (QRMCODE BETWEEN '"+materialCodeFrom+"' AND '"+materialCodeTo+"' ) ";
				} else {
					WHERE_QRMCODE = " AND QRMCODE = '"+ materialCodeFrom +"' ";
				}
			}
			if ( !qrIdFrom.equals("") ) {
				if ( !qrIdTo.equals("") ) {
					WHERE_QRMID = " AND (QRMID BETWEEN '"+qrIdFrom+"' AND '"+qrIdTo+"') ";
				} else {
					WHERE_QRMID = " AND QRMID = '" +qrIdFrom+ "' ";
				}
			}
			if ( !materialCtrlFrom.equals("") ) {
				if ( !materialCtrlTo.equals("") ) {
				WHERE_SAPMCTRL = " AND (SAPMCTRL BETWEEN '"+materialCtrlFrom+"' AND '"+materialCtrlTo+"') ";
				} else {
					WHERE_SAPMCTRL = " AND SAPMCTRL = '"+materialCtrlFrom+"' ";
				}
			}
			sql = "SELECT * FROM SAPMAS RIGHT JOIN QRMMAS ON SAPCOM = QRMCOM AND SAPMAT = QRMCODE AND SAPVAL = QRMVAL AND SAPPLANT = QRMPLANT AND SAPLOCATION = QRMSTORAGE WHERE QRMWHSE = '"+warehouse+"' "+ WHERE_QRMTAX + WHERE_QRMRCDATE + WHERE_QRMCODE + WHERE_QRMID + WHERE_SAPMCTRL + " ORDER BY QRMID, QRMTAX, QRMCODE,  QRMROLL";

			PreparedStatement ps = connection.prepareStatement(sql);
			ResultSet rs = ps.executeQuery();

			File reportFile = new File(application.getRealPath("/report/jasper-source/WMS600Report.jasper"));
			if (!reportFile.exists())
				throw new JRRuntimeException("File *.jasper not found. The report design must be compiled first.");
			try{

	    	JasperReport jasperReport = (JasperReport)JRLoader.loadObject(reportFile.getPath());
	        Map parameters = new HashMap();
	        parameters.put("LOGO_WC", application.getRealPath("/resource/images/logo/wc.png"));

	        JRResultSetDataSource obj = new JRResultSetDataSource(rs);

	        JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, parameters, obj);

				File exportFile = new File(application.getRealPath("/report/output/WMS600Report.pdf"));
				if(exportFile.exists()) exportFile.delete();
				JasperExportManager.exportReportToPdfFile(jasperPrint,application.getRealPath("/report/output/WMS600Report.pdf"));
				rs.close();
				ps.close();
				connection.close();

			} catch (Exception ex){
				out.println (ex.toString());
			}
				String pathPDF = "http://"+request.getServerName()+":"+request.getServerPort()+request.getContextPath()+"/report/output/WMS600Report.pdf";

		// String site = new String("http://www.photofuntoos.com");

		   response.setStatus(response.SC_MOVED_TEMPORARILY);
		   response.setHeader("Location", pathPDF);

		}catch (Exception e) {
			e.printStackTrace();
		}
	%>

</body>
</html>