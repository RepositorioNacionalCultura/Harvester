<%-- 
    Document   : extractor
    Created on : 23-nov-2017, 12:48:32
    Author     : juan.fernandez
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%
    String id = request.getParameter("_id");
    String pid = id;
    if (id != null) {
        id = "\"" + id + "\"";
    }

    String status = "";
    String action = request.getParameter("act");
    long numItems = 0;

    if (null == action) {
        action = "";
    }

//            SWBScriptEngine engine = DataMgr.initPlatform("/work/cultura/jsp/datasources.js", session);
//            SWBDataSource datasource = engine.getDataSource("Extractor");
//            DataObject dobj = datasource.fetchObjById(pid);
//            String str_script = "";
//
//if(dobj!=null){
//    str_script = dobj.getString("script","");
//    str_script = str_script.replace("<","\\\\<");
//}
//System.out.println("SCRIPT:"+str_script);
%>
<!DOCTYPE html>
<html>
    <head>
        <jsp:include page="../../templates/metas.jsp" flush="true"></jsp:include>
        <title>Repositorio Digital del Patrimonio Nacional de Cultura - Extractor</title>
    </head>
    <body class="animated fadeIn">
        <jsp:include page="../../templates/topnav.jsp" flush="true">
            <jsp:param name="activeItem" value="extractors" />
        </jsp:include>
        <div class="container-fluid">
            <div class="row">
                <jsp:include page="../../templates/sidenav.jsp" flush="true">
                    <jsp:param name="activeItem" value="extractors" />
                </jsp:include>
                <main role="main" class="col-sm-9 ml-sm-auto col-md-10 pt-3">
                    <h3>Extractor</h3>
                    <script type="text/javascript">
                        var form = eng.createForm({
                            width: "80%",
                            height: 640,
                            showTabs: true,
                            canPrint: false,
                            numCols: 6,
                            titleOrientation: "top",
                            title: "Extractor",
                            fields: [
                                {name:"name", title:"Nombre/Modelo", type:"string", colSpan:3, width:"100%"},
                    //                    {name:"collection", title:"Nombre de la colección", type:"string", endRow:true},
                                {name:"url", title:"URL", type:"string", colSpan:3, width:"100%"},
                                {name: "verbs", title: "Verbos"},
                                {name: "prefix", title: "MetaData PREFIX", endRow:true},
                                {name:"class", title:"Nombre de la Clase a utilizar", type:"string", endRow:true},
                                {name: "periodicity", title: "Periodicidad", type: "boolean"},
                                {name: "interval", title: "Intervalo de tiempo (días)", type: "int", endRow:true},
                                {name: "mapeo", title: "Tabla de mapeo", colSpan:5, width:"100%", endRow:true},
                                {name: "status", title: "Estatus", type: "select", valueMap:{"LOADED":"LOADED", "STARTED":"STARTED", "EXTRACTING":"EXTRACTING", "STOPPED":"STOPPED", "FAILLOAD":"FAIL LOAD", "ABORTED":"ABORTED" }, defaultValue: "STOPPED", canEdit:false}, //STARTED | EXTRACTING | STOPPED
                                <%if (id != null) {%>
                                {name: "created", title: "Fecha creación", type: "string", canEdit:false},
                                {name: "lastExecution", title: "Última ejecución", type: "string", canEdit:false, endRow:true},
                                {name: "rows2harvest", title: "Registros por cosechar", type: "int"},
                                {name: "harvestered", title: "Registros cosechados", type: "int"},
                                {name: "rows2Processed", title: "Registros por procesar", type: "int"},
                                {name: "processed", title: "Registros procesados", type: "int", endRow:true},
                                {name:"pfxExtracted",title:"Prefijos extraidos",type:"string"},
                                {name:"pfxActual",title:"Prefijo actual",type:"string"},
                                {name:"script", title:"Script de transformación", startRow:true, type:"textArea", width:"100%", height:"400", colSpan:5}
                                <%}%>
                            ]
                        }, <%=id%>, "Extractor");
                        form.buttons.addMember(isc.IButton.create(
                            {
                                title: "Cosechar",
                                padding: "10px",
                                click: function (p1) {
                                    window.location = "/cultura/harvest?_id=<%=pid%>&act=EXTRACT";
                                    return false;
                                }
                            }));
                        form.buttons.addMember(isc.IButton.create(
                            {
                                title: "Actualizar",
                                padding: "10px",
                                click: function (p1) {
                                    window.location = "/cultura/harvest?_id=<%=pid%>&act=UPDATE";
                                    return false;
                                }
                            }));
                        form.buttons.addMember(isc.IButton.create(
                            {
                                title: "Reemplazar",
                                padding: "10px",
                                click: function (p1) {
                                    window.location = "/cultura/harvest?_id=<%=pid%>&act=REPLACE";
                                    return false;
                                }
                            }));
                        form.buttons.addMember(isc.IButton.create(
                            {
                                title: "Procesar",
                                padding: "10px",
                                click: function (p1) {
                                    window.location = "/cultura/harvest?_id=<%=pid%>&act=PROCESS";
                                    return false;
                                }
                            }));
                        form.buttons.addMember(isc.IButton.create(
                            {
                                title: "Indexar",
                                padding: "10px",
                                click: function (p1) {
                                    window.location = "/cultura/harvest?_id=<%=pid%>&act=INDEX";
                                    return false;
                                }
                            }));
                        form.buttons.addMember(isc.IButton.create(
                            {
                                title: "Detener",
                                padding: "10px",
                                click: function (p1) {
                                    window.location = "/cultura/harvest?_id=<%=pid%>&act=STOP";
                                    return false;
                                }
                            }));
                        form.submitButton.setTitle("Guardar");
                        //            form.submitButton.click = function(p1)
                        //            {
                        //                eng.submit(form, this, function()
                        //                {
                        //                    window.location = "notas.html";
                        //                });
                        //            };

                        form.buttons.addMember(isc.IButton.create(
                            {
                                title: "Regresar",
                                padding: "10px",
                                click: function (p1) {
                                    window.location = "/cultura/extractors";
                                    return false;
                                }
                            }));
                    </script>
                </main>
            </div>
        </div>
        <jsp:include page="../../templates/bodyscripts.jsp" flush="true"></jsp:include>
    </body>
</html>
