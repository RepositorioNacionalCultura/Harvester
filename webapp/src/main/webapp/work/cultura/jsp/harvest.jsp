<%@ page import="mx.gob.cultura.extractor.ExtractorManager"%><%@ page import="org.semanticwb.datamanager.SWBScriptEngine"%><%@ page import="org.semanticwb.datamanager.DataMgr"%><%@ page import="org.semanticwb.datamanager.SWBDataSource"%><%@ page import="org.semanticwb.datamanager.DataObject"%><%@page contentType="application/json" pageEncoding="UTF-8"%>
<%
    ExtractorManager extMgr = ExtractorManager.getInstance();
    String id = request.getParameter("_id");
    String action = request.getParameter("act");
    String pid = id;

    if (null == action) {
        action = "";
    }

    SWBScriptEngine engine = DataMgr.initPlatform("/work/cultura/jsp/datasources.js", session);
    SWBDataSource datasource = engine.getDataSource("Extractor");
    DataObject dobj = datasource.fetchObjById(id);

    if (null != dobj) {
        if (action.equals("EXTRACT")) {
            extMgr.loadExtractor(dobj);
            extMgr.startExtractor(id);
        } else if (action.equals("STOP")) {
            boolean ret = extMgr.stopExtractor(id);
            out.print("{\"status\":\"" + ret + "\"}");
        } else if (action.equals("REPLACE")) {
            extMgr.loadExtractor(dobj);
            extMgr.replaceExtractor(id);
        } else if (action.equals("PROCESS")) {
            extMgr.loadExtractor(dobj);
            extMgr.processExtractor(id);
        } else if (action.equals("INDEX")) {
            extMgr.loadExtractor(dobj);
            extMgr.indexExtractor(id);
        } else if (action.equals("UPDATE")) {
            extMgr.loadExtractor(dobj);
            extMgr.updateExtractor(pid);
        }
    }
%>