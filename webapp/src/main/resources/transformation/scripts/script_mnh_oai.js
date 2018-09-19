function (data) {
    /**
     Museo Nacional de Historia file Script
     **/
    var doURL = "http://mnh.inah.gob.mx/img/coleccion/";
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

        if (dcData.infoGenFondoOColecc) {
            if (dcData.infoGenFondoOColecc.indexOf(",") > -1) {
                var colles = dcData.infoGenFondoOColecc.split(',');
                for (var i = 0; i < colles.length; i++) {
                    var coleccion = colles[i];
                    reccollection.push(coleccion);
                    coleccion = coleccion.replace(new RegExp(" ", 'g'), "_");
                    elCollection.push(coleccion);
                }
            } else {
                var coleccion = dcData.infoGenFondoOColecc;
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
        if (dcData.infoGenNotaColeccion && dcData.infoGenNotaColeccion.trim().length > 0) {
            elCollection.push(dcData.infoGenNotaColeccion.trim());
        }

        ret.collection = elCollection;
// Identificador
        idArray.push({type: "oai", value: data.oaiid, preferred: true});

        if (dcData.infoGenIdentSigropam && typeof dcData.infoGenIdentSigropam === "string" && dcData.infoGenIdentSigropam.trim().length > 0) {
            idArray.push({type: "sigropam", value: dcData.infoGenIdentSigropam, preferred: false});
        }
        if (dcData.infoGenIdentNumDeInven && typeof dcData.infoGenIdentNumDeInven === "string" && dcData.infoGenIdentNumDeInven.trim().length > 0) {
            idArray.push({type: "inventario", value: dcData.infoGenIdentNumDeInven, preferred: false});
        }


        if (dcData.infoGenTipoDeObj && typeof dcData.infoGenTipoDeObj === "string" && dcData.infoGenTipoDeObj.trim().length > 0) {
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

        if (dcData.infoGenTitulo && typeof dcData.infoGenTitulo === 'string' && dcData.infoGenTitulo.trim().length > 0) {
            tmpTitle = dcData.infoGenTitulo;
            tmpTitle = tmpTitle.replace(new RegExp("´", 'g'), "'");
            tmpTitle = tmpTitle.replace(new RegExp("‘", 'g'), "'");
            tmpTitle = tmpTitle.replace(new RegExp("“", 'g'), '"');
            tmpTitle = tmpTitle.replace(new RegExp("”", 'g'), '"');
            tmpTitle = tmpTitle.replace(new RegExp("`", 'g'), "'");
            elTitle.push({type: "main", value: tmpTitle});
        } else if (dcData.titulo && typeof dcData.titulo === 'string' && dcData.titulo.trim().length > 0) {
            tmpTitle = dcData.titulo;
            tmpTitle = tmpTitle.replace(new RegExp("´", 'g'), "'");
            tmpTitle = tmpTitle.replace(new RegExp("‘", 'g'), "'");
            tmpTitle = tmpTitle.replace(new RegExp("“", 'g'), '"');
            tmpTitle = tmpTitle.replace(new RegExp("”", 'g'), '"');
            tmpTitle = tmpTitle.replace(new RegExp("`", 'g'), "'");
            elTitle.push({type: "main", value: tmpTitle});
        }
// Abstracto, descripción
        var fullDescription = "";
        if (dcData.infoGenDescripEnriq && typeof dcData.infoGenDescripEnriq === 'string' && dcData.infoGenDescripEnriq.trim().length > 0) {
            fullDescription = dcData.infoGenDescripEnriq.trim();
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
        if (dc_creatorsName && dc_creatorsLast && dc_creators2Last) {
            if (dc_creatorsName.indexOf(';') > -1 && dc_creatorsLast.indexOf(';') > -1 && dc_creators2Last.indexOf(';') > -1) { //revisando si son creadores separadas por ";"
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
                } else if (arrklistName.length === arrklistLast.length) {
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
            ret.creator = elCreator;
        }


        // nota del creador
        var creatornote = dcData.infoGenNotas || undefined;
        if (creatornote) {

            if (creatornote.indexOf(';') > -1) { //revisando si son notas de creador separadas por ";"
                var arrklist = creatornote.split(';');
                for (var i = 0; i < arrklist.length; i++) {
                    elCreatorNote.push(arrklist[i]);
                }
            } else {  //es una nota
                elCreatorNote.push(creatornote);
            }
            ret.creatornote = elCreatorNote;
        }

        // grupo del creador ﻿
        var creatorgroup = dcData.infoGenNombreGrupo || undefined;
        if (creatorgroup) {

            if (creatorgroup.indexOf(';') > -1) { //revisando si son grupo creador separadas por ";"
                var arrklist = creatorgroup.split(';');
                for (var i = 0; i < arrklist.length; i++) {
                    elCreatorGroup.push(arrklist[i]);
                }
            } else {  //es una nota
                elCreatorGroup.push(creatorgroup);
            }
            ret.creatorgroup = elCreatorGroup;
        }

        // grupo del creador del bic ﻿
//        var creatorgroup = dcData.infoGenGrupoEtnoDelProd || undefined;
//        if (creatorgroup) {
//
//            if (creatorgroup.indexOf(';') > -1) { //revisando si son grupo creador separadas por ";"
//                var arrklist = creatorgroup.split(';');
//                for (var i = 0; i < arrklist.length; i++) {
//                    elCreatorGroup.push(arrklist[i]);
//                }
//            } else {  //es una nota
//                elCreatorGroup.push(creatorgroup);
//            }
//            ret.creatorgroup = elCreatorGroup;
//        }

        // créditos
//        var dc_credits = data.creditos || undefined;
//        if (dc_credits) {
//
//            if (dc_credits.indexOf(';') > -1) { //revisando si son palabras clave separadas por ","
//                var arrklist = dc_credits.split(';');
//                for (var i = 0; i < arrklist.length; i++) {
//                    elCredit.push(arrklist[i]);
//                }
//            } else {  //es un credito
//                elCredit.push(dc_credits);
//            }
//            ret.credits = elCredit;
//        }
// Lenguaje
//        var lengua = data.lengua || undefined;
//        if (lengua && typeof lengua === "string" && lengua.trim().length > 0) {
//            elLang.push(lengua);
//            ret.lang = elLang;
//        }

// Ubicación
        if (dcData.movColUbicUbic && typeof dcData.movColUbicUbic === "string" && dcData.movColUbicUbic.trim().length > 0) {
            ret.lugar = dcData.movColUbicUbic;
        }
//
//        // Nota lugar
//        if (data.nota_lugar) {
//            ret.lugar += ", " + data.nota_lugar;
//        }

//// Generador del BIC        
//        var generators = data.creador_del_bic || undefined;
//        if (generators) {
//            if (generators.indexOf(',') > -1) { //revisando si son varios generadores del BIC separados por ","
//                var arrklist = generators.split(',');
//                for (var i = 0; i < arrklist.length; i++) {
//                    elGenerator.push(arrklist[i]);
//                }
//            } else {  //un generador del BIC
//                elGenerator.push(generators);
//            }
//        }
//// Fecha
//    var bic_dates = data.fecha || undefined;
//    if (bic_dates && bic_dates.trim().length > 0 && bic_dates.trim().toLowerCase() !== "no identificada") {
//        bic_dates = bic_dates.replace(new RegExp("/", 'g'), "-");
//        if (bic_dates.indexOf("-") > -1) {
//            var arrklist = bic_dates.split('-');
//            var fechayear = 0;
//            var fechaday = 0;
//            var fechamonth = 0;
//            if (arrklist.length === 3) {
//                if (arrklist[0] > 1000) {
//                    fechayear = arrklist[0];
//                    fechamonth = arrklist[1];
//                    if (fechamonth > 12) {
//                        fechamonth = arrklist[2];
//                        fechaday = arrklist[1];
//                    } else {
//                        fechaday = arrklist[2];
//                    }
//                } else {
//                    fechayear = arrklist[2];
//                    fechamonth = arrklist[1];
//                    if (fechamonth > 12) {
//                        fechamonth = arrklist[0];
//                        fechaday = arrklist[1];
//                    } else {
//                        fechaday = arrklist[1];
//                    }
//                }
//                if (fechamonth.length === 1) {
//                    fechamonth = "0" + fechamonth;
//                }
//                if (fechaday.length === 1) {
//                    fechaday = "0" + fechaday;
//                }
//                bic_dates = fechayear + "-" + fechamonth + "-" + fechaday;
//            }
//        }
//
//        ret.datecreated = {"format": "", "value": bic_dates.trim()};
//    }
//// Fecha cronología
//    var timeline_date = data.nota_fecha || undefined;
//    if (timeline_date && timeline_date.trim().length > 0 && timeline_date.trim().toLowerCase() !== "no identificada") {
//        ret.timelinedate = {"format": "", "value": timeline_date.trim()};
//    }

        // Fecha cronología
        var timeline_date = dcData.infoGenNotaFecha || undefined;
        if (timeline_date && timeline_date.trim().length > 0 && timeline_date.trim().toLowerCase() !== "no identificada" && !isNaN(timeline_date.trim())) {
            ret.timelinedate = {"format": "", "value": timeline_date.trim()};
        }

// Fecha
        var bic_dates = dcData.infoGenFecha || undefined;
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

            if (typeof digObj === 'object' && digObj instanceof org.semanticwb.datamanager.DataList && digObj.length > 0) {
                for (var j = 0; j < digObj.length; j++) {
                    var objDO = {};
                    var objMedia = {};

                    strFormato = digObj[j];
                    if (strFormato && strFormato.trim().length > 0) {
                        strFormato = strFormato.trim();
                        ret.resourcethumbnail = paththumbnail + strFormato;
                        objMedia.mime = strFormato.substring(strFormato.indexOf(".") + 1).toLowerCase();

                        objMedia.name = strFormato;
//                        var originalName = data.nombre_del_objeto_digital_original || undefined;
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
//                var originalName = data.nombre_del_objeto_digital_original || undefined;
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

        var arrUnits = dcData.infoGenUni || undefined;
        var haveUnits = false;
        if (typeof arrUnits === 'object' && arrUnits instanceof org.semanticwb.datamanager.DataList && arrUnits.length > 0) {
            haveUnits = true;
        }
        // Dimension Alto x Ancho x Espesor x Diametro
        var dimension = "";
        if (dcData.infoGenLargo && typeof dcData.infoGenLargo === 'string' && dcData.infoGenLargo.trim().length > 0) {
            dimension = "Largo: " + dcData.infoGenLargo.trim();
            if (haveUnits && arrUnits.length > 0) {
                dimension += " " + arrUnits[0];
            }
        }
        if (dcData.infoGenAlto && typeof dcData.infoGenAlto === 'string' && dcData.infoGenAlto.trim().length > 0) {
            dimension = "Alto: " + dcData.infoGenAlto.trim();
            if (haveUnits && arrUnits.length > 1) {
                dimension += " " + arrUnits[1];
            }
        }

        if (dcData.infoGenAncho && typeof dcData.infoGenAncho === 'string' && dcData.infoGenAncho.trim().length > 0) {
            if (dimension.length > 0) {
                dimension += ", ";
            }
            dimension = "Ancho: " + dcData.infoGenAncho.trim();
            if (haveUnits && arrUnits.length > 2) {
                dimension += " " + arrUnits[2];
            }
        }

        if (dcData.infoGenProf && typeof dcData.infoGenProf === 'string' && dcData.infoGenProf.trim().length > 0) {
            if (dimension.length > 0) {
                dimension += ", ";
            }
            dimension = "Profundidad: " + dcData.infoGenProf.trim();
            if (haveUnits && arrUnits.length > 3) {
                dimension += " " + arrUnits[3];
            }
        }

        if (typeof dcData.infoGenDiam === 'object' && dcData.infoGenDiam instanceof org.semanticwb.datamanager.DataList && dcData.infoGenDiam.length > 0) {
            if (dimension.length > 0) {
                dimension += ", ";
            }
            dimension = "Diámetro: " + dcData.infoGenDiam[0].trim();
            if (haveUnits && arrUnits.length > 4) {
                dimension += " " + arrUnits[4];
            }
            if (dcData.infoGenDiam.length > 1) {
                dimension = "Diámetro: " + dcData.infoGenDiam[1].trim();
                if (haveUnits && arrUnits.length > 4) {
                    dimension += " " + arrUnits[4];
                }
            }
        } else if (dcData.infoGenDiam && typeof dcData.infoGenDiam === 'string' && dcData.infoGenDiam.trim().length > 0) {
            if (dimension.length > 0) {
                dimension += ", ";
            }
            dimension = "Diámetro: " + dcData.infoGenDiam.trim();
            if (haveUnits && arrUnits.length > 4) {
                dimension += " " + arrUnits[4];
            }
        }

        ret.dimension = dimension;

        // validar Curaduría
        var curaduria = data.investInvestCuraduria || undefined;
        if (curaduria && typeof curaduria === "string" && curaduria.trim().length > 0) {
            ret.curaduria = curaduria;
        }

// validar Material
        var material = data.infoGenMateriaPrima || undefined;
        if (material && typeof material === "string" && material.trim().length > 0) {
            ret.material = material;
        }


        // validar disciplina
        var disciplina = dcData.infoGenDisciplina || undefined;
        if (disciplina && typeof disciplina === "string" && disciplina.trim().length > 0) {
            ret.discipline = disciplina;
        }

        // validar epoca
        var epoca = dcData.infoGenFiltroEpoca || undefined;
        if (epoca && typeof epoca === "string" && epoca.trim().length > 0) {
            ret.period = epoca;
        }

        //validar destacados
        var destacado = dcData.destacados || undefined;
        if (destacado && typeof destacado === "string" && destacado.trim().length > 0) {
            ret.destacado = true;
        } else {
            ret.destacado = false;
        }

        // validar técnica
        var tecnica = dcData.investInvestTecnica || undefined;
        if (tecnica && typeof tecnica === "string" && tecnica.trim().length > 0) {
            ret.technique = tecnica;
        } else if (dcData.investInvestTecDeManuf && typeof dcData.investInvestTecDeManuf === "string" && dcData.investInvestTecDeManuf.trim().length > 0) { //
            ret.technique = dcData.investInvestTecDeManuf.trim();
        }

// validar inscripcion
        var inscripcion = dcData.investInvestInscripciones || undefined;
        if (inscripcion && typeof inscripcion === "string" && inscripcion.trim().length > 0) {
            ret.inscripcion = inscripcion;
        }
// validar cultura
        var cultura = dcData.infoGenCultura || undefined;
        if (cultura && typeof cultura === "string" && cultura.trim().length > 0) {
            ret.cultura = cultura;
        }
// validar origen
        var origen = dcData.investInvestOrigen || undefined;
        if (origen && typeof origen === "string" && origen.trim().length > 0) {
            ret.origen = origen;
        }

        // validar tecnica
        var tecnica = dcData.investInvestTecnica || undefined;
        if (tecnica && typeof tecnica === "string" && tecnica.trim().length > 0) {
            ret.technique = tecnica;
        } else if (dcData.investInvestTecDeManuf && typeof dcData.investInvestTecDeManuf === "string" && dcData.investInvestTecDeManuf.trim().length > 0) { //
            ret.technique = dcData.investInvestTecDeManuf.trim();
        }
        
        // validar acervo
        var acervo = dcData.infoGenAcervo || undefined;
        if (acervo && typeof acervo === "string" && acervo.trim().length > 0) {
            ret.acervo = acervo;
        }

        // validar hiperonimo
        var hiperonimo = dcData.infoGenHiperonimo || undefined;
        if (hiperonimo && typeof hiperonimo === "string" && hiperonimo.trim().length > 0) {
            ret.hiperonimo = hiperonimo;
        }

        // validar observaciones
        var observs = dcData.investInvestObserv || undefined;
        if (observs && typeof observs === "string" && observs.trim().length > 0) {
            ret.observations = observs;
        }


        ret.rights = derechos;
        ret.digitalObject = dObjs;
        ret.identifier = idArray;
        ret.oaiid = data.oaiid;
        ret.generator = elGenerator;  // Pertenece a la colección
        ret.recordtitle = elTitle;
        ret.resourcetype = elType;
        if (arrHolder.length === 0) {
            arrHolder.push("Museo Nacional de Historia");
        }
        ret.holder = arrHolder;
        ret.description = elDescrip;

    }
    ret.resourcestats = {"views": 0};
    ret.indexcreated = Date.now();


    return ret;
}


