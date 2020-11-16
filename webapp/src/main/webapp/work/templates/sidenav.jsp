<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%
String active = request.getParameter("activeItem");
%>
<nav class="col-sm-3 col-md-2 d-none d-sm-block bg-light sidebar">
     <h1>Harvester</h1>
    <ul class="nav nav-pills flex-column">
        <jsp:include page="navoptions.jsp" flush="true">
            <jsp:param name="activeItem" value="<%=active%>" />
        </jsp:include>
    </ul>
</nav>