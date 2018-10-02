function (data) {
    /**
     Museo Nacional de Culturas Populares file Script
     **/
    var doURL = "https://museoculturaspopulares.gob.mx/img/coleccion/";
    var paththumbnail = doURL + "thumbs/";
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
    var serie = [];

    var dcData = data.oai_dc.objeto || undefined;

    if (dcData) {
        // Más de la colección
        if (dcData.infoGenColeccMuseo) {
            if (dcData.infoGenColeccMuseo.indexOf(",") > -1) {
                var colles = dcData.infoGenColeccMuseo.split(',');
                for (var i = 0; i < colles.length; i++) {
                    var coleccion = colles[i];
                    reccollection.push(coleccion);
                    coleccion = coleccion.replace(new RegExp(" ", 'g'), "_");
                    elCollection.push(coleccion);
                }
            } else {
                var coleccion = dcData.infoGenColeccMuseo;
                reccollection.push(coleccion);
                coleccion = coleccion.replace(new RegExp(" ", 'g'), "_");
                elCollection.push(coleccion);
            }
            ret.reccollection = reccollection;
        }
        if (dcData.infoGenInstitucion && dcData.infoGenInstitucion.trim().length > 0) {
            elCollection.push(dcData.infoGenInstitucion.trim());
            arrHolder.push(dcData.infoGenInstitucion);
        }
        ret.collection = elCollection;
// Identificador
        idArray.push({type: "oai", value: data.oaiid, preferred: true});

        if (dcData.infoGenTipoDeObj) {
            if (dcData.infoGenTipoDeObj.indexOf(",") > -1) {
                var colles = dcData.infoGenTipoDeObj.split(',');
                for (var i = 0; i < colles.length; i++) {
                    elType.push(colles[i]);
                }
            } else {
                elType.push(dcData.infoGenTipoDeObj);
            }
        }
// Título
        var tmpTitle = "";
        if (dcData.infoGenNomOTema && typeof dcData.infoGenNomOTema === 'string') {
            tmpTitle = dcData.infoGenNomOTema;
            tmpTitle = tmpTitle.replace(new RegExp("´", 'g'), "'");
            tmpTitle = tmpTitle.replace(new RegExp("‘", 'g'), "'");
            tmpTitle = tmpTitle.replace(new RegExp("“", 'g'), '"');
            tmpTitle = tmpTitle.replace(new RegExp("”", 'g'), '"');
            tmpTitle = tmpTitle.replace(new RegExp("`", 'g'), "'");
            elTitle.push({type: "main", value: tmpTitle});
        }
// Abstracto, descripción
        var fullDescription = "";
        if (dcData.descripcion && typeof dcData.descripcion === 'string') {
            fullDescription = dcData.descripcion;
            fullDescription = fullDescription.replace(new RegExp("´", 'g'), "'");
            fullDescription = fullDescription.replace(new RegExp("‘", 'g'), "'");
            fullDescription = fullDescription.replace(new RegExp("“", 'g'), '"');
            fullDescription = fullDescription.replace(new RegExp("”", 'g'), '"');
            fullDescription = fullDescription.replace(new RegExp("`", 'g'), "'");
            elDescrip.push(fullDescription);
        }
// Palabras Clave
        if (dcData.palabras_clave && typeof dcData.palabras_clave === 'string') {
            var palabras = dcData.palabras_clave;
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
        var dc_creatorsName = dcData.infoGenNombre || undefined;
        var dc_creatorsLast = dcData.infoGenApellidoPaterno || undefined;
        var dc_creators2Last = dcData.infoGenApellidoMaterno || undefined;
        if (dc_creatorsName && dc_creatorsLast) {
            if (dc_creatorsName.indexOf(';') > -1 && dc_creatorsLast.indexOf(';') > -1) { //revisando si son creadores separadas por ";"
                var arrklistName = dc_creatorsName.split(';');
                var arrklistLast = dc_creatorsLast.split(';');
                var arrklist2Last = dc_creators2Last.split(';');
                if (arrklistName.length === arrklistLast.length && arrklistName.length === arrklist2Last.length) {
                    for (var i = 0; i < arrklistName.length; i++) {
                        var fullname = arrklistName[i].trim();
                        if (arrklistLast[i].trim().length > 0) {
                            fullname += " " + arrklistLast[i].trim();
                        }
                        if (arrklist2Last[i].trim().length > 0) {
                            fullname += " " + arrklist2Last[i].trim();
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
                if (dc_creatorsName && dc_creatorsName.trim().length > 0) {
                    fullname = dc_creatorsName.trim();
                }
                if (dc_creatorsLast && dc_creatorsLast.trim().length > 0) {
                    fullname += " " + dc_creatorsLast.trim();
                }
                if (dc_creators2Last && dc_creators2Last.trim().length > 0) {
                    fullname += " " + dc_creators2Last.trim();
                }
                fullname = fullname.trim();
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
        var creatornote = dcData.infoGenNotas || undefined;
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
        var creatorgroup = dcData.infoGenGrupoEtnoDelProd || undefined;
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

        // Fecha cronología
        var timeline_date = dcData.infoGenNotaFecha || undefined;
        if (timeline_date && timeline_date.trim().length > 0 && timeline_date.trim().toLowerCase() !== "no identificada" && !isNaN(timeline_date.trim())) {
            ret.timelinedate = {"format": "", "value": timeline_date.trim()};
        }

// Fecha
        var bic_dates = dcData.infoGenFecha || undefined;
        if (bic_dates && bic_dates.trim().length > 0 && bic_dates.trim().toLowerCase() !== "no identificada" && !isNaN(bic_dates.trim()) && bic_dates.trim().toLowerCase() !== "s/f" && bic_dates.trim().toLowerCase() !== "sin fecha") {
            if (timeline_date && timeline_date.trim().length > 0 && !isNaN(timeline_date.trim())) {
                ret.datecreated = {"format": "", "value": timeline_date.trim(), note: bic_dates.trim()};
            } else {
                ret.datecreated = {"format": "", note: bic_dates.trim()};
            }
        }

//Rangos de fecha
        var datestart = {};
        var dateend = {};
        var fechaIni = dcData.infoGenRangoInicio || undefined;
        var fechaFin = dcData.infoGenRangoFinal || undefined;
        if (fechaIni && fechaFin) {
            datestart = {"format": "", "value": fechaIni.trim()};
            dateend = {"format": "", "value": fechaFin.trim()};
            ret.periodcreated = {"datestart": datestart, "dateend": dateend};
        }

// Rights digital objects
        var derechos = {};
        if (dcData.infoGenDerSobElObjQRepreBic) {
            rightsTitle = dcData.infoGenDerSobElObjQRepreBic;
            derechos.rightstitle = rightsTitle;
        }
        if (dcData.infoGenDerSobElBic) {
            rights = dcData.infoGenDerSobElBic;
            derechos.description = rights;
        }
        if (dcData.declaracion_de_uso_sobre_el_objeto_digital_que_representa_el_bic_url) {
            urlLicense = dcData.declaracion_de_uso_sobre_el_objeto_digital_que_representa_el_bic_url;
            derechos.url = urlLicense;
        } else {
            urlLicense = rights;
            derechos.url = urlLicense;
        }


        var strFormato = "";
// Digital Objects
        var od = [];
        var digObj = dcData.infoGenNomDelArch || undefined;
        if (digObj) {

            if (typeof digObj === 'object' && digObj instanceof org.semanticwb.Datamanager.DataList && digObj.length > 0) {
                for (var j = 0; j < digObj.length; j++) {
                    var objDO = {};
                    var objMedia = {};

                    strFormato = digObj[j];
                    if (strFormato && strFormato.trim().length > 0) {
                        strFormato = strFormato.trim();
                        ret.resourcethumbnail = paththumbnail + strFormato;
                        objMedia.mime = strFormato.substring(strFormato.indexOf(".") + 1).toLowerCase();

                        objMedia.name = strFormato;
//                        var originalName = dcData.nombre_del_objeto_digital_original || undefined;
//                        if (originalName && originalName.trim().length > 0) {
//                            objMedia.digitalobjecttitleoriginal = originalName;
//                        }
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
                        objDO.url = doURL + strFormato;
                        if (od.indexOf(doURL + strFormato) === -1) {
                            od.push(doURL + strFormato);
                            dObjs.push(objDO);
                        }
                    }

                }
                if (od.length === 0) {
                    ret.forIndex = false;
                }
            } else if (digObj.length > 0) {
                var objDO = {};
                var objMedia = {};

                strFormato = digObj;
                if (strFormato) {
                    strFormato = strFormato.trim();
                    objMedia.mime = strFormato.substring(strFormato.indexOf(".") + 1).toLowerCase();
                }
                objMedia.name = digObj;
//                var originalName = dcData.nombre_del_objeto_digital_original || undefined;
//                if (originalName && originalName.trim().length > 0) {
//                    objMedia.digitalobjecttitleoriginal = originalName;
//                }
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
                ret.resourcethumbnail = paththumbnail + digObj;
            } else {
                ret.forIndex = false;
            }
        } else {
            ret.forIndex = false;
        }

        if (strFormato && strFormato.trim().length > 0) {
            dotype.mime = strFormato.substring(strFormato.indexOf(".") + 1).toLowerCase();
            ;
            derechos.media = dotype;
        } else {
            dotype.mime = "";
            derechos.media = dotype;
        }

        // Publisher
        ret.publisher = "";
        if (dcData.institucion_creadora_del_bic) {
            ret.publisher = dcData.institucion_creadora_del_bic;
        }

        // Holder
        if (dcData.infoGenInstitucion) {
            arrHolder.push(dcData.institucion);
        }

        // Holder id
        var holderid = dcData.id_institucion || undefined;
        if (holderid && typeof holderid === "string" && holderid.trim().length > 0) {
            ret.holderid = holderid;
        }

//        // Thumbnail
//        var thumbnail = dcData.thumbnail || undefined;
//        ret.resourcethumbnail = "";
//        if (thumbnail && typeof thumbnail === "string" && thumbnail.trim().length > 0) {
//            ret.resourcethumbnail = paththumbnail + thumbnail;
//        }
//
//        //thumbnail cronologia
//        var timelinethumbnail = dcData.cronologia || undefined;
//        ret.timelinethumbnail = "";
//        if (timelinethumbnail && typeof timelinethumbnail === "string" && timelinethumbnail.trim().length > 0) {
//            ret.timelinethumbnail = pathtimelineth + timelinethumbnail;
//        }


        // Dimension Alto x Ancho x Espesor x Diametro
        var dimension = "";
        if (dcData.infoGenAlto && typeof dcData.infoGenAlto === 'string' && dcData.infoGenAlto.trim().length > 0) {
            dimension = "Alto: " + dcData.infoGenAlto.trim();
        }

        if (dcData.infoGenAncho && typeof dcData.infoGenAncho === 'string' && dcData.infoGenAncho.trim().length > 0) {
            if (dimension.length > 0) {
                dimension += ", ";
            }
            dimension = "Ancho: " + dcData.infoGenAncho.trim();
        }

        if (dcData.infoGenEspesor && typeof dcData.infoGenEspesor === 'string' && dcData.infoGenEspesor.trim().length > 0) {
            if (dimension.length > 0) {
                dimension += ", ";
            }
            dimension = "Espesor: " + dcData.infoGenEspesor.trim();
        }

        if (dcData.infoGenDiam && typeof dcData.infoGenDiam === 'string' && dcData.infoGenDiam.trim().length > 0) {
            if (dimension.length > 0) {
                dimension += ", ";
            }
            dimension = "Diámetro: " + dcData.infoGenDiam.trim();
        }
        ret.dimension = dimension;

        // validar capítulo
        var epoca = dcData.infoGenFiltroEpoca || undefined;
        if (epoca && typeof epoca === "string" && epoca.trim().length > 0) {
            ret.period = epoca;
        }

        //validar destacados
//        var destacado = dcData.destacados || undefined;
//        if (destacado && typeof destacado === "string" && destacado.trim().length > 0 && destacado==="1") {
//            ret.important = 1;
//        } else {
//            ret.important = 0;
//        }
        ret.important = 1;
        // validar formatos disponibles
        var availableformats = dcData.formatos_disponibles || undefined;
        if (availableformats && typeof availableformats === "string" && availableformats.trim().length > 0) {
            ret.availableformats = availableformats;
        }


        // validar id media
        var mediaid = dcData.id_media || undefined;
        if (mediaid && typeof mediaid === "string" && mediaid.trim().length > 0) {
            ret.mediaid = mediaid;
        }

        // validar id formato
        var formatid = dcData.id_formato || undefined;
        if (formatid && typeof formatid === "string" && formatid.trim().length > 0) {
            ret.formatid = formatid;
        }

        // validar episodio
        var episodio = dcData.episodio || undefined;
        if (episodio && typeof episodio === "string" && episodio.trim().length > 0) {
            ret.episode = episodio;
        }

        // validar fondo documental del bic
        var fondodocu = dcData.fondo_documental_del_bic || undefined;
        if (fondodocu && typeof fondodocu === "string" && fondodocu.trim().length > 0) {
            ret.documentalfund = fondodocu;
        }


        // validar serie
        if (data.serie) {
            if (data.serie.indexOf(",") > -1) {
                var colles = data.serie.split(',');
                for (var i = 0; i < colles.length; i++) {
                    var coleccion = colles[i];
                    serie.push(coleccion);
                }
            } else {
                var coleccion = data.serie;
                serie.push(coleccion);
            }
            ret.serie = serie;
        }

        // validar dirección
        var direccion = dcData.direccion || undefined;
        if (direccion && typeof direccion === "string" && direccion.trim().length > 0) {
            ret.direction = direccion;
        }

        // validar subtitulo
        var subtitle = dcData.subtitle || undefined;
        if (subtitle && typeof subtitle === "string" && subtitle.trim().length > 0) {
            ret.subtitle = subtitle;
        }

        // validar numero
        var numero = dcData.numero || undefined;
        if (numero && typeof numero === "string" && numero.trim().length > 0) {
            ret.number = numero;
        }

        // validar editorial
        var editorial = dcData.editorial || undefined;
        if (editorial && typeof editorial === "string" && editorial.trim().length > 0) {
            ret.editorial = editorial;
        }


        ret.rights = derechos;
        ret.digitalObject = dObjs;
        ret.identifier = idArray;
        ret.oaiid = data.oaiid;
        ret.generator = elGenerator;  // Pertenece a la colección
        ret.recordtitle = elTitle;
        ret.resourcetype = elType;
        if (arrHolder.length === 0) {
            arrHolder.push("Museo Nacional de Culturas Populares");
        }
        ret.holder = arrHolder;
        ret.description = elDescrip;

    }
    ret.resourcestats = {"views": 0};
    ret.indexcreated = Date.now();


    return ret;
}