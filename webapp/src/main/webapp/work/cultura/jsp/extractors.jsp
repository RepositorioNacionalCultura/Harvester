<%-- 
    Document   : extractores
    Created on : 08-dic-2017, 10:19:49
    Author     : juan.fernandez
--%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<html>
<head>
    <jsp:include page="../../templates/metas.jsp" flush="true"></jsp:include>
    <title>Repositorio Digital del Patrimonio Nacional de Cultura - Extractores</title>
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
                    <h2>Extractores</h2>
                    <%
                        String id = request.getParameter("_id");
                        String pid = id;
                        if (id != null) {
                            id = "\"" + id + "\"";
                        }
                    %>
                    <script type="text/javascript">
                        var extractor = eng.createGrid({
                            left: "0",
                            margin: "10px",
                            width: "80%",
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
                                window.location = "/cultura/extractor?_id=" + record._id;
                                return false;
                            }
                            ,
                            addButtonClick: function (event)
                            {
                                window.location = "/cultura/extractor";
                                return false;
                            }
                        }, "Extractor");
                    </script>
                </main>
            </div>
        </div>
        <jsp:include page="../../templates/bodyscripts.jsp" flush="true"></jsp:include>
    </body>
</html>