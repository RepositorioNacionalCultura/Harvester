<%-- 
    Document   : harvest
    Created on : 23-nov-2017, 12:37:52
    Author     : juan.fernandez
--%>
<%@page import="mx.gob.cultura.extractor.ExtractorManager"%>
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
            String status="";
            String action = request.getParameter("act");

            if(null==action) action="";
            
            SWBScriptEngine engine = DataMgr.initPlatform("/work/cultura/jsp/datasources.js", session);
            SWBDataSource datasource = engine.getDataSource("Extractor");
            DataObject dobj = datasource.fetchObjById(id);

            if(action.equals("EXTRACT")){
                if (null != pid) {
                    ExtractorManager extMgr = ExtractorManager.getInstance();
                    extMgr.loadExtractor(dobj);
                    status=extMgr.getStatus(id);
                    extMgr.startExtractor(id);
                }
            } else if(action.equals("STOP")){
                if (null != pid) {
                    ExtractorManager extMgr = ExtractorManager.getInstance();
                    extMgr.stopExtractor(id);
                    status=extMgr.getStatus(id);
                }
            } else if(action.equals("REPLACE")){
                if (null != pid) {
                    ExtractorManager extMgr = ExtractorManager.getInstance();
                    extMgr.loadExtractor(dobj);
                    extMgr.replaceExtractor(id);
                    status=extMgr.getStatus(id);
                }
            } else if(action.equals("PROCESS")){
                if (null != pid) {
                    ExtractorManager extMgr = ExtractorManager.getInstance();
                    extMgr.loadExtractor(dobj);
                    extMgr.replaceExtractor(id);
                    status=extMgr.getStatus(id);
                }
            } else if(action.equals("UPDATE")){
                if (null != pid) {
                    ExtractorManager extMgr = ExtractorManager.getInstance();
                    extMgr.loadExtractor(dobj);
                    extMgr.updateExtractor(pid);
                    status=extMgr.getStatus(id);
                }
            }

        %>
        <h1>JSON Extractor (<%=dobj.getString("name")%>)</h1>
        <div id="res">
            <strong>Status:<%=status%></strong><br>
            <strong>Records to extract:Analizing</strong><br>
            <strong>Records extracted:0</strong><br>
            <strong>Records to go:0</strong><br>
        </div>
    </body>



</html>
