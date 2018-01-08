<%-- 
    Document   : harvest
    Created on : 23-nov-2017, 12:37:52
    Author     : juan.fernandez
--%>
<%@page import="mx.gob.cultura.extractor.ExtractorManager"%>
<%@page import="mx.gob.cultura.extractor.OAIExtractor"%>
<%@page import="org.semanticwb.datamanager.DataObject"%>
<%@page import="org.semanticwb.datamanager.DataMgr"%>
<%@page import="org.semanticwb.datamanager.SWBDataSource"%>
<%@page import="org.semanticwb.datamanager.SWBScriptEngine"%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>JSP Page</title>
        <script type="text/javascript">
            function updateInfo(listSize, extracted) {
                var ele = document.getElementById("res");
                ele.innerHTML("<strong>Records to extract:" + listSize + "</strong><br>" +
                        "<strong>Records extracted:" + (extracted) + "</strong><br>" +
                        "<strong>Records to go:" + (listSize - (extracted)) + "</strong><br>");
            }

        </script>
    </head>
    <body>

        <%
            String id = request.getParameter("_id");
            String pid = id;
            String status = "";
            String action = request.getParameter("act");

            if (null == action) {
                action = "";
            }

            SWBScriptEngine engine = DataMgr.initPlatform("/work/cultura/jsp/datasources.js", session);
            SWBDataSource datasource = engine.getDataSource("Extractor");
            DataObject dobj = datasource.fetchObjById(id);
        %>
        <h1>JSON Extractor (<%=dobj.getString("name")%>)</h1>
        <div id="res">
            <%
                if (action.equals("EXTRACT")) {
                    if (null != pid) {
                        ExtractorManager extMgr = ExtractorManager.getInstance();
                        extMgr.loadExtractor(dobj);
                        status = extMgr.getStatus(id);
                        extMgr.startExtractor(id);
                        dobj = datasource.fetchObjById(id);
            %>
            <strong>Status:<%=status%></strong><br>
            <strong>Records extracted:0</strong><br>
            <%
                }
            } else if (action.equals("STOP")) {
                if (null != pid) {
                    ExtractorManager extMgr = ExtractorManager.getInstance();
                    extMgr.stopExtractor(id);
                    status = extMgr.getStatus(id);

            %>
            <strong>Status:<%=status%></strong><br>
            <strong>Se detuvo el extractor.</strong><br>
            <%
                }
            } else if (action.equals("REPLACE")) {
                if (null != pid) {
                    ExtractorManager extMgr = ExtractorManager.getInstance();
                    extMgr.loadExtractor(dobj);
                    extMgr.replaceExtractor(id);
                    status = extMgr.getStatus(id);
                    dobj = datasource.fetchObjById(id);
            %>
            <strong>Status:<%=status%></strong><br>
            <strong>Se limpió la base de datos</strong><br>
            <strong>Se reinició la extracción de datos.</strong><br>
            <strong>Records extracted:0</strong><br>
            <%

                }
            } else if (action.equals("PROCESS")) {
                if (null != pid) {
                    ExtractorManager extMgr = ExtractorManager.getInstance();
                    extMgr.loadExtractor(dobj);
                    extMgr.processExtractor(id);
                    status = extMgr.getStatus(id);
                    dobj = datasource.fetchObjById(id);
            %>
            <strong>Status:<%=status%></strong><br>
            <strong>Se procesaron los metadatos.</strong><br>
            <strong>Se concluyó la indexación.</strong><br>
            <%                    
                }
            } else if (action.equals("UPDATE")) {
                if (null != pid) {
                    ExtractorManager extMgr = ExtractorManager.getInstance();
                    extMgr.loadExtractor(dobj);
                    extMgr.updateExtractor(pid);
                    status = extMgr.getStatus(id);
                    dobj = datasource.fetchObjById(id);
            %>
            <strong>Status:<%=status%></strong><br>
            <strong>Se actualizaron los datos.</strong><br>
            <strong>Records updated:0</strong><br>
            <%
                    }
                }
            %>



        </div>
    </body>
</html>