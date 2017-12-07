<%-- 
    Document   : index
    Created on : Dec 15, 2013, 5:30:59 PM
    Author     : javier.solis.g
--%>
<%@page import="org.semanticwb.datamanager.*"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>SWBForms...</title>
        <script src="/platform/js/eng.js" type="text/javascript"></script>
    </head>
    <body>
        <h1>SWBForms started...</h1>
        <script type="text/javascript">
            eng.initPlatform([]);
        </script>        
<%
    SWBScriptEngine eng=DataMgr.initPlatform(session);
    DataObject user=eng.getUser(); 
    if(user!=null)
    {
%>
        <h2>User</h2>
        <div>User: <%=user.getString("fullname")%></div>
        <div>Email: <%=user.getString("email")%> <div>
<%
    }
%>        
        <h2>Paths</h2>
        <div><a href="/login">/login</a></div>
        <div><a href="/register">/register</a></div>
        <div><a href="/utils/users.html">/utils/users.html</a></div>
        <div><a href="/vquery/visualsearch.jsp">/vquery/visualsearch.jsp</a></div>
    </body>
</html>
