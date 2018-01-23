<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%
    String active = request.getParameter("activeItem");
%>
<li class="nav-item">
    <a class="nav-link <%= "catalogs".equals(active) ? "active": "" %>" href="/cultura/catalogs"><i class="fas fa-th-list fa-fw"></i>&nbsp;Catálogos <span class="sr-only">(current)</span></a>
</li>
<li class="nav-item">
    <a class="nav-link <%= "extractors".equals(active) ? "active": "" %>" href="/cultura/extractors"><i class="fas fa-cogs fa-fw"></i>&nbsp;Extractores</a>
</li>
<li class="nav-item">
    <a class="nav-link" href="/login?logout=true"><i class="fas fa-sign-out-alt fa-fw"></i>&nbsp;Salir</a>
</li>