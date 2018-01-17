//******* DataStores ***************

eng.config={
    baseDatasource:"/WEB-INF/global.js",
    mail:{
        from:"xxx@gmail.com",
        fromName:"Name",
        host:"smtp.gmail.com",
        user:"email.gmail.com",
        passwd:"password",
        port:25,
        ssl:true,
        sslPort:465
    }
};

//******* DataStores ***************
eng.dataStores["mongodb"]={
    host:"localhost",
    port:27017,
    class: "org.semanticwb.datamanager.datastore.DataStoreMongo",
};
/*
eng.dataStores["ts_leveldb"]={
    path:"/data/leveldb",
    class: "org.semanticwb.datamanager.datastore.SemDataStore",
};
*/
//******* DataSorices ************
var roles={director:"Director",gerente:"Gerente",subgerente:"Subgerente"};
var groups={infotec:"INFOTEC",dac:"DAC",gdnps:"GDNPS",dads:"DADS"};

eng.dataSources["User"]={
    scls: "User",
    modelid: "SWBForms",
    dataStore: "mongodb",   
    displayField: "fullname",
    fields:[
        {name:"fullname",title:"Nombre",type:"string"},
        //{name:"username",title:"Usuario",type:"string"},
        {name:"password",title:"Contraseña",type:"password"},
        {name:"email",title:"Correo electrónico",type:"string", validators: [{type:"isUnique"}]},
        {name:"roles",title:"Roles",stype:"select", valueMap:roles,multiple:true},
        {name:"groups",title:"Grupos",stype:"select", valueMap:groups,multiple:true},
    ],
};

eng.dataSources["Permission"]={
    scls: "Permission",
    modelid: "SWBForms",
    dataStore: "mongodb",  
    displayField: "name",
    fields:[
        {name:"name",title:"Nombre",type:"string"},
        {name:"roles",title:"Roles",stype:"select", valueMap:roles,multiple:true},
    ],
};

/******* DataProcessors ************/
eng.dataProcessors["UserProcessor"]={
    dataSources: ["User"],
    actions:["fetch","add","update"],
    request: function(request, dataSource, action)
    {
        if(request.data.password)
        {
            request.data.password=this.utils.encodeSHA(request.data.password);
        }
        return request;
    }          
};

/******* Routes ************/
eng.routes["global"]={
    loginFallback: "login",
    routeList:[
        { routePath: "login", forwardTo: "/work/config/login.jsp", isRestricted: "false", zindex:1 },
        { routePath: "register", forwardTo: "/work/config/register.jsp", isRestricted: "false" },
        { routePath: "", forwardTo: "/index.jsp", isRestricted: "false"},
        { routePath: "work", isRestricted: "true"},
        { routePath: "work/*", jspMapTo: "/work/jsp/", isRestricted: "true" },
        { routePath: "cultura/*", jspMapTo: "/work/cultura/jsp/", isRestricted: "true" },
        { routePath: "ds", forwardTo: "/platform/jsp/datasource.jsp", isRestricted: "true" },
        { routePath: "ex", forwardTo: "/platform/jsp/export.jsp", isRestricted: "true" },
    ],
};