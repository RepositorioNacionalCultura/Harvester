function (data) {
    /**
     RADIO EDUCACION CSV file Script
     **/
    var doURL = "https://mexicana.cultura.gob.mx/multimedia/radioeducacion/";
    var ret = {};
    var idArray = [];
    var elType = [];
    var elTitle = [];
    var elDescrip = [];
    var elkeys = [];
    var elLang = [];
    var elLang2 = [];
    var dObjs = [];
    var elCollection = [];
    var elCreator = [];
    var elCredit = [];
    var arrHolder = [];
    var elGenerator = [];
    var urlLicense = "";
    var missing = [];
    var rightsTitle = "";
    var rights = "";
    var dotype = {};
    var serie = [];
// Más de la colección
    if (data.serie) {
        if (data.serie.indexOf(",") > -1) {
            var colles = data.serie.split(',');
            for (var i = 0; i < colles.length; i++) {
                var coleccion = colles[i];
                serie.push(coleccion);
                coleccion = coleccion.replace(new RegExp(" ", 'g'), "_");
                elCollection.push(coleccion);
            }
        } else {
            var coleccion = data.serie;
            serie.push(coleccion);
            coleccion = coleccion.replace(new RegExp(" ", 'g'), "_");
            elCollection.push(coleccion);
        }
        ret.serie = serie;
    }
    
    if(data.institucion){
        elCollection.push(data.institucion);
    }
    
    ret.collection = elCollection;
// Identificador
    idArray.push({type: "oai", value: data.oaiid, preferred: true});
// Tipo de BIC  

    if (data.tipo_del_bic) {
        if (data.tipo_del_bic.indexOf(",") > -1) {
            var colles = data.tipo_del_bic.split(',');
            for (var i = 0; i < colles.length; i++) {
                elType.push(colles[i]);
            }
        } else {
            elType.push(data.tipo_del_bic);
        }
    }
// Título
    var tmpTitle = "";
    if (data.titulo && typeof data.titulo === 'string') {
        tmpTitle = data.titulo;
        tmpTitle = tmpTitle.replace(new RegExp("´", 'g'), "'");
        tmpTitle = tmpTitle.replace(new RegExp("‘", 'g'), "'");
        tmpTitle = tmpTitle.replace(new RegExp("“", 'g'), '"');
        tmpTitle = tmpTitle.replace(new RegExp("”", 'g'), '"');
        tmpTitle = tmpTitle.replace(new RegExp("`", 'g'), "'");
        elTitle.push({type: "main", value: tmpTitle});
    }
// Abstracto, descripción
    var fullDescription = "";
    if (data.descripcion && typeof data.descripcion === 'string') {
        fullDescription = data.descripcion;
        fullDescription = fullDescription.replace(new RegExp("´", 'g'), "'");
        fullDescription = fullDescription.replace(new RegExp("‘", 'g'), "'");
        fullDescription = fullDescription.replace(new RegExp("“", 'g'), '"');
        fullDescription = fullDescription.replace(new RegExp("”", 'g'), '"');
        fullDescription = fullDescription.replace(new RegExp("`", 'g'), "'");
        elDescrip.push(fullDescription);
    }
// Palabras Clave
    if (data.palabras_clave && typeof data.palabras_clave === 'string') {
        var palabras = data.palabras_clave;
        palabras = palabras.replace(new RegExp("´", 'g'), "'");
        palabras = palabras.replace(new RegExp("‘", 'g'), "'");
        palabras = palabras.replace(new RegExp("“", 'g'), '"');
        palabras = palabras.replace(new RegExp("”", 'g'), '"');
        palabras = palabras.replace(new RegExp("`", 'g'), "'");
        if (palabras.indexOf(',') > -1) { //revisando si son palabras clave separadas por ","
            var arrklist = palabras.split(',');
            for (var i = 0; i < arrklist.length; i++) {
                if (elkeys.indexOf(arrklist[i]) === -1) {
                    elkeys.push(arrklist[i].trim());
                }
            }
        } else {  //es una palabra clave
            if (elkeys.indexOf(palabras) === -1) {
                elkeys.push(palabras.trim());
            }
        }
        ret.keywords = elkeys;
    }
// Creadores
    var dc_creators = data.creador_del_bic || undefined;
    if (dc_creators) {
        if (dc_creators.indexOf(';') > -1) { //revisando si son palabras clave separadas por ","
            var arrklist = dc_creators.split(';');
            for (var i = 0; i < arrklist.length; i++) {
                elCreator.push(arrklist[i]);
            }
        } else {  //es un creador
            elCreator.push(dc_creators);
        }
        ret.creator = elCreator;
    }

    var dc_credits = data.creditos || undefined;
    if (dc_credits) {

        if (dc_credits.indexOf(';') > -1) { //revisando si son palabras clave separadas por ","
            var arrklist = dc_credits.split(';');
            for (var i = 0; i < arrklist.length; i++) {
                elCredit.push(arrklist[i]);
            }
        } else {  //es un credito
            elCredit.push(dc_credits);
        }
        ret.credits = elCredit;
    }
// Lenguaje
    var lengua = data.lengua || undefined;
    if (lengua && typeof lengua === "string" && lengua.trim().length>0) {
        elLang.push(lengua);
        ret.lang = elLang;
    }
// Grupo linguistico
    if (data.grupo_linguistico) {
        elLang2.push(data.grupo_linguistico);
        ret.grplang = elLang2;
    }
// Lugar
    if (data.lugar) {
        ret.lugar = data.lugar;
    }

// Generador del BIC        
    var generators = data.creador_del_bic || undefined;
    if (generators) {
        if (generators.indexOf(',') > -1) { //revisando si son varios generadores del BIC separados por ","
            var arrklist = generators.split(',');
            for (var i = 0; i < arrklist.length; i++) {
                elGenerator.push(arrklist[i]);
            }
        } else {  //un generador del BIC
            elGenerator.push(generators);
        }
    }
//// Fecha
//    var bic_dates = data.fecha_de_creacion_del_bic || undefined;
//    if (bic_dates) {
//        ret.datecreated = {"format": "", "value": bic_dates};
//    }
//// Fecha cronología
//    var timeline_date = data.nota_de_fecha_del_bic || undefined;
//    if (timeline_date) {
//        ret.timelinedate = {"format": "", "value": timeline_date};
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
    if (data.derechos_sobre_el_bic) {
        rightsTitle = data.derechos_sobre_el_bic;
        derechos.rightstitle = rightsTitle;
    }
    if (data.declaracion_de_uso_sobre_el_objeto_digital_que_representa_el_bic) {
        rights = data.declaracion_de_uso_sobre_el_objeto_digital_que_representa_el_bic;
        derechos.description = rights;
    }
    if (data.declaracion_de_uso_sobre_el_objeto_digital_que_representa_el_bic_url) {
        urlLicense = data.declaracion_de_uso_sobre_el_objeto_digital_que_representa_el_bic_url;
        derechos.url = urlLicense;
    }
    if (data.media) {
        dotype.mime = data.media.toLowerCase();
        derechos.media = dotype;
    } else {
        dotype.mime = "";
        derechos.media = dotype;
    }

// Digital Objects
    var digObj = data.nombre_del_objeto_digital || undefined;
    if (digObj) {
        if (digObj.length > 0) {
            var objDO = {};
            var objMedia = {};
            var strFormato = data.formato;
            strFormato = strFormato.trim();
            if (strFormato.startsWith(".")) {
                strFormato = strFormato.substring(1).toLowerCase();
            }
            objMedia.mime = strFormato;
            objMedia.name = digObj;
            var originalName = data.nombre_del_objeto_digital_original || undefined;
            if(originalName && originalName.trim().length>0){
                objMedia.digitalobjecttitleoriginal = originalName;
            }
            objDO.mediatype = objMedia;
            var o_rights = {};
            o_rights.url = urlLicense;
            if (rightsTitle.length > 0) {
                o_rights.rightstitle = rightsTitle;
            }
            if (rights.length > 0) {
                o_rights.description = rights;
            }
            objDO.rights = o_rights;
            objDO.url = doURL + digObj;
            dObjs.push(objDO);
        } else {
            ret.forIndex = false;
        }
    } else {
        ret.forIndex = false;
    }

    // Publisher
    ret.publisher = "";
    if (data.creador_del_bic) {
        ret.publisher = data.creador_del_bic;
    }

    // Holder
    if (data.institucion) {
        arrHolder.push(data.institucion);
    }
    
    // Holder id
    var holderid = data.id_institucion || undefined;
    if (holderid && typeof holderid === "string" && holderid.trim().length>0) {
        ret.holderid = holderid;
    }

    // Thumbnail
    var thumbnail = data.thumbnail || undefined;
    ret.resourcethumbnail = "";
    if (thumbnail && typeof thumbnail === "string" && thumbnail.trim().length>0) {
        ret.resourcethumbnail = thumbnail;
    }
    
    //thumbnail cronologia
    var timelinethumbnail = data.cronologia || undefined;
    ret.timelinethumbnail = "";
    if (timelinethumbnail && typeof timelinethumbnail === "string" && timelinethumbnail.trim().length>0) {
        ret.timelinethumbnail = timelinethumbnail;
    }

    if (data.dimension && typeof data.dimension === 'string') {
        ret.dimension = "";
        var mydim = data.dimension;
        if (mydim.indexOf(" - ") > -1) { //revisando si son minutos y segundos separados por "-"
            var arrklist = mydim.split(" - ");
            for (var i = 0; i < arrklist.length; i++) {
                ret.dimension += arrklist[i];
                if ((i + 1) < arrklist.length)
                    ret.dimension += ":";
            }
        }

        if (data.unidad && typeof data.unidad === "string") {
            ret.dimension += " "
            var myunit = data.unidad;
            if (mydim.indexOf(" - ") > -1) { //revisando si son minutos y segundos separados por "-"
                var arrklist = myunit.split(" - ");
                for (var i = 0; i < arrklist.length; i++) {
                    ret.dimension += arrklist[i];
                    if ((i + 1) < arrklist.length)
                        ret.dimension += " ";
                }
            }
        }

    }
    
    
    // validar id tipo del bic
    var bictypeid = data.id_tipo_del_bic || undefined;
    if(bictypeid && typeof bictypeid === "string" && bictypeid.trim().length>0){
       ret.bictypeid = bictypeid; 
    }
    
//    // validar tipo del bic
//    var bictype = data.tipo_del_bic || undefined;
//    if(bictype && typeof bictype === "string" && bictype.trim().length>0){
//       ret.bictype = bictype; 
//    }
    
    
    // validar tipo de identificador id
    var identifiertypeid = data.id_tipo_de_identificador || undefined;
    if(identifiertypeid && typeof identifiertypeid === "string" && identifiertypeid.trim().length>0){
       ret.identifiertypeid = identifiertypeid; 
    }
    
    
    
    // validar tipo de identificador
    var identifiertype = data.tipo_de_identificador || undefined;
    if(identifiertype && typeof identifiertype === "string" && identifiertype.trim().length>0){
       ret.identifiertype = identifiertype; 
    }
    
    // validar id unidad
    var unidadid = data.id_unidad || undefined;
    if(unidadid && typeof unidadid === "string" && unidadid.trim().length>0){
       ret.unidadid = unidadid; 
    }
    
    // validar tipo unidad
    var unidadtype = data.tipo_unidad || undefined;
    if(unidadtype && typeof unidadtype === "string" && unidadtype.trim().length>0){
       ret.unidadtype = unidadtype; 
    }
    
    // validar id tipo dimension
    var dimensiontypeid = data.id_tipo_de_dimension || undefined;
    if(dimensiontypeid && typeof dimensiontypeid === "string" && dimensiontypeid.trim().length>0){
       ret.dimensionid = dimensiontypeid; 
    }
    
    // validar tipo dimension
    var dimensiontype = data.tipo_de_dimension || undefined;
    if(dimensiontype && typeof dimensiontype === "string" && dimensiontype.trim().length>0){
       ret.dimensiontype = dimensiontype; 
    }
    
    // validar capítulo
    var chapter = data.capitulo || undefined;
    if(chapter && typeof chapter === "string" && chapter.trim().length>0){
       ret.chapter = chapter; 
    } 
    //validar destacados
    var destacado = data.destacados || undefined;
    if(destacado && typeof destacado === "string" && destacado.trim().length>0){
       ret.destacado = true; 
    } else {
       ret.destacado = false;
    }
    // validar formatos disponibles
    var availableformats = data.formatos_disponibles || undefined;
    if(availableformats && typeof availableformats === "string" && availableformats.trim().length>0){
       ret.availableformats = availableformats; 
    } 
    
    
    // validar id media
    var mediaid = data.id_media || undefined;
    if(mediaid && typeof mediaid === "string" && mediaid.trim().length>0){
       ret.mediaid = mediaid; 
    }
    
    // validar id formato
    var formatid = data.id_formato || undefined;
    if(formatid && typeof formatid === "string" && formatid.trim().length>0){
       ret.formatid = formatid; 
    }
    
    ret.rights = derechos;
    ret.digitalObject = dObjs;
    ret.identifier = idArray;
    ret.oaiid = data.oaiid;
    ret.generator = elGenerator;  // Pertenece a la colección
    ret.recordtitle = elTitle;
    ret.resourcetype = elType;
    if (arrHolder.length === 0) {
        arrHolder.push("Radio Educación");
    }
    ret.holder = arrHolder;
    ret.description = elDescrip;
    ret.resourcestats = {"views": 0};
    ret.indexcreated = Date.now();
    

    return ret;
}