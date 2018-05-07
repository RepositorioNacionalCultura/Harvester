
eng.validators["email"] = {type: "regexp", expression: "^([a-zA-Z0-9_.\\-+])+@(([a-zA-Z0-9\\-])+\\.)+[a-zA-Z0-9]{2,4}$", errorMessage: "No es un correo electrónico válido"};

var monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

function fechahoy(thisfecha) {

    var fecha = new Date(Date.now());

    var day = fecha.getDate();
    var monthIndex = fecha.getMonth();
    var year = fecha.getFullYear();
    var hora = fecha.getHours();
    var minutos = fecha.getMinutes();
    if (minutos < 10)
        minutos = "0" + minutos;
    var secs = fecha.getSeconds();
    if (secs < 10)
        secs = "0" + secs;

    if (thisfecha) {
        var strFecha = new String(thisfecha);
        year = strFecha.substring(0, strFecha.indexOf("-"));
        monthIndex = strFecha.substring(strFecha.indexOf("-") + 1, strFecha.lastIndexOf("-"));
        day = strFecha.substring(strFecha.lastIndexOf("-") + 1);
        return day + "/" + monthIndex + "/" + year;
    }

//2017-12-01T13:05:00.000

    return day + "/" + monthNames[monthIndex] + "/" + year + " " + hora + ":" + minutos + ":" + secs + " hrs.";

}

function datetimeNow() {

    var fecha = new Date(Date.now());

    var day = fecha.getDate();
    var monthIndex = fecha.getMonth();
    var year = fecha.getFullYear();
    var hora = fecha.getHours();
    var minutos = fecha.getMinutes();
    if (minutos < 10)
        minutos = "0" + minutos;
    var secs = fecha.getSeconds();
    if (secs < 10)
        secs = "0" + secs;


//2017-12-01T13:05:00.000

    return year + "-" + monthIndex + "-" + day + "T" + hora + ":" + minutos + ":" + secs + "." + fecha.getMilliseconds();

}

eng.dataSources["Objects"] = {
    scls: "Objects",
    modelid: "MEDIATECA",
    dataStore: "mongodb",
    displayField: "identifier",
    fields: [
        {name: "identifier", title: "Identificador", type: "string", required: true},
        {name: "body", title: "Registro", type: "string", required: true}
    ]
};




eng.dataSources["Verbs"] = {
    scls: "Verbs",
    modelid: "Cultura",
    dataStore: "mongodb",
    displayField: "name",
    fields: [
        {name: "cve", title: "Clave", type: "string", required: true},
        {name: "name", title: "Nombre", type: "string", required: true}
    ]
};


var vals_verbs = eng.getDataSource("Verbs").toValueMap("cve", "name");

eng.dataSources["MetaData_Prefix"] = {
    scls: "MetaData_Prefix",
    modelid: "Cultura",
    dataStore: "mongodb",
    displayField: "name",
    fields: [
        {name: "cve", title: "Clave", type: "string", required: true},
        {name: "name", title: "Nombre", type: "string", required: true}
    ]
};

var vals_meta = eng.getDataSource("MetaData_Prefix").toValueMap("cve", "name");
/********** EndPoint ********/
//eng.dataSources["EndPoint"]={
//    scls: "EndPoint",
//    modelid: "Cultura",
//    dataStore: "mongodb",
//    displayField:"name",
//    fields:[
//        {name:"name",title:"Nombre/Modelo",type:"string"},
//        {name:"url",title:"URL",type:"string"},
//        
//        {name:"created",title:"Fecha",type:"date"}
//    ]     
//};



/********** Definición mapeo ********/
eng.dataSources["MapDefinition"] = {
    scls: "MapDefinition",
    modelid: "Cultura",
    dataStore: "mongodb",
    displayField: "mapTable",
    fields: [
        {name: "mapTable", title: "Tabla", stype: "grid", dataSource: "MapTable",width: "100%", height: "500", colSpan: 6}
    ]
};

/********** Definición mapeo ********/
eng.dataSources["TransformationScript"] = {
    scls: "TransformationScript",
    modelid: "Cultura",
    dataStore: "mongodb",
    displayField: "script",
    fields: [
        {name: "script", 
            title: "Script", 
            type: "textArea", 
            width: "100%", 
            height: "500", 
            colSpan: 6
            
        }
    ]
};

