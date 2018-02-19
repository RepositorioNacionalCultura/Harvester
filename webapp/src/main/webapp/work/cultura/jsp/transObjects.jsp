<%-- 
    Document   : extractores
    Created on : 08-dic-2017, 10:19:49
    Author     : juan.fernandez
--%><%@page import="org.semanticwb.datamanager.*"%>
<%
    String id = request.getParameter("_id");
    String pid = id;
    SWBScriptEngine engine = DataMgr.initPlatform("/work/cultura/jsp/datasources.js", session);
    SWBDataSource datasource = engine.getDataSource("Extractor");
    SWBDataSource dsTO = null;
    DataObject dobj = datasource.fetchObjById(id);
    if (null != dobj && dobj.getString("name", null) != null) {
        dsTO = engine.getDataSource("TransObject", dobj.getString("name").toUpperCase());
        //ds.fetch({starRow:0,endRow:1000,textMatchStyle:"substring",data:{"nombre":"var5000"}})
    }
    if (dsTO == null) {
        return;
    }
    String action = request.getParameter("act");
//System.out.println("Action:"+action);
    if (null != action && action.equals("update")) {
//                                                        act = update & objid = "+this.value+" & val = true
//System.out.println("Actualizando por ajax");
        String objid = request.getParameter("objid");
        DataObject transDO = dsTO.fetchObjById(objid);
        String val = request.getParameter("val");
        if (val != null) {
            if (val.equals("true")) {
                transDO.put("forIndex", true);
            } else {
                transDO.put("forIndex", false);
            }
            dsTO.updateObj(transDO);
            System.out.println("OK");
        } else {
            System.out.println("MISSING VALUES");
        }
        return;
    }
    String query = request.getParameter("q");
