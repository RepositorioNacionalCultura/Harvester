<%-- 
    Document   : extractores
    Created on : 08-dic-2017, 10:19:49
    Author     : juan.fernandez
--%>
<%@page import="org.semanticwb.portal.api.SWBResourceURLImp"%>
<%@page import="org.semanticwb.portal.api.SWBParamRequest"%>
<%@page import="org.semanticwb.model.GenericObject"%>


<%@page import="org.semanticwb.SWBPlatform"%>
<%@page import="org.semanticwb.portal.SWBFormMgr"%>
<%@page import="org.semanticwb.model.WebPage"%>
<%@page import="java.util.Set"%>
<%@page import="org.semanticwb.model.SWBComparator"%>
<%@page import="java.util.Locale"%>
<%@page import="java.text.SimpleDateFormat"%>
<%@page import="java.util.List"%>
<%@page import="org.semanticwb.model.WebSite"%>
<%@page import="java.util.Collections"%>
<%@page import="java.util.ArrayList"%>
<%@page import="java.util.HashMap"%>
<%@page import="java.util.Iterator"%>
<%@page import="org.semanticwb.model.User"%>
<%@page import="org.semanticwb.model.Role"%>
<%@page import="org.semanticwb.model.Resource"%> 
<%@page import="org.semanticwb.portal.api.SWBResourceURL"%>
<%@page import="org.semanticwb.SWBUtils"%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%--<jsp:useBean id="paramRequest" scope="request" type="org.semanticwb.portal.api.SWBParamRequest"/>--%>
<%



//SWBResourceURL url = paramRequest.getRenderUrl();
//WebSite ws = paramRequest.getWebSite();


%>
<html>
    <head>
        <title>Extractores</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body>
        <script src="/platform/js/eng.js" type="text/javascript"></script>
        <script type="text/javascript">
            eng.initPlatform("/work/cultura/jsp/datasources.js", false);
        </script> 
        <%
    String id = request.getParameter("_id");
    String pid = id;
    if (id != null) {
        id = "\"" + id + "\"";
    }
%>
        <script type="text/javascript">
            var extractor = eng.createGrid({
                left: "-10",
                margin: "10px",
                width: "100%",
                height: 200,
                canEdit: false,
                canRemove: false,
                canAdd: true,
                fields: [
                    //{name:"endpoint",title:"EndPoint",stype:"select", dataSource:"EndPoint", required:true},
                    {name: "name", title: "Nombre/Modelo", type: "string"},
                    {name: "url", title: "URL", type: "string"},
//        {name:"verbs",title:"Verbos",type:"select", 
//        valueMap:vals_verbs, defaultValue:"Identify", required:true}, 
//        {name:"prefix",title:"MetaData PREFIX",type:"select", 
//        valueMap:vals_meta, defaultValue:"mods"}, 
//        {name:"resumptionToken",title:"Soporta Resumption Token",type:"boolean"},
//        {name:"tokenValue",title:"Token",type:"string"},
                    {name: "periodicity", title: "Periodicidad", type: "boolean"},
                    {name: "interval", title: "Intervalo de tiempo (días)", type: "int"},
//        {name:"mapeo",title:"Tabla de mapeo", stype:"select",  dataSource:"MapDefinition"},
                    {name: "created", title: "Fecha creación", type: "string", canEdit: false},
                    {name: "lastExecution", title: "Última ejecución", type: "string", canEdit: false},
                    {name: "status", title: "Estatus"}, //STARTED | EXTRACTING | STOPPED
                    {name: "rows2harvest", title: "Registros por cosechar", type: "int"},
                    {name: "harvestered", title: "Registros cosechados", type: "int"},
                    {name: "rows2Processed", title: "Registros por procesar", type: "int"},
                    {name: "processed", title: "Registros procesados", type: "int"}
                ],
//                recordClick: function (grid, record) {
//                    var o = record._id;
//                    isc.say(JSON.stringify(o, null, "\t"));
//                    return false;
//                }
                recordDoubleClick: function (grid, record)
                {
                    window.location = "/work/cultura/jsp/extractor.jsp?_id=" + record._id;
                    return false;
                }
                ,
                addButtonClick: function (event)
                {
                    window.location = "/work/cultura/jsp/extractor.jsp";
                    return false;
                }
            }, "Extractor");
        </script>
</body>
</html>