<%-- 
    Document   : harvest
    Created on : 23-nov-2017, 12:37:52
    Author     : juan.fernandez
--%>
<%@page import="mx.gob.cultura.extractor.ExtractorManager"%>
<%@page import="mx.gob.cultura.extractor.ModsExtractor"%>
<%@page import="javax.xml.transform.TransformerException"%>
<%@page import="javax.xml.transform.TransformerConfigurationException"%>
<%@page import="javax.xml.transform.Result"%>
<%@page import="javax.xml.transform.Source"%>
<%@page import="java.io.OutputStreamWriter"%>
<%@page import="java.io.ByteArrayOutputStream"%>
<%@page import="org.json.XML"%>
<%@page import="mx.gob.cultura.util.Util"%>
<%@page import="com.mongodb.BasicDBList"%>
<%@page import="java.util.Map"%>
<%@page import="java.util.Iterator"%>
<%@page import="com.mongodb.BasicDBObject"%>
<%@page import="com.mongodb.DBObject"%>
<%@page import="com.mongodb.DB"%>
<%@page import="com.mongodb.DBCollection"%>
<%@page import="com.mongodb.MongoClient"%>
<%@page import="javax.xml.transform.stream.StreamResult"%>
<%@page import="javax.xml.transform.OutputKeys"%>
<%@page import="java.io.StringWriter"%>
<%@page import="javax.xml.transform.Transformer"%>
<%@page import="javax.xml.transform.TransformerFactory"%>

<%@page import="org.w3c.dom.Node"%>
<%@page import="org.xml.sax.SAXException"%>
<%@page import="org.xml.sax.InputSource"%>
<%@page import="org.w3c.dom.Element"%>
<%@page import="org.w3c.dom.NodeList"%>

<%@page import="javax.xml.parsers.ParserConfigurationException"%>
<%@page import="java.io.StringReader"%>

<%@page import="javax.xml.parsers.DocumentBuilderFactory"%>
<%@page import="javax.xml.transform.dom.DOMSource"%>
<%@page import="javax.xml.parsers.DocumentBuilder"%>
<%@page import="org.w3c.dom.Document"%>
<%@page import="org.json.JSONObject"%>
<%@page import="org.json.JSONArray"%>
<%@page import="jdk.nashorn.internal.parser.JSONParser"%>
<%@page import="com.mongodb.util.JSON"%>
<%@page import="java.util.Date"%>
<%@page import="javax.ws.rs.ServerErrorException"%>
<%@page import="java.io.IOException"%>
<%@page import="java.io.InputStreamReader"%>
<%@page import="java.io.BufferedReader"%>
<%@page import="java.net.HttpURLConnection"%>
<%@page import="java.net.URL"%>
<%@page import="org.semanticwb.datamanager.DataList"%>
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
