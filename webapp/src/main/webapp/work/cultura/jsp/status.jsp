<%@ page import="org.semanticwb.datamanager.SWBScriptEngine"%><%@ page import="org.semanticwb.datamanager.DataMgr"%><%@ page import="org.semanticwb.datamanager.SWBDataSource"%><%@ page import="org.semanticwb.datamanager.DataObject"%><%@ page import="mx.gob.cultura.extractor.ExtractorManager"%><%@ page contentType="application/json;charset=UTF-8" %>
<%
    String id = request.getParameter("_id");
    String pid = id;

    SWBScriptEngine engine = DataMgr.initPlatform("/work/cultura/jsp/datasources.js", session);
    SWBDataSource datasource = engine.getDataSource("Extractor");
    DataObject dobj = datasource.fetchObjById(id);

    if (null != dobj) {
        out.print("{\"status\":\""+ dobj.getString("status") +"\"}");
    }
%>