%>
<%@page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
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
                    <h2>Objetos transformados</h2>
                    <form method="post" action="/cultura/transObjects">
                        <input type="hidden" name="_id" value="<%=id%>" >
                        <input type="text" placeholder="Busca palabra en título y/o descripción" name="q" value="<%=query != null ? query : ""%>" size="100" ><button type="submit">filtrar</button>
                    </form>
                    <%

                        String status = "";
                        long numItems = 0;

                        int numpage = 0;
                        int resTotal = 0;
                        if (request.getParameter("npage") != null) {
                            try {
                                numpage = Integer.parseInt(request.getParameter("npage"));
                                numpage--;
                            } catch (Exception e) {
                            }
                        }
                        if (request.getParameter("page") != null) {
                            try {
                                numpage = Integer.parseInt(request.getParameter("page"));
                            } catch (Exception e) {
                            }
                        }
                        if (request.getParameter("total") != null) {
                            try {
                                resTotal = Integer.parseInt(request.getParameter("total"));
                            } catch (Exception e) {
                            }
                        }
                        int totalPages = 0;
                        int totalRows = 0;
                        if (resTotal > 0) {
                            totalPages = resTotal / 50;
                            if ((resTotal / 50) > totalPages) {
                                totalPages++;
                            }
                        }
                        if (numpage < 0) {
                            numpage = 0;
                        }
                        if (numpage > totalPages) {
                            numpage = totalPages;
                        }
                        DataObject doItems = new DataObject();
                        doItems.put("startRow", numpage * 50);
                        doItems.put("endRow", (numpage * 50) + 50);
                        if (query != null && query.trim().length() > 0) {
//                            System.out.println("QUERY:" + query);
                            DataObject data = new DataObject();
                            doItems.put("data", data);
                            //IDENTIFIER, TITLE, DESCRIPTION
                            DataObject sub = data.addSubObject("$text");
                            sub.addParam("$search", query);
//                            System.out.println("query:" + data.toString());

                            //sub.addParam("identifier", query).addParam("title", query).addParam("description", query);
                        }
                        DataObjectIterator res = dsTO.find(doItems);
                        //System.out.println("RES:" + res);
                        totalRows = res.total();
                        //System.out.println("regs:" + totalRows);
                        if (totalRows > 0) {
                            totalPages = totalRows / 50;
                            if ((totalRows / 50) > totalPages) {
                                totalPages++;
                            }

                    %>
                    <form>
                        <table class="table">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Título</th>
                                    <th scope="col">Tipo</th>
                                    <th scope="col">Visible</th>
                                </tr>
                            </thead>
                            <tbody>
                                <%                                    int numItem = numpage * 50;
                                    while (res.hasNext()) {
                                        DataObject dotmp = res.next();
                                        String mymodalid = dotmp.getId();
                                        //buscar el id con prefered=true
                                        String tmpId = null;
                                        try {
                                            tmpId = dotmp.getDataList("identifier").getDataObject(0).getString("value");
                                        } catch (Exception e) {
                                            tmpId = dotmp.get("identifier").toString();
                                            //System.out.println("No identifier");
                                        }
                                        //revisar si tiene título
                                        String tmpTitle = "No disponible";
                                        try {
                                            if (dotmp.getDataList("resourcetitle") != null && !dotmp.getDataList("resourcetitle").isEmpty()) {
//                                                System.out.println("size:" + dotmp.getDataList("resourcetitle").size());
                                                StringBuilder sbTitles = new StringBuilder();
                                                for (int idx = 0; idx < dotmp.getDataList("resourcetitle").size(); idx++) {
                                                    DataObject dotitle = dotmp.getDataList("resourcetitle").getDataObject(idx);
//                                                        String titleType = dotitle.getString("type",null);
//                                                        if(null!=titleType){
//                                                            if("dc".equals(titleType)){
                                                    if (dotitle.getDataList("value") != null && !dotitle.getDataList("value").isEmpty()) {
                                                        for (int j = 0; j < dotitle.getDataList("value").size(); j++) {
                                                            String tmpTitleValue = dotitle.getDataList("value").get(j).toString();
                                                            if (null != tmpTitleValue && tmpTitleValue.trim().length() > 0) {
                                                                if (sbTitles.toString().length() > 0) {
                                                                    sbTitles.append("<br>");
                                                                }
                                                                sbTitles.append(tmpTitleValue);
                                                            }
                                                        }
                                                    } else {
                                                        if (sbTitles.toString().length() > 0) {
                                                            sbTitles.append("<br>");
                                                        }

                                                        sbTitles.append(dotitle.getString("value")).append(" ");
                                                    }

                                                }
//                                                tmpTitle = mx.gob.cultura.util.Util.toStringHtmlEscape(sbTitles.toString());
//                                                tmpTitle = mx.gob.cultura.util.Util.toStringHtmlEscape(dotmp.getDataList("resourcetitle").getDataObject(0).getDataList("value").toString());
                                                tmpTitle = mx.gob.cultura.commons.Util.TEXT.toStringHtmlEscape(dotmp.getDataList("resourcetitle").toString());
                                                //tmpTitle = dotmp.getDataList("resourcetitle").getDataObject(0).getDataList("value").get(0).toString();
                                            } else if(dotmp.getString("resourcetitle")!=null){
                                                tmpTitle = dotmp.getString("resourcetitle");

                                            } else {
                                                tmpTitle = "NO TITLE AVAILABLE";
                                            }
                                        } catch (Exception e) {
                                            tmpTitle = dotmp.get("resourcetitle").toString();
                                            //System.out.println("No title");
                                        }
                                        //revisar si tiene descripción
                                        String tmpDescrip = dotmp.getString("resourcedescription", "NO DESCRIPTION AVAILABLE");
                                        String tmpDigital = dotmp.getString("digitalObject", "NO DIGITAL OBJECT FOUND");

                                        String tipos = dotmp.get("resourcetype").toString();
                                        try {
                                            if (!dotmp.getDataList("resourcetype").isEmpty()) {
                                                tipos = dotmp.getDataList("resourcetype").getDataObject(0).getString("value", "NO TYPE AVAILABLE");
                                            } else {
                                                tipos = "NO TYPE AVAILABLE";

                                            }
                                        } catch (Exception e) {
                                            tipos = dotmp.get("resourcetype").toString();
                                            //System.out.println("No title");
                                        }

                                        String rights = dotmp.getString("rights", "NO RIGHTS FOUND");

                                        String autor = dotmp.getString("creator", "NO AUTHOR FOUND");

                                        String datecreated = dotmp.getString("datecreated", "NO CREATION DATE FOUND");

                                        String periodcreated = dotmp.getString("periodcreated", "NO CREATION PERIOD FOUND");

                                        String holder = dotmp.getString("holder", "NO HOLDER FOUND");

                                        numItem++;
                                %>
                                <tr>
                                    <th scope="row" data-toggle="tooltip" title="<%=tmpId%>"><%=numItem%></th>
                                    <td data-toggle="modal" data-target="#myModal<%=mymodalid%>"><%=tmpTitle%>
                                        <!-- Modal -->
                                        <div class="modal fade" id="myModal<%=mymodalid%>" role="dialog">
                                            <div class="modal-dialog modal-lg">

                                                <!-- Modal content-->
                                                <div class="modal-content">
                                                    <div class="modal-header">
                                                        <h4 class="modal-title">Información</h4>
                                                        <button type="button" class="close" data-dismiss="modal">&times;</button>

                                                    </div>
                                                    <div class="modal-body">
                                                        <table class="table table-sm">
                                                            <tr><th scope="row">ID</th><td><%=tmpId%></td></tr>
                                                            <tr><th scope="row">TITULO</th><td><%=tmpTitle%></td></tr>
                                                            <tr><th scope="row">DESCRIPCIÓN</th><td><%=tmpDescrip%></td></tr>
                                                            <tr><th scope="row">OBJETO DIGITAL</th><td><%=tmpDigital%></td></tr>
                                                            <tr><th scope="row">TIPO</th><td><%=tipos%></td></tr>

                                                            <tr><th scope="row">DERECHOS</th><td><%=rights%></td></tr>
                                                            <tr><th scope="row">AUTOR</th><td><%=autor%></td></tr>
                                                            <tr><th scope="row">FECHA</th><td><%=datecreated%></td></tr>
                                                            <tr><th scope="row">PERIODO</th><td><%=periodcreated%></td></tr>
                                                            <tr><th scope="row">HOLDER</th><td><%=holder%></td></tr>

                                                        </table>
                                                    </div>
                                                    <div class="modal-footer">
                                                        <button type="button" class="btn btn-default" data-dismiss="modal">Cerrar</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>                                 
                                    </td>
                                    <td><%=tipos%></td>
                                    <td><input type="checkbox" name="items" class="tobj" value="<%=dotmp.getId()%>" <%=dotmp.getBoolean("forIndex", false) ? "checked" : ""%>> </td>
                                </tr>
                                <%

                                    }

                                %>
                            </tbody>
                        </table>
                    </form>
                        <hr> <div align="center"><%if (numpage > 0) {%><button onclick="window.location = '?_id=<%=id%>&page=<%=numpage - 1%>&total=<%=totalRows%>&q=<%=query != null ? query : ""%>';">Anterior</button>    
                        <% }
                            if (numpage < totalPages) {%><button onclick="window.location = '?_id=<%=id%>&page=<%=numpage + 1%>&total=<%=totalRows%>&q=<%=query != null ? query : ""%>';">Siguiente</button><% }%> 

                        <%if ((totalPages + 1) > 0) {%>
                        <form action="/cultura/transObjects" method="post">
                            <input type="hidden" name="_id" value="<%=id%>"><input type="hidden" name="total" value="<%=totalRows%>"><input type="hidden" name="q" value="<%=query != null ? query : ""%>">
                            Página <input type="text" name="npage" size="5" value="<%=numpage + 1%>"> de <%=totalPages + 1%> <button type="submit" >Ir</button>
                        </form>
                        <%}%>
                    </div>
                    <% } else { %>
                    <h3>No se encontró información.</h3>
                    <% }%>
                </main>
            </div>
        </div>
        <jsp:include page="../../templates/bodyscripts.jsp" flush="true"></jsp:include>
        </body>
        <script>
            $(document).ready(function () {
                $('[data-toggle="tooltip"]').tooltip();
                $('.tobj').click(function () {
//                    alert(this.value);
                    getAjax("/cultura/transObjects?_id=<%=id%>&act=update&val=" + this.checked + "&objid=" + this.value, function (data) {
                        console.log(data);
                    })
                });
            });

            function getAjax(url, success) {
                var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
                xhr.open('GET', url);
                xhr.onreadystatechange = function () {
                    if (xhr.readyState > 3 && xhr.status == 200)
                        success(xhr.responseText);
                };
                xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                xhr.send();
                return xhr;
            }

    </script>
</html>