/********** Tabla de mapeo ********/
eng.dataSources["MapTable"] = {
    scls: "MapTable",
    modelid: "Cultura",
    dataStore: "mongodb",
    displayField: "property",
    fields: [
        {name: "property", title: "Propiedad", type: "string", required: true},
        {name: "collName", title: "Colección / Catálogo", type: "string", required: true},
    ]
};
/********** Tabla de mapeo ********/
eng.dataSources["Valores"] = {
    scls: "Valores",
    modelid: "Cultura",
    dataStore: "mongodb",
    displayField: "tagFrom+tagTo",
    fields: [
        {name: "valor", title: "Valor", type: "string", required: true},
    ]
};
/********** Extractor ********/
eng.dataSources["Extractor"] = {
    scls: "Extractor",
    modelid: "Cultura",
    dataStore: "mongodb",
    displayField: "endpoint",

    fields: [
        {name: "name", title: "Nombre/Modelo", type: "string"},
//        {name:"collection",title:"Nombre de la colección",type:"string"},
        {name: "url", title: "URL", type: "string"},
//        {name:"endpoint",title:"EndPoint",stype:"select", dataSource:"EndPoint", required:true},
        {name: "verbs", title: "Verbos", type: "select",
            valueMap: vals_verbs, defaultValue: "Identify", required: true},
        {name: "prefix", title: "MetaData PREFIX", type: "select",
            valueMap: vals_meta, multiple: true, defaultValue: "mods"},
        {name: "resumptionToken", title: "Soporta Resumption Token", type: "boolean", defaultValue: false},
        {name: "tokenValue", title: "Token", type: "string"},
        {name: "pfxExtracted", title: "Prefijos extraidos", type: "string"},
        {name: "pfxActual", title: "Prefijo actual", type: "string"},
        {name: "class", title: "Nombre de la Clase a utilizar", type: "select", valueMap: {"OAIExtractor": "OAIExtractor", "CSVExtractor": "CSVExtractor","JSONExtractor": "JSONExtractor"}, defaultValue: "OAIExtractor"},
        {name: "csvfile", title: "Archivo CSV", stype: "file"},
        {name: "periodicity", title: "Periodicidad", type: "boolean"},
        {name: "interval", title: "Intervalo de tiempo (días)", type: "int"},
        {name: "created", title: "Fecha creación", type: "string", useTextField: true},
        {name: "lastExecution", title: "Última ejecución", type: "string", useTextField: true},
        {name: "status", title: "Estatus", type: "select", valueMap: {"LOADED": "LOADED", "STARTED": "STARTED", "EXTRACTING": "EXTRACTING", "STOPPED": "STOPPED", "FAILLOAD": "FAIL LOAD", "ABORTED": "ABORTED"}, defaultValue: "LOADED"}, //STARTED | EXTRACTING | STOPPED
        {name: "rows2harvest", title: "Registros por cosechar", type: "int"},
        {name: "harvestered", title: "Registros cosechados", type: "int"},
        {name: "rows2Processed", title: "Registros por procesar", type: "int"},
        {name: "processed", title: "Registros procesados", type: "int"},
        {name: "indexed", title: "Registros indexados", type: "int"},
        {name: "cursor", title: "Tamaño del bloque", type: "int"}
    ],
    links: [
        {name: "mapDef", title: "Tabla de mapeo",  stype: "tab", dataSource: "MapDefinition"},
        {name: "transScript", title: "Script transformación", stype: "tab", dataSource: "TransformationScript"},
    ]

};

//dataProcessor
eng.dataProcessors["dpExtractor"] = {
    dataSources: ["Extractor"],
    actions: ["add", "update"],
    request: function (request, dataSource, action)
    {
        if (action === "add") {
            request.data.created = datetimeNow();
        }
        if (action === "update") {
            if (request.data.script) {
                print(request.data.script);
                var str_tmp = new String(request.data.script);
                str_tmp = str_tmp.replace("<", "&lt;");
                str_tmp = str_tmp.replace(">", "&gt;");
                print(request.data.script);
            }

        }
        return request;
    },
    response_: function (response, dataSource, action)
    {
        return response;
    }
};

//eng.dataServices["dsExtractor"] = {
//    dataSources: ["Extractor"],
//    actions: ["add", "remove", "update"],
//    service: function (request, response, dataSource, action)
//    {
//        if (action === "update") {
//            //actualizar el extractor en el extractor manager
//            var ds = this.getDataSource("Extractor");
//            var dobj = ds.fetchObjById(request.data._id);
//            if (null !== dobj) {
//                try {
//                    var extMgr = Java.type("mx.gob.cultura.extractor.ExtractorManager");
//                    extMgr.loadExtractor(dobj);
//                } catch (err) {
//                    print("Error al cargar el Extractor en el Manager."+err);
//                }
//            }
//        }
//    }
//};

