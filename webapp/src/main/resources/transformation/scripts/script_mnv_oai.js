function (data) {
    /**
     Museo Nacional del Virreinato file Script
     **/
    var doURL = "http://virreinato.inah.gob.mx/img/coleccion/";
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
        if (dcData.infoAuto && typeof dcData.infoAuto === "string" && dcData.infoAuto.trim().length > 0) {
            idArray.push({type: "auto", value: dcData.infoAuto, preferred: false});
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

        if (dcData.infoGenTipo && typeof dcData.infoGenTipo === "string" && dcData.infoGenTipo.trim().length > 0) {
            if (dcData.infoGenTipo.indexOf(",") > -1) {
                var colles = dcData.infoGenTipo.split(',');
                for (var i = 0; i < colles.length; i++) {
                    elType.push(colles[i]);
                }
            } else {
                elType.push(dcData.infoGenTipo);
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
        if (dcData.investInvestDescFormalIcono && typeof dcData.investInvestDescFormalIcono === 'string' && dcData.investInvestDescFormalIcono.trim().length > 0) {
            fullDescription = dcData.investInvestDescFormalIcono.trim();
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


// Lugar
        if (dcData.infoGenProced && typeof dcData.infoGenProced === "string" && dcData.infoGenProced.trim().length > 0) {
            ret.lugar = dcData.infoGenProced;
        }

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

        var arrUnits = dcData.infoGenUni || undefined;
        var haveUnits = false;
        if (typeof arrUnits === 'object' && arrUnits instanceof org.semanticwb.datamanager.DataList && arrUnits.length > 0) {
            haveUnits = true;
        }
        // Dimension Alto x Ancho x Espesor x Diametro
        var dimension = "";
        if (dcData.infoGenAlto && typeof dcData.infoGenAlto === 'string' && dcData.infoGenAlto.trim().length > 0) {
            dimension = "Alto: " + dcData.infoGenAlto.trim();
        }

        if (dcData.infoGenLargo && typeof dcData.infoGenLargo === 'string' && dcData.infoGenLargo.trim().length > 0) {
            dimension = "Largo: " + dcData.infoGenLargo.trim();
        }

        if (dcData.infoGenDiam && typeof dcData.infoGenDiam === 'string' && dcData.infoGenDiam.trim().length > 0) {
            if (dimension.length > 0) {
                dimension += ", ";
            }
            dimension = "Diámetro: " + dcData.infoGenDiam.trim();
            if (haveUnits && arrUnits.length > 0) {
                var tmparr = arrUnits[0];
                var units = arrUnits[0];
                if (tmparr.indexOf(";") !== -1) {
                    var myunit = tmparr.split(';');
                    units = myunit[0];
                }
                dimension += " " + units;
            }
        }

        if (dcData.infoGenAncho && typeof dcData.infoGenAncho === 'string' && dcData.infoGenAncho.trim().length > 0) {
            if (dimension.length > 0) {
                dimension += ", ";
            }
            dimension = "Ancho: " + dcData.infoGenAncho.trim();
            if (haveUnits && arrUnits.length > 1) {
                var tmparr = arrUnits[1];
                var units = arrUnits[1];
                if (tmparr.indexOf(";") !== -1) {
                    var myunit = tmparr.split(';');
                    units = myunit[0];
                }
                dimension += " " + units;
            }
        }

        if (dcData.infoGenFondo && typeof dcData.infoGenFondo === 'string' && dcData.infoGenFondo.trim().length > 0) {
            if (dimension.length > 0) {
                dimension += ", ";
            }
            dimension = "Fondo: " + dcData.infoGenFondo.trim();
            if (haveUnits && arrUnits.length > 2) {
                var tmparr = arrUnits[2];
                var units = arrUnits[2];
                if (tmparr.indexOf(";") !== -1) {
                    var myunit = tmparr.split(';');
                    units = myunit[0];
                }
                dimension += " " + units;
            }
        }

        if (dcData.infoGenAltoConMarco && typeof dcData.infoGenAltoConMarco === 'string' && dcData.infoGenAltoConMarco.trim().length > 0) {
            if (dimension.length > 0) {
                dimension += ", ";
            }
            dimension = "Alto con marco: " + dcData.infoGenAltoConMarco.trim();
            if (haveUnits && arrUnits.length > 3) {
                var tmparr = arrUnits[3];
                var units = arrUnits[3];
                if (tmparr.indexOf(";") !== -1) {
                    var myunit = tmparr.split(';');
                    units = myunit[0];
                }
                dimension += " " + units;
            }
        }

        if (dcData.infoGenLargoConMarco && typeof dcData.infoGenLargoConMarco === 'string' && dcData.infoGenLargoConMarco.trim().length > 0) {
            if (dimension.length > 0) {
                dimension += ", ";
            }
            dimension = "Largo con marco: " + dcData.infoGenLargoConMarco.trim();
            if (haveUnits && arrUnits.length > 4) {
                var tmparr = arrUnits[4];
                var units = arrUnits[4];
                if (tmparr.indexOf(";") !== -1) {
                    var myunit = tmparr.split(';');
                    units = myunit[0];
                }
                dimension += " " + units;
            }
        }

        ret.dimension = dimension;

        // validar Estado de conservación
        var edoconserv = dcData.conservConservOEdoConser || undefined;
        if (edoconserv && typeof edoconserv === "string" && edoconserv.trim().length > 0) {
            ret.conservationstate = edoconserv;
        }

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

        // validar subtitulo
        var techmat = dcData.investInvestTecMat || undefined;
        if (techmat && typeof techmat === "string" && techmat.trim().length > 0) {
            ret.techmaterial = techmat;
        }

        // validar inscripciones en la obra
        var inscripobra = dcData.investInvestInscripciones || undefined;
        if (inscripobra && typeof inscripobra === "string" && inscripobra.trim().length > 0) {
            ret.inscripcionobra = inscripobra;
        }

        // validar referencias bibliográficas
        var reference = dcData.investInvestNotas || undefined;
        if (reference && typeof reference === "string" && reference.trim().length > 0) {
            ret.reference = reference;
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
            arrHolder.push("Museo Nacional del Virreinato");
        }
        ret.holder = arrHolder;
        ret.description = elDescrip;

    }
    ret.resourcestats = {"views": 0};
    ret.indexcreated = Date.now();


    return ret;
}


