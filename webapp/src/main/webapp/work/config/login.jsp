<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@page import="org.semanticwb.datamanager.*"%>
<%
    String email=request.getParameter("email");
    String password=request.getParameter("password");
    String logout=request.getParameter("logout");

    if (null != logout && "true".equals(logout)) {
        session.removeAttribute("_USER_");
        response.sendRedirect("/login");
        return;
    }

    if(email!=null && password!=null)
    {
        SWBScriptEngine engine=DataMgr.initPlatform(session);
        SWBDataSource ds=engine.getDataSource("User");  
        DataObject r=new DataObject();
        DataObject data=new DataObject();
        r.put("data", data);
        data.put("email", email);
        data.put("password", password);
        DataObject ret=ds.fetch(r);
 
        DataList rdata=ret.getDataObject("response").getDataList("data");

        if(!rdata.isEmpty())
        {
            session.setAttribute("_USER_", rdata.get(0));
            response.sendRedirect("/");
            return;
        }
    }
%>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.3/css/bootstrap.min.css" integrity="sha384-Zug+QiDoJOrZ5t4lssLdxGhVrurbmBWopoEl+M6BdEfwnCJZtKxi1KgxUyJq13dy" crossorigin="anonymous">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css">
        <style type="text/css">
            body {
                padding-top: 40px;
                padding-bottom: 40px;
                background-color: #eee;
            }

            .form-signin {
                max-width: 330px;
                padding: 15px;
                margin: 0 auto;
            }
            .form-signin .form-signin-heading,
            .form-signin .form-control {
                position: relative;
                box-sizing: border-box;
                height: auto;
                padding: 10px;
                font-size: 16px;
            }
            .form-signin .form-control:focus {
                z-index: 2;
            }
            .form-signin input[type="email"] {
                margin-bottom: -1px;
                border-bottom-right-radius: 0;
                border-bottom-left-radius: 0;
            }
            .form-signin input[type="password"] {
                margin-bottom: 10px;
                border-top-left-radius: 0;
                border-top-right-radius: 0;
            }
        </style>
        <script defer src="https://use.fontawesome.com/releases/v5.0.4/js/all.js"></script>
        <title>Inicio de sesión</title>
    </head>
    <body class="animated slideInDown">
        <div class="container">
            <form action="/login" method="post" class="form-signin">
                <h2 class="form-signin-heading">Iniciar sesión</h2>
                <label for="email" class="sr-only">Email</label>
                <input type="email" name="email" id="email" class="form-control" placeholder="Email" required autofocus>
                <label for="password" class="sr-only">Password</label>
                <input type="password" id="password" name="password" class="form-control" placeholder="Password" required>
                <button class="btn btn-lg btn-primary btn-block" type="submit">Entrar</button>
            </form>
        </div>
    </body>
</html>