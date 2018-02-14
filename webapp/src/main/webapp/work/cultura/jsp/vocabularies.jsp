<%-- 
    Document   : catalogs
    Created on : 23-nov-2017, 12:25:31
    Author     : juan.fernandez
--%><%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <jsp:include page="../../templates/metas.jsp" flush="true"></jsp:include>
        <title>Repositorio Digital del Patrimonio Nacional de Cultura - Vocabularios</title>
    </head>
    <body class="animated fadeIn">
        <jsp:include page="../../templates/topnav.jsp" flush="true">
            <jsp:param name="activeItem" value="catalogs" />
        </jsp:include>
        <div class="container-fluid">
            <div class="row">
                <jsp:include page="../../templates/sidenav.jsp" flush="true">
                    <jsp:param name="activeItem" value="vocabularies" />
                </jsp:include>
                <main role="main" class="col-sm-9 ml-sm-auto col-md-10 pt-3">
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
                        }, "Ciudad");
                    </script>

                    <h4>Instituciones custodias</h4>
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
                        }, "Holders");
                    </script>
                </main>
            </div>
        </div>
        <jsp:include page="../../templates/bodyscripts.jsp" flush="true"></jsp:include>
    </body>
</html>