eng.dataSources["Replace"] = {
    scls: "Replace",
    modelid: "Cultura",
    dataStore: "mongodb",
    displayField: "name",
    fields: [
        {name: "occurrence", title: "Ocurrencia", type: "string", required: true},
        {name: "replace", title: "Remplazar por", type: "string", required: true}
    ]
};

eng.dataSources["Ciudad"] = {
    scls: "Ciudad",
    modelid: "Cultura",
    dataStore: "mongodb",
    displayField: "name",
    fields: [
        {name: "value", title: "Valor", type: "string", required: true},
        {name: "replace", title: "Remplazar por", type: "string", required: true}
    ]
};

eng.dataSources["TransObject"] = {
    scls: "TransObject",
    modelid: "Cultura",
    dataStore: "mongodb",
    displayField: "name",
    fields: [
        {name: "indexCreated", title: "Index Created", type: "string"}, //"indexCreated":"", //campo interno de control, no se expone
        {name: "indexUpdated", title: "Index Updated", type: "string"}, //"indexUpdated":"", //campo interno de control, no se expone
        {name: "forIndex", title: "For Index", type: "boolean", defaultValue:true},
        {name: "oaiid", title: "oaiid", type: "string"},
//	"forIndex": true, //campo interno de control, no se expone, será la bandera usada para saber si se indexa
        {name: "identifier", title: "Identifier", type: "object", multiple:true},
//	"identifier": [
//		{
//			"type": "oai",
//			"value": "oai:mediateca.inah.gob.mx:archivohistorico_21471",
//			"preferred": true
//		},
//		{
//			"type": "mediateca",
//			"value": "48_20130802-094000:65",
//			"preferred": false
//		},
//		{
//			"type": "mods",
//			"value": "http://mediateca.inah.gob.mx/islandora_74/islandora/object/archivohistorico%3A21471",
//			"preferred": false
//		}
//	],        
        {name: "resourcestats", title: "Resource Stats", type: "object"},
//	"resourcestats": { //campo interno de control, no se expone
//		"views": 0
//	},
	{name: "resourcetype", title: "Resource Type", type: "string", multiple:true},
        {name: "resourcetitle", title: "Resource Title", type: "object", multiple:true},
//        "resourcetitle": [ 
//		{
//			"type": "main",
//			"value": "Bando de orden real para que se decomisen las embarcaciones del comercio interior entre las Indias que lleven géneros prohibidos, virrey Martín de Mayorga, México"
//		}
//	],
        {name: "digitalobject", title: "Digital Object", type: "object", multiple:true},
//	"digitalobject": [
//		{
//			"downloads": 0, //campo interno de control, no se expone
//			"rights": [
//				{
//					"type": "useAndReproduction",
//					"url": "http://creativecommons.org/licenses/by-nc-nd/2.5/mx/",
//					"rightstitle": "Creative Commons (by-nc-nd)",
//					"description": "",
//					"holder": "Archivo Municipal de Taxco"
//				}
//			],
//			"digitalobjecttitle": [
//				"Bando de orden real para que se decomisen las embarcaciones del comercio interior entre las Indias que lleven géneros prohibidos, virrey Martín de Mayorga, México"
//			],
//			"url": "http://mediateca.inah.gob.mx/repositorio/islandora/object/archivohistorico:21471/datastream/OBJ/download",
//			"mediatype": {
//				"name": "Documento PDF",
//				"mime": "application/pdf"
//			}
//		}
//	],        
        {name: "rights", title: "Rights", type: "object", multiple:true}, // {"type": "useAndReproduction","url": "http://creativecommons.org/licenses/by-nc-nd/2.5/mx/","rightstitle": "Creative Commons (by-nc-nd)","description": "","holder": "Archivo Municipal de Taxco"}
        {name: "creator", title: "Creator", type: "string", multiple:true},
        {name: "datecreated", title: "Date Created", type: "object"}, //{"format": "w3cdtf","value": "1781-03-13"}
        {name: "periodcreated", title: "Period Created", type: "object"}, // {name": "","datestart": {"format": "","value": "1773"},"dateend": {"format": "","value": "1781"}}
        {name: "holder", title: "Holder", type: "string"},  // responsable
        {name: "collection", title: "Colección", type: "object", multiple:true},  
        {name: "lang", title: "Lenguajes", type: "object", multiple:true},  
        {name: "keywords", title: "Palabras clave", type: "object", multiple:true}

    ]
};
eng.dataSources["Nombres-de-Instituciones-custodias-y-funciones"] = {
    scls: "Nombres-de-Instituciones-custodias-y-funciones",
    modelid: "Cultura",
    dataStore: "mongodb",
    displayField: "nombre",
    fields: [
        {name: "idsistema", title: "Nombre", required: true, type: "string"},
        {name: "nombre", title: "Nombre", type: "string"},
        {name: "link", title: "Link", type: "string"},
        {name: "funcion", title: "Funcion", type: "string"},
    ]
};

