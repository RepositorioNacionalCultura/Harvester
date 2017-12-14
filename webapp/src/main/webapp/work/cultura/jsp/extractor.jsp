<%-- 
    Document   : extractor
    Created on : 23-nov-2017, 12:48:32
    Author     : juan.fernandez
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<%
    String id = request.getParameter("_id");
    String pid = id;
    if (id != null) {
        id = "\"" + id + "\"";
    }
%>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <title>Extractor</title>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.2/css/bootstrap.min.css" integrity="sha384-PsH8R72JQ3SOdhVi3uxftmaW6Vc51MKb0q5P2rRUpPvrszuE4W1povHYgTpBfshb" crossorigin="anonymous">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css">

        <style type="text/css">
            body { padding-top: 3.5rem; }
            h1 { padding-bottom: 9px; margin-bottom: 20px; border-bottom: 1px solid #eee; }
            .sidebar { position: fixed; top: 51px; bottom: 0; left: 0; z-index: 1000; padding: 20px 0; overflow-x: hidden; overflow-y: auto; border-right: 1px solid #eee; }
            .sidebar .nav { margin-bottom: 20px; }
            .sidebar .nav-item { width: 100%; }
            .sidebar .nav-item + .nav-item { margin-left: 0; }
            .sidebar .nav-link { border-radius: 0; }
            .placeholder img { padding-top: 1.5rem; padding-bottom: 1.5rem; }
            *, ::after, ::before {
                box-sizing: inherit;
            }
        </style>
        <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
        <!--[if lt IE 9]>
        <script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
        <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
        <![endif]-->
        <script src="/platform/js/eng.js" type="text/javascript"></script>
    </head>
    <body>
    <jsp:include page="includes/header.jsp" flush="true"></jsp:include>

    <div class="container-fluid">
            <div class="row">
                <nav class="col-sm-3 col-md-2 d-none d-sm-block bg-light sidebar">
                    <ul class="nav nav-pills flex-column">
                        <li class="nav-item">
                            <a class="nav-link" href="catalogs">Catálogos</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link active" href="extractors">Extractores <span class="sr-only">(current)</span></a>
                        </li>
                    </ul>
                </nav>

                <main role="main" class="col-sm-9 ml-sm-auto col-md-10 pt-3 animated fadeIn" style="z-index: 0">
                    <script type="text/javascript">
                        eng.initPlatform("/work/cultura/jsp/datasources.js", false);
                        var form = eng.createForm({
                                width: "80%",
                                left: "30",
                                height: 640,
                                showTabs: true,
                                canPrint: false,
                                numCols: 6,
                                titleOrientation: "top",
                                title: "Extractor",
                                fields: [
                                {name:"name", title:"Nombre/Modelo", type:"string", colSpan:3, width:"100%"},
                                {name:"collection", title:"Nombre de la colección", type:"string", endRow:true},
                                {name:"url", title:"URL", type:"string", colSpan:3, width:"100%"},
                                {name: "verbs", title: "Verbos"},
                                {name: "prefix", title: "MetaData PREFIX", endRow:true},
                                {name:"class", title:"Nombre de la Clase a utilizar", type:"string", endRow:true},
                                {name: "periodicity", title: "Periodicidad", type: "boolean"},
                                {name: "interval", title: "Intervalo de tiempo (días)", type: "int", endRow:true},
                                {name: "mapeo", title: "Tabla de mapeo", stype: "select", dataSource: "MapDefinition", endRow:true},
                                {name: "status", title: "Estatus", type: "select", valueMap:{"LOADED":"LOADED", "STARTED":"STARTED", "EXTRACTING":"EXTRACTING", "STOPPED":"STOPPED", "FAILLOAD":"FAIL LOAD", "ABORTED":"ABORTED" }, defaultValue: "STOPPED", canEdit:false}, //STARTED | EXTRACTING | STOPPED
                        <%if (id != null) {%>
                                {name: "created", title: "Fecha creación", type: "string", canEdit:false},
                                {name: "lastExecution", title: "Última ejecución", type: "string", canEdit:false, endRow:true},
                                {name: "rows2harvest", title: "Registros por cosechar", type: "int"},
                                {name: "harvestered", title: "Registros cosechados", type: "int"},
                                {name: "rows2Processed", title: "Registros por procesar", type: "int"},
                                {name: "processed", title: "Registros procesados", type: "int", endRow:true},
                                {name:"script", title:"Script de transformación", startRow:true, type:"textArea", width:"100%", colSpan:5}
                        <%}%>
                                ]
                        }, <%=id%>, "Extractor");
                        form.buttons.addMember(isc.IButton.create(
                        {
                        title: "Cosechar",
                                padding: "10px",
                                click: function (p1) {
                                window.location = "harvest?_id=<%=pid%>&act=EXTRACT";
                                return false;
                                }
                        }));
                        form.buttons.addMember(isc.IButton.create(
                        {
                        title: "Actualizar",
                                padding: "10px",
                                click: function (p1) {
                                window.location = "harvest?_id=<%=pid%>&act=UPDATE";
                                return false;
                                }
                        }));
                        form.buttons.addMember(isc.IButton.create(
                        {
                        title: "Reemplazar",
                                padding: "10px",
                                click: function (p1) {
                                window.location = "harvest?_id=<%=pid%>&act=REPLACE";
                                return false;
                                }
                        }));
                        form.buttons.addMember(isc.IButton.create(
                        {
                        title: "Procesar",
                                padding: "10px",
                                click: function (p1) {
                                window.location = "process";
                                return false;
                                }
                        }));
                        form.buttons.addMember(isc.IButton.create(
                        {
                        title: "Detener",
                                padding: "10px",
                                click: function (p1) {
                                window.location = "harvest?_id=<%=pid%>&act=STOP";
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
                                window.location = "extractors";
                                return false;
                                }
                        }));
                    </script>
                </main>
            </div>
        </div>
    </body>
</html>
