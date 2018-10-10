function (data) {
    /**
     INEHRM INSTITUTO NACIONAL DE ESTUDIOS HISTÓRICOS DE LAS REVOLUCIONES DE MÉXICO CSV file Script
     **/
    var doURL = "/multimedia/inehrm/";
    var paththumbnail = doURL + "thumbnail/";
    var pathtimelineth = doURL + "cronologia/";
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
    var elCreatorNote = [];
    var elCreatorGroup = [];
    var elCredit = [];
    var arrHolder = [];
    var elGenerator = [];
    var urlLicense = "";
    var missing = [];
    var rightsTitle = "";
    var rights = "";
    var dotype = {};
    var reccollection = [];
// Más de la colección


    var mascoleccion = data.coleccion || undefined;

    if (mascoleccion && mascoleccion.trim().length > 0) {
        if (mascoleccion.indexOf(",") > -1) {
            var colles = mascoleccion.split(',');
            for (var i = 0; i < colles.length; i++) {
                var coleccion = colles[i];
                reccollection.push(coleccion);
                coleccion = coleccion.replace(new RegExp(" ", 'g'), "_");
                elCollection.push(coleccion);
            }
        } else {
            var coleccion = data.coleccion;
            reccollection.push(coleccion);
            coleccion = coleccion.replace(new RegExp(" ", 'g'), "_");
            elCollection.push(coleccion);
        }
        ret.reccollection = reccollection;
    }

    if (elCollection.length === 0 && data.institucion) {
        elCollection.push(data.institucion);
    }
    ret.collection = elCollection;
// Identificador
    idArray.push({type: "oai", value: data.oaiid, preferred: true});
// Tipo de BIC  

//    if (data.media && typeof data.media === 'string') {
//        elType.push(data.media);
//    }
    
    if (data.tipo_del_bic) {
        if (data.tipo_del_bic.indexOf(",") > -1) {
            var colles = data.tipo_del_bic.split(',');
            for (var i = 0; i < colles.length; i++) {
                var tmptipo = colles[i];
                if (null !== tmptipo && tmptipo.trim().length > 0) {
                    tmptipo = tmptipo.trim();
                    tmptipo = tmptipo.substring(0, 1).toUpperCase() + tmptipo.substring(1).toLowerCase();
                    elType.push(tmptipo);
                }
            }
        } else {
            var tmptipo = data.tipo_del_bic;
                if (null !== tmptipo && tmptipo.trim().length > 0) {
                    tmptipo = tmptipo.trim();
                    tmptipo = tmptipo.substring(0, 1).toUpperCase() + tmptipo.substring(1).toLowerCase();
                    elType.push(tmptipo);
                }
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
    var dc_creatorsName = data.creador_del_bic_nombre || undefined;
    var dc_creatorsLast = data.creador_del_bic_apellido || undefined;
    if (dc_creatorsName && dc_creatorsLast) {
        if (dc_creatorsName.indexOf(';') > -1 && dc_creatorsLast.indexOf(';') > -1) { //revisando si son palabras clave separadas por ","
            var arrklistName = dc_creatorsName.split(';');
            var arrklistLast = dc_creatorsLast.split(';');
            if (arrklistName.length === arrklistLast.length) {
                for (var i = 0; i < arrklistName.length; i++) {
                    var fullname = arrklistName[i].trim();
                    if (arrklistLast[i].trim().length > 0) {
                        fullname += " " + arrklistLast[i].trim();
                    }
                    elCreator.push(fullname);
                }
            } else {
                for (var i = 0; i < arrklistName.length; i++) {
                    elCreator.push(arrklistName[i]);
                }
            }

        } else {  //es un creador

            var fullname = "";
            if (dc_creatorsName && dc_creatorsLast) {
                fullname = dc_creatorsName.trim() + " " + dc_creatorsLast;
            } else if (dc_creatorsName && !dc_creatorsLast) {
                fullname = dc_creatorsName.trim();
            } else if (!dc_creatorsName && dc_creatorsLast) {
                fullname = dc_creatorsLast.trim();
            }
            elCreator.push(fullname);
        }
        ret.creator = elCreator;
    } else {  //es un creador

        var fullname = "";
        if (dc_creatorsName && !dc_creatorsLast) {
            fullname = dc_creatorsName.trim();
        } else if (!dc_creatorsName && dc_creatorsLast) {
            fullname = dc_creatorsLast.trim();
        }
        elCreator.push(fullname);
        ret.creator = elCreator;
    }


    // nota del creador
    var creatornote = data.nota_creador_del_bic || undefined;
    if (creatornote) {

        if (creatornote.indexOf(';') > -1) { //revisando si son palabras clave separadas por ","
            var arrklist = creatornote.split(';');
            for (var i = 0; i < arrklist.length; i++) {
                elCreatorNote.push(arrklist[i]);
            }
        } else {  //es una nota
            elCreatorNote.push(creatornote);
        }
        ret.creatornote = elCreatorNote;
    }

    // grupo del creador del bic ﻿
    var creatorgroup = data.grupo_ceador_del_bic || undefined;
    if (creatorgroup) {

        if (creatorgroup.indexOf(';') > -1) { //revisando si son palabras clave separadas por ","
            var arrklist = creatorgroup.split(';');
            for (var i = 0; i < arrklist.length; i++) {
                elCreatorGroup.push(arrklist[i]);
            }
        } else {  //es una nota
            elCreatorGroup.push(creatorgroup);
        }
        ret.creatorgroup = elCreatorGroup;
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
    var lengua = data.lengua || undefined;
    if (lengua && typeof lengua === "string" && lengua.trim().length > 0) {
        elLang.push(lengua);
        ret.lang = elLang;
    }
//// Grupo linguistico
//    if (data.grupo_linguistico) {
//        elLang2.push(data.grupo_linguistico);
//        ret.grplang = elLang2;
//    }
// Lugar
    if (data.lugar) {
        ret.lugar = data.lugar;
    }

    // Nota lugar
    if (data.nota_lugar) {
        ret.lugar += ", " + data.nota_lugar;
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

//    // Fecha cronología
//    var timeline_date = data.nota_fecha || undefined;
//    if (timeline_date && timeline_date.trim().length > 0 ) {
//        timeline_date = timeline_date.trim();
//        ret.timelinedate = {"format": "", "value": timeline_date};
//    } 
//// Fecha
//    var bic_dates = data.fecha || undefined;
//    if (bic_dates && bic_dates.trim().length > 0 ) {
//        
//        ret.datecreated = {"format": "",  "note": bic_dates.trim()};
//        if(timeline_date && timeline_date.trim().length > 0){
//            ret.datecreated = {"format": "", "value": timeline_date.trim(), "note": bic_dates.trim()};
//        } else {
//            ret.datecreated = {"format": "",  "note": bic_dates.trim()};
//        }
//    }

    // Fecha cronología
    var timeline_date = data.nota_fecha || undefined;
    if (timeline_date && timeline_date.trim().length > 0) {
        ret.timelinedate = {"format": "", "value": timeline_date.trim()};
    }

// Fecha
    var bic_dates = data.fecha_de_creacion_del_bic || undefined;
    if (bic_dates && bic_dates.trim().length > 0 && bic_dates.trim().toLowerCase() !== "no identificada" && bic_dates.trim().toLowerCase() !== "s/f" && bic_dates.trim().toLowerCase() !== "sin fecha") {
        if (timeline_date && timeline_date.trim().length > 0) {
            ret.datecreated = {"format": "", "value": timeline_date.trim(), note: bic_dates.trim()};
        } else {
            ret.datecreated = {"format": "", note: bic_dates.trim()};
        }
    }

//Rangos de fecha
    var datestart = {};
    var dateend = {};
    var fechaIni = data.rango_inicial || undefined;
    var fechaFin = data.rango_final || undefined;
    if (fechaIni && fechaFin) {
        datestart = {"format": "", "value": fechaIni.trim()};
        dateend = {"format": "", "value": fechaFin.trim()};
        ret.periodcreated = {"datestart": datestart, "dateend": dateend};
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
        //dotype.mime = data.media.toLowerCase();
        dotype.name = data.media.toLowerCase();
        derechos.media = dotype;
    } else {
        //dotype.mime = "";
        dotype.name = "";
        derechos.media = dotype;
    }

// Digital Objects
    var digObj = data.nombre_del_objeto_digital || undefined;
    if (digObj) {
        if (digObj.trim().length > 0) {
            var objDO = {};
            var objMedia = {};

            if (strFormato) {

                objMedia.mime = strFormato;
            }
            objMedia.name = digObj;
            var originalName = data.nombre_del_objeto_digital_original || undefined;
            if (originalName && originalName.trim().length > 0) {
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
            if (digObj.startsWith("https://")|| digObj.startsWith("http://")) {
                objDO.url = digObj.trim();
            } else {
                objDO.url = doURL + digObj;  // 
            }
            dObjs.push(objDO);
        } else {
            ret.forIndex = false;
        }
    } else {
        ret.forIndex = false;
    }

    //validando id_formato
    var formatoid = data.id_formato || undefined;
    if (formatoid && typeof formatoid === "string" && formatoid.trim().length > 0) {
        ret.formatid = formatoid;
    }


    // Holder
    if (data.institucion) {
        arrHolder.push(data.institucion);
    }

    // Holder id
    var holderid = data.id_institucion || undefined;
    if (holderid && typeof holderid === "string" && holderid.trim().length > 0) {
        ret.holderid = holderid;
    }

    // Thumbnail
    var thumbnail = data.thumbnail || undefined;
    ret.resourcethumbnail = "";
    if (thumbnail && typeof thumbnail === "string" && thumbnail.trim().length > 0) {
        ret.resourcethumbnail = paththumbnail + thumbnail;
    }

    //thumbnail cronologia
    var timelinethumbnail = data.cronologia || undefined;
    ret.timelinethumbnail = "";
    if (timelinethumbnail && typeof timelinethumbnail === "string" && timelinethumbnail.trim().length > 0) {
        ret.timelinethumbnail = pathtimelineth + timelinethumbnail;
    }


if (data.dimension && typeof data.dimension === 'string') {
        ret.dimension = "";
        var mydim = data.dimension;
        if (mydim.indexOf(" - ") > -1) { //revisando si son minutos y segundos separados por "-"
            var arrklist = mydim.split(" - ");
            var arrunits;
            var usize = -1;
            if (data.unidad && typeof data.unidad === "string") {
                var myunit = data.unidad;
                if (myunit.indexOf(" - ") > -1) { //revisando si son minutos y segundos separados por "-"
                    arrunits = myunit.split(" - ");
                    usize = arrunits.length;
                }
            }
            for (var i = 0; i < arrklist.length; i++) {
                ret.dimension += arrklist[i];
                if (usize > -1 && usize === arrklist.length) {
                    ret.dimension += " " + arrunits[i] + " ";
                }
            }
        }
    }

//    if (data.dimension && typeof data.dimension === 'string') {
//        ret.dimension = "";
//        var mydim = data.dimension;
//        if (mydim.indexOf(" - ") > -1) { //revisando si son minutos y segundos separados por "-"
//            var arrklist = mydim.split(" - ");
//            for (var i = 0; i < arrklist.length; i++) {
//                ret.dimension += arrklist[i];
//                if ((i + 1) < arrklist.length)
//                    ret.dimension += ":";
//            }
//        } else {
//            ret.dimension = mydim;
//        }
//
//        if (data.unidad && typeof data.unidad === "string") {
//            ret.dimension += " ";
//            var myunit = data.unidad;
//            if (mydim.indexOf(" - ") > -1) { //revisando si son minutos y segundos separados por "-"
//                var arrklist = myunit.split(" - ");
//                for (var i = 0; i < arrklist.length; i++) {
//                    ret.dimension += arrklist[i];
//                    if ((i + 1) < arrklist.length)
//                        ret.dimension += " ";
//                }
//            } else {
//                ret.dimension += " " + myunit;
//            }
//        }
//
//    }
    // validar id tipo del bic
    var bictypeid = data.id_tipo_del_bic || undefined;
    if (bictypeid && typeof bictypeid === "string" && bictypeid.trim().length > 0) {
        ret.bictypeid = bictypeid;
    }

    // validar tipo del bic
    var bictype = data.tipo_del_bic || undefined;
    if (bictype && typeof bictype === "string" && bictype.trim().length > 0) {
        ret.bictype = bictype;
    }

    // validar tipo de identificador id
    var identifiertypeid = data.id_tipo_de_identificador || undefined;
    if (identifiertypeid && typeof identifiertypeid === "string" && identifiertypeid.trim().length > 0) {
        ret.identifiertypeid = identifiertypeid;
    }

    // validar tipo de identificador
    var identifiertype = data.tipo_de_identificador || undefined;
    if (identifiertype && typeof identifiertype === "string" && identifiertype.trim().length > 0) {
        ret.identifiertype = identifiertype;
    }

    // validar id unidad
    var unidadid = data.id_unidad || undefined;
    if (unidadid && typeof unidadid === "string" && unidadid.trim().length > 0) {
        ret.unidadid = unidadid;
    }

    // validar tipo unidad
    var unidadtype = data.tipo_de_unidad || undefined;
    if (unidadtype && typeof unidadtype === "string" && unidadtype.trim().length > 0) {
        ret.unidadtype = unidadtype;
    }

    // validar id tipo dimension
    var dimensiontypeid = data.id_tipo_de_dimension || undefined;
    if (dimensiontypeid && typeof dimensiontypeid === "string" && dimensiontypeid.trim().length > 0) {
        ret.dimensionid = dimensiontypeid;
    }

    // validar tipo dimension
    var dimensiontype = data.tipo_de_dimension || undefined;
    if (dimensiontype && typeof dimensiontype === "string" && dimensiontype.trim().length > 0) {
        ret.dimensiontype = dimensiontype;
    }

    // validar director
    var director = data.director || undefined;
    if (director && typeof director === "string" && director.trim().length > 0) {
        ret.director = director;
    }

    // validar productor
    var producer = data.productor || undefined;
    if (producer && typeof producer === "string" && producer.trim().length > 0) {
        ret.producer = producer;
    }

    // validar guion
    var screenplay = data.guion || undefined;
    if (screenplay && typeof screenplay === "string" && screenplay.trim().length > 0) {
        ret.screenplay = screenplay;
    }

    // validar reparto
    var reparto = data.reparto || undefined;
    if (reparto && typeof reparto === "string" && reparto.trim().length > 0) {
        ret.distribution = reparto;
    }

    //validar destacado
    var destacado = data.destacado || undefined;
    if (destacado && typeof destacado === "string" && destacado.trim().length > 0) {
        ret.important = destacado;
    } else {
        ret.important = 0;
    }

    // validar id media
    var mediaid = data.id_media || undefined;
    if (mediaid && typeof mediaid === "string" && mediaid.trim().length > 0) {
        ret.mediaid = mediaid;
    }

    // validar invitado
    var invitado = data.invitado || undefined;
    if (invitado && typeof invitado === "string" && invitado.trim().length > 0) {
        ret.invited = invitado;
    }

    // validar tema
    var tema = data.tema || undefined;
    if (tema && typeof tema === "string" && tema.trim().length > 0) {
        ret.theme = tema;
    }

    // validar sinopsis
    var sinopsis = data.sinopsis || undefined;
    if (sinopsis && typeof sinopsis === "string" && sinopsis.trim().length > 0) {
        ret.synopsis = sinopsis;
    }

    // validar liga al programa
    var liga_prog = data.liga_al_programa || undefined;
    if (liga_prog && typeof liga_prog === "string" && liga_prog.trim().length > 0) {
        ret.programurl = liga_prog;
    }
    // validar id_fondo
    var fundid = data.id_fondo || undefined;
    if (fundid && typeof fundid === "string" && fundid.trim().length > 0) {
        ret.fundid = fundid;
    }
    // validar id_productor
    var producerid = data.id_productor || undefined;
    if (producerid && typeof producerid === "string" && producerid.trim().length > 0) {
        ret.producerid = producerid;
    }
    // validar folio
    var folio = data.folio || undefined;
    if (folio && typeof folio === "string" && folio.trim().length > 0) {
        ret.folio = folio;
    }

    // validar id_soporte
    var supportid = data.id_soporte || undefined;
    if (supportid && typeof supportid === "string" && supportid.trim().length > 0) {
        ret.supportid = supportid;
    }

    // validar id_color
    var colorid = data.id_color || undefined;
    if (colorid && typeof colorid === "string" && colorid.trim().length > 0) {
        ret.colorid = colorid;
    }

    // validar estado de conservacion
    var conservationstate = data.edo_conservacion || undefined;
    if (conservationstate && typeof conservationstate === "string" && conservationstate.trim().length > 0) {
        ret.conservationstate = conservationstate;
    }

    // validar técnica
    var technique = data.tecnica || undefined;
    if (technique && typeof technique === "string" && technique.trim().length > 0) {
        ret.technique = technique;
    }

    // validar personajes
    var characters = data.personajes || undefined;
    if (characters && typeof characters === "string" && characters.trim().length > 0) {
        ret.characters = characters;
    }

    // validar observaciones
    var observations = data.observaciones || undefined;
    if (observations && typeof observations === "string" && observations.trim().length > 0) {
        ret.observations = observations;
    }

    // validar etiquetas
    var labels = data.etiquetas || undefined;
    if (labels && typeof labels === "string" && labels.trim().length > 0) {
        ret.labels = labels;
    }

    // validar id_usuario
    var userid = data.id_usuario || undefined;
    if (userid && typeof userid === "string" && userid.trim().length > 0) {
        ret.userid = userid;
    }

    // validar sobre
    var no_sobre = data.no_sobre || undefined;
    if (no_sobre && typeof no_sobre === "string" && no_sobre.trim().length > 0) {
        ret.no_sobre = no_sobre;
    }

    // validar catálogo
    var catalog = data.catalogo || undefined;
    if (catalog && typeof catalog === "string" && catalog.trim().length > 0) {
        ret.catalog = catalog;
    }

    // Fecha subida
    var dateupload = data.fecha_de_subida || undefined;
    if (dateupload && dateupload.trim().length > 0) {

        ret.dateupload = {"format": "", "value": dateupload.trim()};
    }

    // validar ruta
    var path = data.ruta || undefined;
    if (path && typeof path === "string" && path.trim().length > 0) {
        ret.path = path;
    }

    ret.rights = derechos;
    ret.digitalObject = dObjs;
    ret.identifier = idArray;
    ret.oaiid = data.oaiid;
    ret.generator = elGenerator;  // Pertenece a la colección
    ret.recordtitle = elTitle;
    ret.resourcetype = elType;
    if (arrHolder.length === 0) {
        arrHolder.push("Instituto Nacional de Estudios Históricos de las Revoluciones de México");
    }
    ret.holder = arrHolder;
    ret.description = elDescrip;
    ret.resourcestats = {"views": 0};
    ret.indexcreated = Date.now();


    return ret;
}