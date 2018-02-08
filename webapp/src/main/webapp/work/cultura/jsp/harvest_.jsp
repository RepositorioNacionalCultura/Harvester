<%-- 
    Document   : harvest
    Created on : 23-nov-2017, 12:37:52
    Author     : juan.fernandez
--%>
<%@page import="mx.gob.cultura.extractor.ExtractorManager"%>
<%@page import="mx.gob.cultura.util.Util"%>
<%@page import="org.semanticwb.datamanager.DataMgr"%>
<%@page import="org.semanticwb.datamanager.DataObject"%>
<%@page import="org.semanticwb.datamanager.SWBDataSource"%>
<%@page import="org.semanticwb.datamanager.SWBScriptEngine"%>
<%@page import="java.text.SimpleDateFormat"%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%
    ExtractorManager extMgr = ExtractorManager.getInstance();
%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Extractor action</title>
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
            long numItems = 0;

            if (null == action) {
                action = "";
            }

            SWBScriptEngine engine = DataMgr.initPlatform("/work/cultura/jsp/datasources.js", session);
            SWBDataSource datasource = engine.getDataSource("Extractor");
            DataObject dobj = datasource.fetchObjById(id);
        %>
        <h1>JSON Extractor (<%=dobj.getString("name")%>)</h1>
        <div id="res">
            <%  SimpleDateFormat sdfTime = new SimpleDateFormat("HH:mm:ss");
                long startTime = System.currentTimeMillis();

                long endTime = 0;
                if (action.equals("EXTRACT")) {
                    if (null != pid) {
                        extMgr.loadExtractor(dobj);
                        extMgr.startExtractor(id);
                        dobj = datasource.fetchObjById(id);
                        endTime = System.currentTimeMillis();

                        //System.out.println("Tiempo de extracción de datos:"+sdfTime.format(new Date(endTime.getTime()-startTime.getTime())));
                        status = dobj.getString("status");
                        numItems = dobj.getInt("harvestered");
            %>
            <strong>Status: <%=status%></strong><br>
            <strong>Extracted Records: <%=numItems%></strong><br>
            <strong>Extraction time: <%=Util.getElapsedTime((endTime - startTime))%></strong><br>
            <%
                }
            } else if (action.equals("STOP")) {
                if (null != pid) {
                    extMgr.stopExtractor(id);
                    status = extMgr.getStatus(id);
                    endTime = System.currentTimeMillis();
            %>
            <strong>Status:<%=status%></strong><br>
            <strong>Se detuvo el extractor.</strong><br>
            <strong>Stopping time: <%=Util.getElapsedTime((endTime - startTime))%></strong><br>
            
            <%
                }
            } else if (action.equals("REPLACE")) {
                if (null != pid) {
                    extMgr.loadExtractor(dobj);
                    extMgr.replaceExtractor(id);
                    dobj = datasource.fetchObjById(id);
                    status = dobj.getString("status");
                    numItems = dobj.getInt("harvestered");
                    endTime = System.currentTimeMillis();
            %>
            <strong>Status:<%=status%></strong><br>
            <strong>Se limpió la base de datos</strong><br>
            <strong>Se reinició la extracción de datos.</strong><br>
            <strong>Extracted Records: <%=numItems%></strong><br>
            <strong>Extraction time: <%=Util.getElapsedTime((endTime - startTime))%></strong><br>
            <%

                }
            } else if (action.equals("PROCESS")) {
                if (null != pid) {
                    extMgr.loadExtractor(dobj);
                    extMgr.processExtractor(id);
                    endTime = System.currentTimeMillis();
                    dobj = datasource.fetchObjById(id);
                    status = dobj.getString("status");
                    numItems = dobj.getInt("processed");
            %>
            <strong>Status:<%=status%></strong><br>
            <strong>Se procesaron los metadatos.</strong><br>
            <strong>Processed Records: <%=numItems%></strong><br>
            <strong>Processing time: <%=Util.getElapsedTime((endTime - startTime))%></strong><br>
            <%
                }
            } else if (action.equals("INDEX")) {
                if (null != pid) {
                    extMgr.loadExtractor(dobj);
                    extMgr.indexExtractor(id);
                    endTime = System.currentTimeMillis();
                    dobj = datasource.fetchObjById(id);
                    status = dobj.getString("status");
                    numItems = dobj.getInt("indexed",0);
            %>
            <strong>Status:<%=status%></strong><br>
            <strong>Se indexaron los metadatos.</strong><br>
            <strong>Se concluyó la indexación.</strong><br>
            <strong>Indexed Records: <%=numItems%></strong><br>
            <strong>Indexing time: <%=Util.getElapsedTime((endTime - startTime))%></strong><br>
            <%
                }
            } else if (action.equals("UPDATE")) {
                if (null != pid) {
                    extMgr.loadExtractor(dobj);
                    extMgr.updateExtractor(pid);
                    endTime = System.currentTimeMillis();
                    dobj = datasource.fetchObjById(id);
                    status = dobj.getString("status");
                    numItems = dobj.getInt("processed");
            %>
            <strong>Status:<%=status%></strong><br>
            <strong>Se actualizaron los datos.</strong><br>
            <strong>Updated Records: <%=numItems%></strong><br>
            <strong>Updating time: <%=Util.getElapsedTime((endTime - startTime))%></strong><br>
            <%
                    }
                }
            %>
        </div>
    </body>
</html>