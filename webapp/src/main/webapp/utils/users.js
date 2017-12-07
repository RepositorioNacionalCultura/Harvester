//******* DataSorices ************
eng.dataSources["User"]={
    scls: "User",
    modelid: "SWBForms",
    dataStore: "mongodb",  
    displayField: "fullname",
    fields:[
        {name:"fullname",title:"Nombre",type:"string"},
        //{name:"username",title:"Usuario",type:"string"},
        {name:"password",title:"Contraseña",type:"password"},
        {name:"email",title:"Correo electrónico",type:"string", validators:[{type:"isUnique"}]},
        {name:"roles",title:"Roles",stype:"select", valueMap:{director:"Director",gerente:"Gerente",subgerente:"Subgerente"},multiple:true},
        {name:"groups",title:"Grupos",stype:"select", valueMap:{infotec:"INFOTEC",dac:"DAC",gdnps:"GDNPS",dads:"DADS"},multiple:true},
    ],
};
