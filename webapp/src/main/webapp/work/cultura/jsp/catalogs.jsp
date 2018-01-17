<%-- 
    Document   : catalogs
    Created on : 23-nov-2017, 12:25:31
    Author     : juan.fernandez
--%><%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Repositorio Nacional de Cultura</title>
        <script src="/platform/js/eng.js" type="text/javascript"></script>
        <link href="css/dac_page.css" rel="stylesheet">	
        <script type="text/javascript">
            eng.initPlatform("datasources.js", false);
        </script> 
    </head>
    <body>
        <h1>Catálogos</h1>
        <h2>Repositorio Nacional de Cultura</h2>
        <h3>Verbos</h3>
        <script type="text/javascript">
            var verbs = eng.createGrid({
                left: "-10",
                margin: "10px",
                width: "100%",
                height: 200,
                canEdit: true,
                canRemove: true,
                canAdd: true,
//                recordClick: function (grid, record) {
//                    var o = record._id;
//                    isc.say(JSON.stringify(o, null, "\t"));
//                    return false;
//                }
            }, "Verbs");
        </script> 
        <h3>MetaData Prefix</h3>
        <script type="text/javascript">
            var metaPrefix = eng.createGrid({
                left: "-10",
                margin: "10px",
                width: "100%",
                height: 200,
                canEdit: true,
                canRemove: true,
                canAdd: true,
//                recordClick: function (grid, record) {
//                    var o = record._id;
//                    isc.say(JSON.stringify(o, null, "\t"));
//                    return false;
//                }
            }, "MetaData_Prefix");
        </script> 

        <!--        <h3>EndPoint</h3>
                <script type="text/javascript">
        //            var endPoint = eng.createGrid({
        //                left: "-10",
        //                margin: "10px",
        //                width: "100%",
        //                height: 200,
        //                canEdit: true,
        //                canRemove: false,
        //                canAdd: true,
        //                recordDoubleClick: function (grid, record)
        //                {
        //                    window.location = "endPoint.jsp?_id=" + record._id;
        //                    return false;
        //                }
        //                ,
        //                addButtonClick: function (event)
        //                {
        //                    window.location = "endPoint.jsp";
        //                    return false;
        //                },
                    //}, "EndPoint");
                </script>-->

<!--        <h3>Mapeos</h3>
        <script type="text/javascript">
//            var mapDef = eng.createGrid({
//                left: "-10",
//                margin: "10px",
//                width: "100%",
//                height: 200,
//                canEdit: true,
//                canRemove: true,
//                canAdd: true,
//                fields: [
//                    {name: "property", title: "Propiedad", type: "string", required: true},
//                    {name: "collName", title: "Colección / Catálogo", type: "string", required: true},
//                    //{name: "Tipo", title: "Tipo", type: "string", required: true},
//                ],
//                recordDoubleClick: function (grid, record)
//                {
//                    window.location = "mapDefinition.jsp?_id=" + record._id;
//                    return false;
//                }
//                ,
//                addButtonClick: function (event)
//                {
//                    window.location = "mapDefinition.jsp";
//                    return false;
//                },
//            }, "MapTable");
        </script>--> 

        <h3>Extractor</h3>
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
                    window.location = "extractor.jsp?_id=" + record._id;
                    return false;
                }
                ,
                addButtonClick: function (event)
                {
                    window.location = "extractor.jsp";
                    return false;
                },
            }, "Extractor");
        </script>

        <h3>Reemplazar ocurrencia</h3>
        <script type="text/javascript">
            var remplazo = eng.createGrid({
                left: "-10",
                margin: "10px",
                width: "100%",
                height: 200,
                canEdit: true,
                canRemove: true,
                canAdd: true,
//                recordDoubleClick: function (grid, record)
//                {
//                    window.location = "endPoint.jsp?_id=" + record._id;
//                    return false;
//                }
//                ,
//                addButtonClick: function (event)
//                {
//                    window.location = "endPoint.jsp";
//                    return false;
//                },
            }, "Replace");
        </script>
        
                <h3>Catálogo de Ciudades</h3>
        <script type="text/javascript">
            var cities = eng.createGrid({
                left: "-10",
                margin: "10px",
                width: "100%",
                height: 200,
                canEdit: true,
                canRemove: true,
                canAdd: true,
//                recordDoubleClick: function (grid, record)
//                {
//                    window.location = "endPoint.jsp?_id=" + record._id;
//                    return false;
//                }
//                ,
//                addButtonClick: function (event)
//                {
//                    window.location = "endPoint.jsp";
//                    return false;
//                },
            }, "Ciudad");
        </script>
    </body>
</html>