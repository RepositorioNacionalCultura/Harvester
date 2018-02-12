<%-- 
    Document   : mapDefinition
    Created on : 23-nov-2017, 18:19:41
    Author     : juan.fernandez
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<%
    String id=request.getParameter("_id");  
    if(id!=null)id="\""+id+"\"";
%>
<html>
    <head>
        <title>Detalle Extractor</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="/platform/js/eng.js" type="text/javascript"></script>
    </head>
    <body>
        <div>Definición Mapeo</div>
        <script type="text/javascript">
            eng.initPlatform("datasources.js",false);
            
            var form=eng.createForm({
                width: "100%",
                height: 320,
                showTabs:true,
                title:"Extractor"
            }, <%=id%>,"MapDefinition");
            
            form.submitButton.setTitle("Enviar");
            
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
                click: function(p1) {
                    window.location = "catalogs.jsp";
                    return false;
                }
            }));             
            
        </script>         
    </body>
</html>
