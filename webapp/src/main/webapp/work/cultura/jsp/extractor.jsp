<%-- 
    Document   : extractor
    Created on : 23-nov-2017, 12:48:32
    Author     : juan.fernandez
--%>

<%@page import="org.semanticwb.datamanager.DataMgr"%>
<%@page import="org.semanticwb.datamanager.DataObject"%>
<%@page import="org.semanticwb.datamanager.SWBDataSource"%>
<%@page import="org.semanticwb.datamanager.SWBScriptEngine"%>
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

    SWBScriptEngine engine = DataMgr.initPlatform("/work/cultura/jsp/datasources.js", session);
    SWBDataSource datasource = engine.getDataSource("Extractor");
    DataObject dobj = null;
    if (null != pid) {
        dobj = datasource.fetchObjById(pid);
    }
    boolean isFile = false;
    boolean havePeriodicity = false;
    String str_script = "";

    if (dobj != null) {
        //str_script = dobj.getString("script", "");
        //str_script = "<pre><code>" + str_script + "</pre></code>";

        String clase = dobj.getString("class", null);
        if (clase != null && clase.equals("CSVExtractor")) {
            isFile = true;
        }
        if(dobj.getBoolean("periodicity", false)){
            havePeriodicity = true;
        }

    }
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
                        eng.initPlatform("datasources.js", false);
                        var form = eng.createForm({
                            width: "80%",
                            height: 640,
                            showTabs: true,
                            canPrint: false,
                            numCols: 6,
                            titleOrientation: "top",
                            title: "Extractor",
                            fields: [
                                {name: "name", title: "Nombre/Modelo", type: "string", required:true, colSpan: 3, width: "100%"},
                                {name: "class", title: "Extractor a utilizar", type: "select", valueMap: {"OAIExtractor": "OAIExtractor", "CSVExtractor": "CSVExtractor"}, endRow: true,
                                    changed: function (form, field, value) {
                                        var mostrar = false;
                                        if (value !== null && value === "OAIExtractor") {
                                            mostrar = true;
                                        }
                                        if (mostrar) {
                                            form.showField("url");
                                            form.fields[3].showIf = true;
                                            form.fields[3].required = true;
                                            form.showField("verbs");
                                            form.fields[4].showIf = true;
                                            form.fields[4].required = true;
                                            form.showField("prefix");
                                            form.fields[5].showIf = true;
                                            form.fields[5].required = true;
                                            form.hideField("csvfile");
                                            form.fields[6].showIf = false;
                                            form.fields[6].required = false;
                                        } else {
                                            form.hideField("url");
                                            form.fields[3].showIf = false;
                                            form.fields[3].required = false;
                                            form.hideField("verbs");
                                            form.fields[4].showIf = false;
                                            form.fields[4].required = false;
                                            form.hideField("prefix");
                                            form.fields[5].showIf = false;
                                            form.fields[5].required = false;
                                            form.showField("csvfile");
                                            form.fields[6].showIf = true;
                                            form.fields[6].required = true;
                                        }
                                    }
                                },
                                {name: "url", title: "URL", type: "string", colSpan: 4, width: "100%", endRow: "true", defaultValue: "OAIExtractor", <%=isFile ? "showIf:\"false\"" : ""%>},
                                {name: "verbs", title: "Verbos", colSpan: 2, width: "100%",<%=isFile ? "showIf:\"false\"" : ""%>},
                                {name: "prefix", title: "MetaData PREFIX", colSpan: 2, width: "100%", endRow: true,<%=isFile ? "showIf:\"false\"" : ""%>},
                                {name: "csvfile", title: "Archivo CSV", stype: "file", colSpan: 4, width: "100%", endRow: true, <%=!isFile ? "showIf:\"false\"" : ""%>},
                                {name: "periodicity", title: "Periodicidad", type: "boolean",
                                    changed: function (form, field, value) {
                                        var mostrar = false;
                                        if (value !== null && value === true) {
                                            mostrar = true;
                                        }
                                        var indice = 7;
                                        if(form.getValue("class")==="CSVExtractor"){
                                            indice = 5;
                                            } 
                                        if (mostrar) {
                                            form.showField("interval");
                                            form.fields[indice].showIf = true;
                                            form.fields[indice].required = true;                                            
                                        } else {
                                            form.hideField("interval");
                                            form.fields[indice].showIf = false;
                                            form.fields[indice].required = false;
                                        }
                                    }
                                },
                                {name: "interval", title: "Intervalo de tiempo (días)", type: "int", colSpan: 2, width: "100%", endRow: true, <%=!havePeriodicity ? "showIf:\"false\"" : ""%>},

                        <%if (id != null) {%>

                                {name: "status", title: "Estatus", type: "select", valueMap: {"LOADED": "LOADED", "STARTED": "STARTED", "EXTRACTING": "EXTRACTING", "STOPPED": "STOPPED", "FAILLOAD": "FAIL LOAD", "ABORTED": "ABORTED"}, defaultValue: "STOPPED", canEdit: false, startRow:true}, //STARTED | EXTRACTING | STOPPED
                                {name: "created", title: "Fecha creación", type: "string", canEdit: false},
                                {name: "lastExecution", title: "Última ejecución", type: "string", canEdit: false, endRow: true},
                                {name: "rows2harvest", title: "Registros por cosechar", type: "int", canEdit: false},
                                {name: "harvestered", title: "Registros cosechados", type: "int", canEdit: false},
                                {name: "rows2Processed", title: "Registros por procesar", type: "int", canEdit: false},
                                {name: "processed", title: "Registros procesados", type: "int", canEdit: false, endRow: true},
                                {name: "indexed", title: "Registros indexados", type: "int", canEdit: false, endRow:true},
                                {name: "pfxExtracted", title: "Prefijos extraidos", type: "string"},
                                {name: "pfxActual", title: "Prefijo actual", type: "string"},
                                //                    {name: "script", title: "Script de transformación", startRow: true, type: "textArea", width: "100%", height: "400", colSpan: 5},

                        <%}%>
                            ],
                            links: [
                                {name: "transScript",
                                    title: "Script transformación",
                                    stype: "tab",
                                    dataSource: "TransformationScript",
                                    titleOrientation: "top",
                                    fileds: [
                                        {name: "script", title: "Script",
                                            type: "textArea",
                                            editorType_: "richText",
                                            width: "100%",
                                            height: "400",
                                            colSpan: 5,
                                            autoDraw_: false,
                                            overflow_: "hidden",
                                            controlGroups_: ["fontControls", "formatControls", "styleControls", "colorControls", "bulletControls"],
                                            defaultValue: "<%=str_script%>"
                                        }
                                    ]
                                },
                                {name: "mapDef",
                                    title: "Tabla de mapeo",
                                    stype: "tab",
                                    dataSource: "MapDefinition",
                                    titleOrientation: "top",
                                },
                            ]
                        }, <%=id%>, "Extractor");
                        <%if (id != null) {%>
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
                        <%if (!isFile) {%>
                        form.buttons.addMember(isc.IButton.create(
                                {
                                    title: "Procesar",
                                    padding: "10px",
                                    click: function (p1) {
                                        window.location = "/cultura/harvest?_id=<%=pid%>&act=PROCESS";
                                        return false;
                                    }
                                }));
                        <%}%>
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
                        <%}%>
                        form.submitButton.setTitle("Guardar");
                        <%if (id == null) {%>
                        form.submitButton.click = function(event) {
                            
                            eng.submit(event.target.form, this, 
                                function(request) {
                                    isc.say("Datos enviados correctamente...", function(success){
                                        if(success) {
                                            //isc.say('Notificación enviada. Gracias!');
                                            window.location.href = '/cultura/extractor?_id='+request.data_id;
                                            return false;
                                        }else{
                                            isc.say('No pudo guardarse la información del extractor. Contacte con el Administrador.');
                                        }
                                    });
                                }
                            );
                        };
                        <%}%>

                        form.buttons.addMember(isc.IButton.create(
                                {
                                    title: "Regresar",
                                    padding: "10px",
                                    click: function (p1) {
                                        window.location = "/cultura/extractors";
                                        return false;
                                    }
                                }));


                        <%if (id == null) {%>
                        form.tabs.getTab(1).disable();
                        form.tabs.getTab(2).disable();
                        <%}%>
                    </script>         
                </main>
            </div>
        </div>
        <jsp:include page="../../templates/bodyscripts.jsp" flush="true"></jsp:include>
    </body>
</html>
