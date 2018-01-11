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
        <title>Detalle Extractor</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="/platform/js/eng.js" type="text/javascript"></script>
    </head>
    <body>
        <div>Detalle Extractor</div>
        <script type="text/javascript">
            eng.initPlatform("datasources.js", false);
            var form = eng.createForm({
            width: "100%",
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
                    {name: "mapeo", title: "Tabla de mapeo", stype: "select", dataSource: "MapDefinition", endRow:true},
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
                    {name:"script", title:"Script de transformación", startRow:true, type:"textArea", width:"100%", colSpan:5}
            <%}%>
                    ]
            }, <%=id%>, "Extractor");
            form.buttons.addMember(isc.IButton.create(
            {
            title: "Cosechar",
                    padding: "10px",
                    click: function (p1) {
                    window.location = "harvest.jsp?_id=<%=pid%>&act=EXTRACT";
                    return false;
                    }
            }));
            form.buttons.addMember(isc.IButton.create(
            {
            title: "Actualizar",
                    padding: "10px",
                    click: function (p1) {
                    window.location = "harvest.jsp?_id=<%=pid%>&act=UPDATE";
                    return false;
                    }
            }));
            form.buttons.addMember(isc.IButton.create(
            {
            title: "Reemplazar",
                    padding: "10px",
                    click: function (p1) {
                    window.location = "harvest.jsp?_id=<%=pid%>&act=REPLACE";
                    return false;
                    }
            }));
            form.buttons.addMember(isc.IButton.create(
            {
            title: "Procesar",
                    padding: "10px",
                    click: function (p1) {
                    window.location = "harvest.jsp?_id=<%=pid%>&act=PROCESS";
                    return false;
                    }
            }));
            form.buttons.addMember(isc.IButton.create(
            {
            title: "Detener",
                    padding: "10px",
                    click: function (p1) {
                    window.location = "harvest.jsp?_id=<%=pid%>&act=STOP";
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
                    window.location = "catalogs.jsp";
                    return false;
                    }
            }));


        </script>         
    </body>
</html>