eng.dataSources["Nombres-de-lenguas-en-espanol"] = {
    scls: "Nombres-de-lenguas-en-espanol",
    modelid: "Cultura",
    dataStore: "mongodb",
    displayField: "idsistema",
    fields: [
        {name: "idsistema", title: "ID sistema", required: true, type: "string", required: false},
        {name: "codigo-ISO-asignado", title: "Código ISO asignado", type: "string", required: false},
        {name: "lengua", title: "Lengua (nombre principal", type: "string", required: false},
        {name: "nombre-secundario", title: "Nombre secundario(1)", type: "string", required: false},
        {name: "nombre-secundario2", title: "Nombre secundario(2)", type: "string", required: false},
    ]
};

eng.dataSources["Nombres-de-unidades"] = {
    scls: "Nombres-de-unidades",
    modelid: "Cultura",
    dataStore: "mongodb",
    displayField: "tipos",
    fields: [
        {name: "unidades", title: "Unidades", required: true, type: "string", required: false},
        {name: "tipos", title: "Tipos", type: "string", required: false},
    ]
};

eng.dataSources["Codigos-ISO-e-INEGI"] = {
    scls: "Codigos-ISO-e-INEGI",
    modelid: "Cultura",
    dataStore: "mongodb",
    displayField: "tipos",
    fields: [
        {name: "cii", title: "Código ISO e INEGI", required: true, type: "string", required: false},
        {name: "origencodigo", title: "Origen del Código", type: "string", required: false},
        {name: "mombrepem", title: "Nombre del país, estado, municipio…", type: "string", required: false},
    ]
};

eng.dataSources["Tecnicas"] = {
    scls: "Tecnicas",
    modelid: "Cultura",
    dataStore: "mongodb",
    displayField: "tecnicas",
    fields: [
        {name: "idsistema", title: "ID sistema", required: true, type: "string", required: false},
        {name: "tecnicas", title: "Técnicas", type: "string", required: false},
    ]
};

eng.dataSources["Materiales"] = {
    scls: "Materiales",
    modelid: "Cultura",
    dataStore: "mongodb",
    displayField: "materiales",
    fields: [
        {name: "idsistema", title: "ID sistema", required: true, type: "string", required: false},
        {name: "materiales", title: "Materiales", type: "string", required: false},
    ]
};

eng.dataSources["Tipos-de-BIC"] = {
    scls: "Tipos-de-BIC",
    modelid: "Cultura",
    dataStore: "mongodb",
    displayField: "materiales",
    fields: [
        {name: "idsistema", title: "ID sistema", required: true, type: "string", required: false},
        {name: "tipoobj", title: "Tipos de objetos", type: "string", required: false},
    ]
};

eng.dataSources["Caracteristicas-fiscas-del-BIC"] = {
    scls: "Caracteristicas-fiscas-del-BIC",
    modelid: "Cultura",
    dataStore: "mongodb",
    displayField: "idsistema",
    fields: [
        {name: "idsistema", title: "ID sistema", required: true, type: "string", required: false},
        {name: "caracteristicas", title: "Características físicas", type: "string", required: false},
    ]
};

eng.dataSources["Tipos-de-adquisicion"] = {
    scls: "Tipos-de-adquisicion",
    modelid: "Cultura",
    dataStore: "mongodb",
    displayField: "tipoadq",
    fields: [
        {name: "tipoadq", title: "Tipos de adquisición", required: true, type: "string", required: false},
    ]
};

eng.dataSources["Modo-de-uso"] = {
    scls: "Modo-de-uso",
    modelid: "Cultura",
    dataStore: "mongodb",
    displayField: "idsistema",
    fields: [
        {name: "idsistema", title: "ID sistema", required: true, type: "string", required: false},
        {name: "tipoADQ", title: "Tipos de adquisición", required: true, type: "string", required: false},
    ]
};


