<%-- 
    Document   : register
    Created on : 26-ago-2015, 17:54:48
    Author     : javiersolis
--%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@page import="org.semanticwb.datamanager.*"%><%
    String fullname=request.getParameter("fullname");
    String email=request.getParameter("email");
    String password=request.getParameter("password");
    String password2=request.getParameter("password2");
    if(email!=null && password!=null)
    {
        SWBScriptEngine engine=DataMgr.initPlatform("/work/cultura/jsp/datasources.js",session);
        SWBDataSource ds=engine.getDataSource("User");
        DataObject r=new DataObject();
        DataObject data=new DataObject();
        r.put("data", data);
        data.put("email", email);
        DataObject ret=ds.fetch(r);

        DataList rdata=ret.getDataObject("response").getDataList("data");
        if(!rdata.isEmpty())
        {
            
            response.sendRedirect("/register?emsg=Usuario ya existe");
            return;
        }
        
        
        
        if(password.equals(password2))
        {
 
            DataObject obj=new DataObject();
            obj.put("fullname", fullname);
            obj.put("email", email);
            obj.put("password", password);
            ds.addObj(obj);
            //engine.close();
            response.sendRedirect("/login");
            return;
        }
    }
%><!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">      
    <title>Register</title>
  </head>
  <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,700" rel="stylesheet">
<link href="https://fonts.googleapis.com/css?family=Oswald:200,500,600" rel="stylesheet">
<link href="https://unpkg.com/ionicons@4.2.0/dist/css/ionicons.min.css" rel="stylesheet">
<link href="/work/cultura/jsp/harvester.css" rel="stylesheet">
  
  <body class="harvester">
    <div class="container">
    <h1>Register</h1>      
    <form action="" method="post" class="form-signin">
      <div class="form-group has-feedback">
        <input type="text" name="fullname" class="form-control" placeholder="Full name"/>
        <span class="glyphicon glyphicons-user form-control-feedback"></span>
      </div>
      <div class="form-group has-feedback">
        <input type="email" name="email" class="form-control" placeholder="Email"/>
        <span class="glyphicon glyphicon-envelope form-control-feedback"></span>
      </div>
      <div class="form-group has-feedback">
        <input type="password" name="password" class="form-control" placeholder="Password"/>
        <span class="glyphicon glyphicon-lock form-control-feedback"></span>
      </div>
      <div class="form-group has-feedback">
        <input type="password" name="password2" class="form-control" placeholder="Retype password"/>
        <span class="glyphicon glyphicon-log-in form-control-feedback"></span>
      </div>        
      <div class="row">
        <div class="col-xs-4">
          <button type="submit" class="btn btn-primary btn-block btn-flat">Register</button>
        </div><!-- /.col -->
      </div>
    </form>
    </div>
    <script type="text/javascript">
      <% 
          if(request.getParameter("emsg")!=null){
          out.println("alert(\""+request.getParameter("emsg")+"\");");
      }
      %>
  </script>
  <jsp:include page="../templates/bodyscripts.jsp" flush="true"></jsp:include>
  </body>
</html>