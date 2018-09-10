function(data) {
/**
INALI CSV file Script
**/
    var doURL = "http://35.193.209.163/multimedia/INALI/";
    var ret = {};
    var idArray =[];
    var elType = [];
    var elTitle = [];
    var elDescrip = [];
    var elkeys = [];
    var elLang = [];
    var elLang2 = [];
    var dObjs = [];
    var elCollection = [];
    var elCreator = [];
    var arrHolder = [];
    var elGenerator = [];
    var urlLicense = "";
    var missing = [];
    var rightsTitle = "";
    var rights = "";
    var dotype = {};

// Más de la colección
    if (data.headersetspec) {
        if(data.headersetspec.indexOf(",")>-1){
            var colles = data.headersetspec.split(',');
            for (var i = 0; i < colles.length; i++ ) {
                elCollection.push(colles[i]);
            }
        } else {
             elCollection.push(colles);
        }
    }
    ret.collection = elCollection;
// Identificador
    idArray.push({type:"oai", value: data.headeridentifier, preferred:true});
// Tipo de BIC    
    if (data.modsmods_modsmods_genre){
        if(data.modsmods_modsmods_genre.indexOf(",")>-1){
            var colles = data.modsmods_modsmods_genre.split(',');
            for (var i = 0; i < colles.length; i++ ) {
                elType.push(colles[i]);
            }
        } else {
             elType.push(data.modsmods_modsmods_genre);
        }
    }
// Título
    var tmpTitle = "";
    if(data.modsmods_modsmods_titleinfomods_title && typeof data.modsmods_modsmods_titleinfomods_title === 'string') {
        tmpTitle = data.modsmods_modsmods_titleinfomods_title;
        tmpTitle = tmpTitle.replace(new RegExp("´", 'g'),"'");
        tmpTitle = tmpTitle.replace(new RegExp("‘", 'g'),"'");
        tmpTitle = tmpTitle.replace(new RegExp("“", 'g'),'"');
        tmpTitle = tmpTitle.replace(new RegExp("”", 'g'),'"');
        tmpTitle = tmpTitle.replace(new RegExp("`", 'g'),"'");
        elTitle.push({type: "main", value: tmpTitle});
    }  
// Abstracto, descripción
    var fullDescription = "";
    if(data.modsmods_modsmods_abstract && typeof data.modsmods_modsmods_abstract === 'string') {
        fullDescription = data.modsmods_modsmods_abstract;
        fullDescription = fullDescription.replace(new RegExp("´", 'g'),"'");
        fullDescription = fullDescription.replace(new RegExp("‘", 'g'),"'");
        fullDescription = fullDescription.replace(new RegExp("“", 'g'),'"');
        fullDescription = fullDescription.replace(new RegExp("”", 'g'),'"');
        fullDescription = fullDescription.replace(new RegExp("`", 'g'),"'");
        elDescrip.push(fullDescription);
    }  
// Palabras Clave
    if(data.oai_dcoai_dc_dcdc_subject && typeof data.oai_dcoai_dc_dcdc_subject === 'string') {
        var palabras = data.oai_dcoai_dc_dcdc_subject;
        palabras = palabras.replace(new RegExp("´", 'g'),"'");
        palabras = palabras.replace(new RegExp("‘", 'g'),"'");
        palabras = palabras.replace(new RegExp("“", 'g'),'"');
        palabras = palabras.replace(new RegExp("”", 'g'),'"');
        palabras = palabras.replace(new RegExp("`", 'g'),"'");
        if (palabras.indexOf(',') > -1){ //revisando si son palabras clave separadas por ","
            var arrklist = palabras.split(',');
            for(var i = 0; i<arrklist.length; i++){
                if(elkeys.indexOf(arrklist[i])==-1){
                    elkeys.push(arrklist[i]);
                }
            }
        } else {  //es una palabra clave
            if(elkeys.indexOf(palabras)==-1){
                elkeys.push(palabras);
            }
        }
        ret.keywords = elkeys; 
    }
// Creadores
    var dc_creators = data.oai_dcoai_dc_dcdc_creator || undefined;
    if (dc_creators) {
        if (dc_creators.indexOf(',') > -1){ //revisando si son palabras clave separadas por ","
            var arrklist = dc_creators.split(',');
            for(var i = 0; i<arrklist.length; i++){
                elCreator.push(arrklist[i]);
            }
        } else {  //es una palabra clave
            elCreator.push(dc_creators);
        }
    }
// Lenguaje
    if (data.oai_dcoai_dc_dcdc_language) {
        elLang.push(data.oai_dcoai_dc_dcdc_language); 
    }
// Grupo linguistico
    if (data.nota_lengua) {
        elLang2.push(data.nota_lengua); 
    }            
// Lugar. 
    if(data.oai_dcoai_dc_dcdc_coverage){
        ret.lugar = data.oai_dcoai_dc_dcdc_coverage;
    }

    if(data.oai_dcoai_dc_dcdc_lugar){
        if(ret.lugar){
            ret.lugar += ", "+ data.oai_dcoai_dc_dcdc_lugar;
        } else {
            ret.lugar = data.oai_dcoai_dc_dcdc_lugar;
        }
    }
// Generador del BIC        
    var generators = data.oreatom_entryatom_sourceatom_generator || undefined;
    if (generators) {
        if (generators.indexOf(',') > -1){ //revisando si son varios generadores del BIC separados por ","
            var arrklist = generators.split(',');
            for(var i = 0; i<arrklist.length; i++){
                elGenerator.push(arrklist[i]);
            }
        } else {  //un generador del BIC
            elGenerator.push(generators);
        }
    }
//// Fecha
//    var bic_dates = data.fecha || undefined;
//    if (bic_dates) {
//        ret.datecreated = {"format":"","value":bic_dates};
//    }
//// Fecha cronología
//    var timeline_date = data.nota_fecha || undefined;
//    if (timeline_date) {
//        ret.timelinedate = {"format":"","value":timeline_date};
//    }
    
        // Fecha cronología
    var timeline_date = data.nota_fecha || undefined;
    if (timeline_date && timeline_date.trim().length > 0) {
        ret.timelinedate = {"format": "", "value": timeline_date.trim()};
    }

// Fecha
    var bic_dates = data.fecha || undefined;
    if (bic_dates && bic_dates.trim().length > 0 && bic_dates.trim().toLowerCase() !== "no identificada" && bic_dates.trim().toLowerCase() !== "s/f" && bic_dates.trim().toLowerCase() !== "sin fecha") {
        if (timeline_date && timeline_date.trim().length > 0) {
            ret.datecreated = {"format": "", "value": timeline_date.trim(), note: bic_dates.trim()};
        } else {
            ret.datecreated = {"format": "", note: bic_dates.trim()};
        }
    }
    
    
// Rights digital objects
    var derechos = {};
    if(data.derechos){
        rightsTitle = data.derechos;
        derechos.rightstitle = rightsTitle;
    }
    if(data.declaracion_de_uso){
        rights = data.declaracion_de_uso;
        derechos.description = rights;
    }
    if(data.url_declaracion){
        urlLicense = data.url_declaracion;
        derechos.url = urlLicense;
    }
    if(data.media){
        dotype.mime = data.media;
        derechos.media = dotype;
    } else {
        dotype.mime = "";
        derechos.media = dotype;
    }

// Digital Objects
    var digObj = data.digital_object || undefined;
    if (digObj) {
        if(digObj.indexOf(",")>-1){
            var arrklist = digObj.split(',');
            for(var i = 0; i<arrklist.length; i++){
                var liga = arrklist[i];
                if(arrklist[i].length>0){
                    var n = liga.lastIndexOf("/");
                    var filename = liga.substring(n+1);
                    n = filename.lastIndexOf(".");
                    var fileext = filename.substring(n+1);
                    var objDO = {};
                    var objMedia = {};
                    objMedia.mime = fileext;
                    objMedia.name = filename;
                    objDO.mediatype = objMedia;
                    var o_rights = {};
                    o_rights.url = urlLicense;
                    if(rightsTitle.length>0){
                        o_rights.rightstitle = rightsTitle;
                    } 
                    if(rights.length>0){
                        o_rights.description = rights;
                    } 
                    objDO.rights = o_rights;
                    objDO.url = doURL+arrklist[i];
                    dObjs.push(objDO);
                }
            }
        } else {
            if(digObj.length>0){
                var n = digObj.lastIndexOf("/");
                var filename = liga.substring(n+1);
                n = filename.lastIndexOf(".");
                var fileext = filename.substring(n+1);
                var objDO = {};
                var objMedia = {};
                objMedia.mime = fileext;
                objMedia.name = filename;
                objDO.mediatype = objMedia;
                var o_rights = {};
                o_rights.url = urlLicense;
                if(rightsTitle.length>0){
                    o_rights.rightstitle = rightsTitle;
                } 
                if(rights.length>0){
                    o_rights.description = rights;
                } 
                objDO.rights = o_rights;
                objDO.url = doURL+digObj;
                dObjs.push(objDO);
            } else {
                ret.forIndex = false;
            }
        }
    } else {
        ret.forIndex = false;
    }

    // Publisher
    ret.publisher = "";
    if(data.oai_dcoai_dc_dcdc_publisher){
        ret.publisher = data.oai_dcoai_dc_dcdc_publisher;
    }

    // Holder
    if(data.institucion){
        arrHolder.push(data.institucion);
    }

    // Thumbnail
    ret.resourcethumbnail = "";
    if(data.thumbnail){
        //  /storage/inali/thumbnails/620.jpg
        var strthumbnail  = data.thumbnail;
        //sstrthumbnail = strthumbnail.replace("/storage/","");
        ret.resourcethumbnail = doURL + strthumbnail;
    }

    ret.rights = derechos;
    ret.lang = elLang;
    ret.grplang = elLang2;
    ret.digitalObject = dObjs;
    ret.creator = elCreator;
    ret.identifier = idArray;
    ret.oaiid = data.oaiid;
    ret.generator = elGenerator;  // Pertenece a la colección
    ret.recordtitle = elTitle;
    ret.resourcetype = elType;
    if(arrHolder.length===0){
        arrHolder.push("Instituto Nacional de Lenguas Indígenas");
    }
    ret.holder = arrHolder;
    ret.description = elDescrip;
    ret.resourcestats= {"views":0};
    ret.indexcreated = Date.now();
    ret.destacado = false;

    return ret;
}