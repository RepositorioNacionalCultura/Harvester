function (data) {
    /**
     FOTOTECA - Instituto Nacional de Antropología e Historia  CSV file Script
     **/
    var doURL = "http://35.193.209.163/multimedia/mediatecamedia/";
    var mediapath = "/storage/MULTIMEDIA/mediatecamedia/";
    var ret = {};
    var idArray = [];
    var elType = [];
    var elTitle = [];
    var elDescrip = [];
    var elkeys = [];
    var elLang = [];
    var dObjs = [];
    var elCollection = [];
    var elCreator = [];
    var elCredit = [];
    var arrHolder = [];
    var elGenerator = [];
    var urlLicense = "";
    var rightsTitle = "";
    var rights = "";
    var dotype = {};
//    var reccollection = [];
// Más de la colección


    var mascoleccion = data.setspec || undefined;

    if (mascoleccion && mascoleccion.trim().length > 0) {
        if (mascoleccion.indexOf(",") > -1) {
            var colles = mascoleccion.split(',');
            for (var i = 0; i < colles.length; i++) {
                var coleccion = colles[i];
                //reccollection.push(coleccion);
                coleccion = coleccion.replace(new RegExp(" ", 'g'), "_");
                elCollection.push(coleccion);
            }
        } else {
            var coleccion = data.setspec;
            //reccollection.push(coleccion);
            coleccion = coleccion.replace(new RegExp(" ", 'g'), "_");
            elCollection.push(coleccion);
        }
        //ret.reccollection = reccollection;
    }

    if (elCollection.length === 0 && data.institucion) {
        elCollection.push(data.institucion);
    }
    if(data.institucion && data.institucion.trim().length>0){
        elCollection.push(data.institucion.trim());
    }
    ret.collection = elCollection;

// Identificador
    idArray.push({type: "oai", value: data.oaiid, preferred: true});
// Tipo de BIC  

    if (data.media && typeof data.media === 'string') {
        elType.push(data.media);
    }

    var tipoBic = data.tipo || undefined;
    if (tipoBic) {
        if (tipoBic.trim().length > 0 && tipoBic.indexOf(",") > -1) {
            var colles = tipoBic.split(',');
            for (var i = 0; i < colles.length; i++) {
                elType.push(colles[i]);
            }
        } else {
            elType.push(tipoBic);
        }
    }

// Título
    var tmpTitle = "";
    if (data.titulo_del_bic && typeof data.titulo_del_bic === 'string') {
        tmpTitle = data.titulo_del_bic;
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
        if (palabras.indexOf(';') > -1) { //revisando si son palabras clave separadas por ","
            var arrklist = palabras.split(';');
            for (var i = 0; i < arrklist.length; i++) {
                if (elkeys.indexOf(arrklist[i]) === -1 && arrklist[i].trim().length>0) {
                    elkeys.push(arrklist[i].trim());
                }
            }
        } else {  //es una palabra clave
            if (elkeys.indexOf(palabras.trim()) === -1) {
                elkeys.push(palabras.trim());
            }
        }
        ret.keywords = elkeys;
    }
// Creadores
    var dc_creatorsName = data.creador || undefined;

    if (dc_creatorsName) {
        if (dc_creatorsName.indexOf(';') > -1) { //revisando si son palabras clave separadas por ","
            var arrklistName = dc_creatorsName.split(';');
            for (var i = 0; i < arrklistName.length; i++) {
                elCreator.push(arrklistName[i]);
            }
        } else {  //es un creador
            var fullname = "";
            if (dc_creatorsName) {
                fullname = dc_creatorsName.trim();
            }
            elCreator.push(fullname);
        }
        ret.creator = elCreator;
    }

    // créditos
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
    var lengua = data.lenguaje || undefined;
    if (lengua && typeof lengua === "string" && lengua.trim().length > 0) {
        elLang.push(lengua);
        ret.lang = elLang;
    }

    // Estado
    if (data.estado) {
        ret.lugar = data.estado;
    }

    // Nota lugar
    if (data.nota_lugar) {
        ret.lugar += ", " + data.nota_lugar;
    }

    // País
    if (data.pais) {
        ret.lugar += ", " + data.pais;
    }

    // Fecha cronología
    var timeline_date = data.nota_fecha || undefined;
    if (timeline_date && timeline_date.trim().length > 0 && !isNaN(timeline_date.trim())) {
        ret.timelinedate = {"format": "", "value": timeline_date.trim()};
    }

// Fecha
    var bic_dates = data.fecha || undefined;
    if (bic_dates && bic_dates.trim().length > 0 && bic_dates.trim().toLowerCase() !== "no identificada" && bic_dates.trim().toLowerCase() !== "s/f" && bic_dates.trim().toLowerCase() !== "sin fecha") {
        if (timeline_date && timeline_date.trim().length > 0  && !isNaN(timeline_date.trim())) {
            ret.datecreated = {"format": "", "value": timeline_date.trim(), note: bic_dates.trim()};
        } else {
            ret.datecreated = {"format": "", note: bic_dates.trim()};
        }
    }

// Rights digital objects
    var derechos = {};
    if (data.derechos) {
        rightsTitle = data.derechos;
        derechos.rightstitle = rightsTitle;
    }
    if (data.declaracion_uso) {
        rights = data.declaracion_uso;
        derechos.description = rights;
    }
    if (data.url_declaracion_uso) {
        urlLicense = data.url_declaracion_uso;
        derechos.url = urlLicense;
    } else {
        urlLicense = rights;
        derechos.url = urlLicense;
    }
    var strFormato = data.formato || undefined;
    if (strFormato) {
        strFormato = strFormato.trim();
        if (strFormato.startsWith(".")) {
            strFormato = strFormato.substring(1).toLowerCase();
        }
        dotype.mime = strFormato;
    }
    if (data.media) {
        dotype.name = data.media.toLowerCase();
        derechos.media = dotype;
    } else {
        dotype.name = "";
        derechos.media = dotype;
    }

    // Digital Objects
    var digObj = data.objeto || undefined;
    if (digObj) {
        if (digObj.indexOf(",") > -1) {
            var arrklist = digObj.split(',');
            for (var i = 0; i < arrklist.length; i++) {
                var liga = arrklist[i];
                if (liga.length > 0) {
                    if (liga.indexOf(mediapath) > -1) {
                        liga = liga.substring(liga.indexOf(mediapath) + mediapath.length);
                    }
                    var n = liga.lastIndexOf("/");
                    var filename = liga.substring(n + 1);
                    if (filename && filename.length > 0) {
                        var objDO = {};
                        var objMedia = {};
                        if (strFormato) {
                            objMedia.mime = strFormato;
                        }
                        objMedia.name = filename;
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
                        objDO.url = doURL + liga;
                        dObjs.push(objDO);
                    } else {
                        ret.forIndex = false;
                    }
                }
            }
        } else {
            if (digObj.length > 0) {
                if (digObj.indexOf(mediapath) > -1) {
                    digObj = digObj.substring(digObj.indexOf(mediapath) + mediapath.length);
                }
                var n = digObj.lastIndexOf("/");
                var filename = digObj.substring(n + 1);
                if (filename && filename.length > 0) {
                    var objDO = {};
                    var objMedia = {};
                    if (strFormato) {
                        objMedia.mime = strFormato;
                    }
                    objMedia.name = filename;
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
        }
    } else {
        ret.forIndex = false;
    }

    //validando id_formato
//    var formatoid = data.id_formato || undefined;
//    if (formatoid && typeof formatoid === "string" && formatoid.trim().length > 0) {
//        ret.formatid = formatoid;
//    }

    // Holder
    if (data.institucion) {
        arrHolder.push(data.institucion);
    }

    var holdernote = data.nota_institucion || undefined;
    if (holdernote && typeof holdernote === "string" && holdernote.trim().length > 0) {
        ret.holdernote = holdernote;
    }

    // Thumbnail
    var thumbnail = data.thumbnail || undefined;
    ret.resourcethumbnail = "";
    if (thumbnail && typeof thumbnail === "string" && thumbnail.trim().length > 0) {
        if (thumbnail.indexOf(mediapath) > -1) {
            thumbnail = thumbnail.substring(thumbnail.indexOf(mediapath) + mediapath.length);
        }
        var n = thumbnail.lastIndexOf("/");
        var filename = digObj.substring(n + 1);
        if (filename && filename.length > 0) {
            ret.resourcethumbnail = doURL + thumbnail;
        }
    }

    //thumbnail cronologia
//    var timelinethumbnail = data.cronologia || undefined;
//    ret.timelinethumbnail = "";
//    if (timelinethumbnail && typeof timelinethumbnail === "string" && timelinethumbnail.trim().length > 0) {
//        ret.timelinethumbnail = pathtimelineth + timelinethumbnail;
//    }

    if (data.dimension && typeof data.dimension === 'string') {
        ret.dimension = data.dimension;
    }


    // validar materisl
    var material = data.material || undefined;
    if (material && typeof material === "string" && material.trim().length > 0) {
        ret.material = material;
    }

    //validar destacados
    var destacado = data.destacados || undefined;
    if (destacado && typeof destacado === "string" && destacado.trim().length > 0) {
        ret.destacado = true;
    } else {
        ret.destacado = false;
    }

    // validar técnica
    var technique = data.tecnica || undefined;
    if (technique && typeof technique === "string" && technique.trim().length > 0) {
        ret.technique = technique;
    }


    ret.rights = derechos;
    ret.digitalObject = dObjs;
    ret.identifier = idArray;
    ret.oaiid = data.oaiid;
    ret.generator = elGenerator;  // Pertenece a la colección
    ret.recordtitle = elTitle;
    ret.resourcetype = elType;
    if (arrHolder.length === 0) {
        arrHolder.push("Instituto Nacional de Antropología e Historia");
    }
    ret.holder = arrHolder;
    ret.description = elDescrip;
    ret.resourcestats = {"views": 0};
    ret.indexcreated = Date.now();


    return ret;
}