eng.dataSources["Tipo-de-formato"] = {
    scls: "Tipo-de-formato",
    modelid: "Cultura",
    dataStore: "mongodb",
    displayField: "tipoext",
    fields: [
        {name: "formatos", title: "Formatos", required: true, type: "string", required: false},
        {name: "tipoext", title: "Tipo de extensión", required: true, type: "string", required: false},
    ]
};

eng.dataSources["Soporte-fisico"] = {
    scls: "Soporte-fisico",
    modelid: "Cultura",
    dataStore: "mongodb",
    displayField: "formatos",
    fields: [
        {name: "formatos", title: "Formatos", required: true, type: "string", required: false},
    ]
};

eng.dataSources["Tipo-de-titulo"] = {
    scls: "Tipo-de-titulo",
    modelid: "Cultura",
    dataStore: "mongodb",
    displayField: "tipodetitulo",
    fields: [
        {name: "tipodetitulo", title: "Tipo de título", required: true, type: "string", required: false},
    ]
};

eng.dataSources["Estado-de-conservacion"] = {
    scls: "Estado-de-conservacion",
    modelid: "Cultura",
    dataStore: "mongodb",
    displayField: "estadodeconservacion",
    fields: [
        {name: "estadodeconservacion", title: "Estado de conservación", required: true, type: "string", required: false},
    ]
};

eng.dataSources["Tipo-de-dimension"] = {
    scls: "Tipo-de-dimension",
    modelid: "Cultura",
    dataStore: "mongodb",
    displayField: "tipodedimensión",
    fields: [
        {name: "tipodedimension", title: "Tipo de dimensión", required: true, type: "string", required: false},
    ]
};

eng.dataSources["Tipo-de-descriptor"] = {
    scls: "Tipo-de-descriptor",
    modelid: "Cultura",
    dataStore: "mongodb",
    displayField: "tipodedescriptor",
    fields: [
        {name: "tipodedescriptor", title: "Tipo de descriptor", required: true, type: "string", required: false},
    ]
};

eng.dataSources["Tipo-de-marca"] = {
    scls: "Tipo-de-marca",
    modelid: "Cultura",
    dataStore: "mongodb",
    displayField: "tipodemarca",
    fields: [
        {name: "tipodemarca", title: "Tipo de marca", required: true, type: "string", required: false},
    ]
};

eng.dataSources["Tipo-de-nota"] = {
    scls: "Tipo-de-nota",
    modelid: "Cultura",
    dataStore: "mongodb",
    displayField: "tipodenota",
    fields: [
        {name: "tipodenota", title: "Tipo de nota", required: true, type: "string", required: false},
    ]
};

eng.dataSources["Tipo-de-lugar"] = {
    scls: "Tipo-de-lugar",
    modelid: "Cultura",
    dataStore: "mongodb",
    displayField: "tipodelugar",
    fields: [
        {name: "tipodelugar", title: "Tipo de lugar", required: true, type: "string", required: false},
    ]
};

eng.dataSources["Tipologia-documental"] = {
    scls: "Tipologia-documental",
    modelid: "Cultura",
    dataStore: "mongodb",
    displayField: "tipologia-documental",
    fields: [
        {name: "tipologia-documental", title: "Tipología documental", required: true, type: "string", required: false},
    ]
};

eng.dataSources["Tipos-de-identificador"] = {
    scls: "Tipos-de-identificador",
    modelid: "Cultura",
    dataStore: "mongodb",
    displayField: "otrosregistros",
    fields: [
        {name: "otrosregistros", title: "Otros registros", required: true, type: "string", required: false},
    ]
};

eng.dataSources["Tiposdeobjetosnacidosdigitalmente"] = {
    scls: "Tiposdeobjetosnacidosdigitalmente",
    modelid: "Cultura",
    dataStore: "mongodb",
    displayField: "otrosregistros",
    fields: [
       {name: "idsistema", title: "ID sistema", required: true, type: "string", required: false},
       {name: "ond", title: "objetos nacidos digitalmente", required: true, type: "string", required: false},
    ]
};

eng.dataSources["Tiposdeagente"] = {
    scls: "Tiposdeagente",
    modelid: "Cultura",
    dataStore: "mongodb",
    displayField: "otrosregistros",
    fields: [
       {name: "agente", title: "Agente", required: true, type: "string", required: false},
       {name: "descripcion", title: "Descripción", required: true, type: "string", required: false},
    ]
};