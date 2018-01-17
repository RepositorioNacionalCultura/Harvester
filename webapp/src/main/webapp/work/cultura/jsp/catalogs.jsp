<%-- 
    Document   : catalogs
    Created on : 23-nov-2017, 12:25:31
    Author     : juan.fernandez
--%><%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <jsp:include page="../../templates/metas.jsp" flush="true"></jsp:include>
        <title>Repositorio Digital del Patrimonio Nacional de Cultura - Catálogos</title>
    </head>
    <body class="animated fadeIn">
        <jsp:include page="../../templates/topnav.jsp" flush="true">
            <jsp:param name="activeItem" value="catalogs" />
        </jsp:include>
        <div class="container-fluid">
            <div class="row">
                <jsp:include page="../../templates/sidenav.jsp" flush="true">
                    <jsp:param name="activeItem" value="catalogs" />
                </jsp:include>
                <main role="main" class="col-sm-9 ml-sm-auto col-md-10 pt-3">
                    <h2>Catálogos</h2>
                    <h4>Verbos</h4>
                    <hr>
                        <script type="text/javascript">
                            var verbs = eng.createGrid({
                                left: "0",
                                margin: "10px",
                                width: "80%",
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

                    <h4>Prefijos de metadatos</h4>
                    <hr>
                    <script type="text/javascript">
                        var metaPrefix = eng.createGrid({
                            left: "0",
                            margin: "10px",
                            width: "80%",
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

                    <h4>Reemplazo de ocurrencias</h4>
                    <hr>
                    <script type="text/javascript">
                        var remplazo = eng.createGrid({
                            left: "0",
                            margin: "10px",
                            width: "80%",
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

                    <h4>Ciudades</h4>
                    <hr>
                    <script type="text/javascript">
                        var cities = eng.createGrid({
                            left: "0",
                            margin: "10px",
                            width: "80%",
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
                </main>
            </div>
        </div>
        <jsp:include page="../../templates/bodyscripts.jsp" flush="true"></jsp:include>
    </body>
</html>