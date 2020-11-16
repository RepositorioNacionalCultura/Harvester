function (data) {
    /** MEDIATECA INAH **/
    var doURL = "http://mediateca.inah.gob.mx/repositorio/islandora/object/";
    var doURLSuffix = "/datastream/OBJ/view";
    //var doURLSuffix = "/datastream/JPG/view";
    //var doURLTN = "http://192.168.81.211:8080/mediateca/";
    var doURLTN = "/mediateca/";

    var ret = {};
    var idArray = [];
    var elType = [];
    var elTitle = [];
    var elDescrip = [];
    var elCollection = [];
    var elkeys = [];
    var elLang = [];
    var elCreator = [];
    var arrHolder = [];
    var dObjs = [];
    var modsData = undefined;
    var rightsTitle = "";
    var rights = "";
    var dotype = {};
    var elGenerator = [];

    if (data.mods) {

        //console.log("ok mods");
        if (data.mods.mods_mods) {
            modsData = data.mods.mods_mods;
        } else if (data.mods.mods) {
            modsData = data.mods.mods;
        }

    }
    var dcData = undefined;
    if (data.oai_dc && data.oai_dc.oai_dc_dc) {
        dcData = data.oai_dc.oai_dc_dc;
    }
    var header = data.header || undefined;
    var urlLicense = "";
    var urlLicenseContent = "";
    var urlLicenseType = "";


    idArray.push({type: "oai", value: header.identifier, preferred: true});

    if (header && header.setSpec) {
        var colles = header.setSpec;
        if (typeof colles === 'string') {
            elCollection.push(colles);
        } else if (colles.length > 0) {
            for (var i = 0; i < colles.length; i++) {
                elCollection.push(colles[i]);
            }
        }
    }

    if (dcData) {

        if (dcData.dc_type) {

            if (typeof dcData.dc_type === 'string') {
                elType.push(dcData.dc_type);

            } else if (dcData.dc_type.length > 0) {

                for (var i = 0; i < dcData.dc_type.length; i++) {
                    if (dcData.dc_type[i].content) {
                        elType.push(dcData.dc_type[i].content);
                    }
                }
                //ret.resourcetype = elType;
            }
        }
        var fulltitle = "";
        if (dcData.dc_title) {

            if (typeof dcData.dc_title === 'string') {
                fulltitle = dcData.dc_title;
                fulltitle = fulltitle.replace(new RegExp("´", 'g'), "'");
                fulltitle = fulltitle.replace(new RegExp("‘", 'g'), "'");
                fulltitle = fulltitle.replace(new RegExp("“", 'g'), '"');
                fulltitle = fulltitle.replace(new RegExp("”", 'g'), '"');
                fulltitle = fulltitle.replace(new RegExp("`", 'g'), "'");
                elTitle.push({type: "main", value: fulltitle});
            } else if (dcData.dc_title.content && typeof dcData.dc_title.content === 'string') {
                fulltitle = dcData.dc_title.content;
                fulltitle = fulltitle.replace(new RegExp("´", 'g'), "'");
                fulltitle = fulltitle.replace(new RegExp("‘", 'g'), "'");
                fulltitle = fulltitle.replace(new RegExp("“", 'g'), '"');
                fulltitle = fulltitle.replace(new RegExp("”", 'g'), '"');
                fulltitle = fulltitle.replace(new RegExp("`", 'g'), "'");
                elTitle.push({type: "main", value: fulltitle});
            }
        }

        var fullDescription = "";
        if (dcData.dc_description) {
            if (typeof dcData.dc_description === 'string') {
                fullDescription = dcData.dc_description;
                fullDescription = fullDescription.replace(new RegExp("´", 'g'), "'");
                fullDescription = fullDescription.replace(new RegExp("‘", 'g'), "'");
                fullDescription = fullDescription.replace(new RegExp("“", 'g'), '"');
                fullDescription = fullDescription.replace(new RegExp("”", 'g'), '"');
                fullDescription = fullDescription.replace(new RegExp("`", 'g'), "'");

                elDescrip.push(fullDescription);
            } else if (dcData.dc_description && dcData.dc_description.length > 0) {
                for (var i = 0; i < dcData.dc_description.length; i++) {
                    if (typeof dcData.dc_description[i] === 'string') {
                        fullDescription += dcData.dc_description[i];
                        if (i + 1 < dcData.dc_description.length) {
                            fullDescription += " ";
                        }
                        fullDescription = fullDescription.replace(new RegExp("´", 'g'), "'");
                        fullDescription = fullDescription.replace(new RegExp("‘", 'g'), "'");
                        fullDescription = fullDescription.replace(new RegExp("“", 'g'), '"');
                        fullDescription = fullDescription.replace(new RegExp("”", 'g'), '"');
                        fullDescription = fullDescription.replace(new RegExp("`", 'g'), "'");
                    }
                }

                if (fullDescription !== "") {
                    elDescrip.push(fullDescription);
                }
            } else if (typeof dcData.dc_description === 'object' && dcData.dc_description.content && typeof dcData.dc_description.content === 'string') {
                fullDescription = dcData.dc_description.content;
                fullDescription = fullDescription.replace(new RegExp("´", 'g'), "'");
                fullDescription = fullDescription.replace(new RegExp("‘", 'g'), "'");
                fullDescription = fullDescription.replace(new RegExp("“", 'g'), '"');
                fullDescription = fullDescription.replace(new RegExp("”", 'g'), '"');
                fullDescription = fullDescription.replace(new RegExp("`", 'g'), "'");
                elDescrip.push(fullDescription);
            }
        }

        if (dcData.dc_subject) {
            var palabras = dcData.dc_subject;
            //print("dcData.dc_subject:"+palabras.class+" "+(palabras instanceof org.semanticwb.datamanager.DataList))

            if (palabras && typeof palabras == 'string') {
                if (palabras.indexOf(',') > -1) { //revisando si son palabras clave separadas por ","
                    var arrklist = palabras.split(',');
                    for (var i = 0; i < arrklist.length; i++) {
                        if (elkeys.indexOf(arrklist[i]) == -1) {
                            elkeys.push(arrklist[i]);
                        }
                    }
                } else if (palabras.indexOf("--") > -1) {
                    var arrklist = palabras.split("--");
                    for (var i = 0; i < arrklist.length; i++) {
                        if (elkeys.indexOf(arrklist[i]) == -1) {
                            elkeys.push(arrklist[i]);
                        }
                    }
                } else {  //es una palabra clave
                    if (elkeys.indexOf(palabras) == -1) {
                        elkeys.push(palabras);
                    }
                }
            } else if (palabras && typeof palabras == 'object' && (palabras instanceof org.semanticwb.datamanager.DataList) && palabras.length > 0) { //es un arreglo
                for (var i = 0; i < palabras.length; i++) {

                    if (palabras[i].content && palabras[i].content.indexOf("--") > -1) {
                        var arrklist = palabras[i].content.split("--");
                        for (var j = 0; j < arrklist.length; j++) {
                            if (elkeys.indexOf(arrklist[j]) == -1) {
                                elkeys.push(arrklist[j]);
                            }
                        }
                    } else {  //es una palabra clave
                        if (palabras[i].content && elkeys.indexOf(palabras[i].content) == -1) {
                            elkeys.push(palabras[i].content);
                        }
                    }

                }
            }
        }

        if (dcData.dc_identifier_thumbnail && typeof dcData.dc_identifier_thumbnail === 'object' && dcData.dc_identifier_thumbnail.content) {
            ret.resourcethumbnail = dcData.dc_identifier_thumbnail.content;
        }

        var dc_creators = dcData.dc_creator || undefined;
        if (dc_creators) {
            if (typeof dc_creators === 'string') {
                elCreator.push(dc_creators);
            } else if (dc_creators.length > 0) {
                for (var w = 0; w < dc_creators.length; w++) {
                    if (dc_creators[w].content) {
                        elCreator.push(dc_creators[w].content);
                    }
                }

            } else if (dc_creators.content) {
                elCreator.push(dc_creators.content);
            }

        }

        var dc_langs = dcData.dc_language || undefined;
        if (dc_langs && dc_langs.content) {
            elLang.push(dc_langs.content);
            ret.lang = elLang;
        }


    }

    if (modsData) {

// Publisher & Generator

        if (modsData.relatedItem) {
            var objRelated = modsData.relatedItem;
            if (objRelated instanceof org.semanticwb.datamanager.DataList && objRelated.length > 0) {
                if (objRelated[0].titleInfo && objRelated[0].titleInfo.title && objRelated[0].titleInfo.title.content) {
                    ret.publisher = objRelated[0].titleInfo.title.content;
                }
                if (objRelated[1].titleInfo && objRelated[1].titleInfo.title && objRelated[1].titleInfo.title.content) {
                    elGenerator.push(objRelated[1].titleInfo.title.content);
                    ret.generator = elGenerator;
                }
            } else if (objRelated instanceof org.semanticwb.datamanager.DataObject && objRelated.title) {
                ret.publisher = objRelated.title;
                elGenerator.push(objRelated.title);
                ret.generator = elGenerator;
            }
        }


// Rights 

        if (modsData.accessCondition) {
            var objRights = modsData.accessCondition;
            var derechos = {};
            if (objRights.href) {
                derechos.url = objRights.href;
            }
            if (objRights.type) {
                derechos.rightstitle = objRights.type;
            }
            if (objRights.content) {
                derechos.description = objRights.content;
            }
            if (modsData.physicalDescription && modsData.physicalDescription.internetMediaType) {
                dotype.mime = modsData.physicalDescription.internetMediaType;
                derechos.media = dotype;
            } else {
                dotype.mime = "";
                derechos.media = dotype;
            }

            ret.rights = derechos;
        }


        if (modsData.recordInfo && modsData.recordInfo.recordContentSource) {
            var str_holder = modsData.recordInfo.recordContentSource;
            if (typeof str_holder === 'string') {
                arrHolder.push(modsData.recordInfo.recordContentSource);
            } else if (str_holder.length > 0) {
                var tmp_holder = "";
                for (var k = 0; k < str_holder.length; k++) {
                    arrHolder.push(str_holder[k]);
                }
            }
            ret.holder = arrHolder;
        }

        if (modsData.accessCondition && typeof modsData.accessCondition === 'object') {
            if (modsData.accessCondition.href) {
                urlLicense = modsData.accessCondition.href;
            }

            if (modsData.accessCondition.content) {
                urlLicenseContent = modsData.accessCondition.content;
                //if(urlLicense === "") urlLicense = urlLicenseContent;
            }

            if (modsData.accessCondition.type) {
                urlLicenseType = modsData.accessCondition.type;
            }
        }

        if (modsData.typeOfResource) {
            if (elType.indexOf(modsData.typeOfResource) === -1 || elType.length === 0) {
                elType.push(modsData.typeOfResource);
            }
        }

        if (modsData.originInfo) {
            //console.log("Buscando fecha....");
            if (modsData.originInfo.dateCreated) {
                //console.log("2");
                if (modsData.originInfo.dateCreated.content) {
                    //console.log("fecha..");
                    var dateVal = new String(modsData.originInfo.dateCreated.content);
                    if (dateVal) {
                        //console.log(dateVal);
                        dateVal = dateVal.toLowerCase();
                        if (dateVal.startsWith("ca.")) {
                            dateVal = dateVal.substring(3, dateVal.length);
                            dateVal = dateVal.trim();
                            //console.log(dateVal);
                        } else if (dateVal.indexOf("y") >= 0 || dateVal.indexOf("a") >= 0) {
                            var str2use = "y";
                            if (dateVal.indexOf("a") >= 0)
                                str2use = "a";
                            var periodencoding = "";
                            if (modsData.originInfo.dateCreated.encoding) {
                                periodencoding = modsData.originInfo.dateCreated.encoding;
                            }
                            var datestart = {};
                            var dateend = {};
                            var fechas = dateVal.split(str2use);
                            for (i = 0; i < fechas.length; i++) {
                                var dtmp = fechas[i].trim();
                                dtmp = dtmp.replace(" ", "");
                                if (i === 0) {
                                    datestart = {"format": periodencoding, "value": dtmp};
                                } else if (i === 1) {
                                    dateend = {"format": periodencoding, "value": dtmp};
                                }
                            }
                            ret.periodcreated = {"datestart": datestart, "dateend": dateend};
                        }
                    }

                    var isDateValid = false;
                    try {
                        var fechaValida = new Date(dateVal);
                        if (isNaN(fechaValida.getTime())) {
                            isDateValid = false;
                        } else {
                            isDateValid = true;
                        }

                        if (dateVal !== "" && !isDateValid) {
                            fechaValida = new Date(dateVal);
                            if (isNaN(fechaValida.getTime())) {
                                isDateValid = false;
                            } else {
                                isDateValid = true;
                            }
                        }
                    } catch (err) {
                        isDateValid = false;
                    }

                    if (isDateValid) {
                        if (dateVal && modsData.originInfo.dateCreated.encoding) {
                            ret.datecreated = {"format": modsData.originInfo.dateCreated.encoding, "value": dateVal, "textvalue": modsData.originInfo.dateCreated.content};
                        } else if (dateVal && !modsData.originInfo.dateCreated.encoding) {
                            ret.datecreated = {"format": "", "value": dateVal, "textvalue": dateVal};
                        }
                    }

                }


            } else if (modsData.originInfo.dateValid) {
                //console.log("1");
                if (modsData.originInfo.dateValid.content) {

                    var dateVal = new String(modsData.originInfo.dateValid.content);
                    if (dateVal) {
                        //console.log(dateVal);
                        dateVal = dateVal.toLowerCase();
                        if (dateVal.startsWith("ca.")) {
                            dateVal = dateVal.substring(3, dateVal.length);
                            dateVal = dateVal.trim();
                            //console.log(dateVal);
                        } else if (dateVal.indexOf("y") >= 0 || dateVal.indexOf("a") >= 0) {
                            var str2use = "y";
                            if (dateVal.indexOf("a") >= 0)
                                str2use = "a";
                            var periodencoding = "";
                            if (modsData.originInfo.dateValid.encoding) {
                                periodencoding = modsData.originInfo.dateValid.encoding;
                            }
                            var datestart = {};
                            var dateend = {};
                            var fechas = dateVal.split(str2use);
                            for (i = 0; i < fechas.length; i++) {
                                if (i === 0) {
                                    datestart = {"format": periodencoding, "value": fechas[i].trim()};
                                } else if (i === 1) {
                                    dateend = {"format": periodencoding, "value": fechas[i].trim()};
                                }
                            }
                            ret.periodcreated = {"datestart": datestart, "dateend": dateend};
                        }
                    }

                    var isDateValid = false;
                    try {
                        var fechaValida = new Date(dateVal);
                        if (isNaN(fechaValida.getTime())) {
                            isDateValid = false;
                        } else {
                            isDateValid = true;
                        }
                    } catch (err) {
                        isDateValid = false;
                    }

                    if (dateVal && modsData.originInfo.dateValid.encoding && isDateValid) {
                        ret.datecreated = {"format": modsData.originInfo.dateValid.encoding, "value": dateVal, "textvalue": modsData.originInfo.dateValid.content};
                    } else if (dateVal && !modsData.originInfo.dateValid.encoding && isDateValid) {
                        ret.datecreated = {"format": "", "value": dateVal, "textvalue": dateVal};
                    } else if (dateVal && modsData.originInfo.dateValid.encoding && !isDateValid) {
                        ret.datecreated = {"format": modsData.originInfo.dateValid.encoding, "textvalue": dateVal};
                    } else if (dateVal && !modsData.originInfo.dateValid.encoding && !isDateValid) {
                        ret.datecreated = {"format": "", "textvalue": dateVal};
                    }
                }
            } else if (modsData.originInfo.dateIssued) {
                //console.log("3");
                if (modsData.originInfo.dateIssued.content) {

                    var dateVal = new String(modsData.originInfo.dateIssued.content);
                    if (dateVal) {
                        //console.log(dateVal);
                        dateVal = dateVal.toLowerCase();
                        if (dateVal.startsWith("ca.")) {
                            dateVal = dateVal.substring(3, dateVal.length);
                            dateVal = dateVal.trim();
                            //console.log(dateVal);
                        } else if (dateVal.indexOf("y") >= 0 || dateVal.indexOf("a") >= 0) {
                            var str2use = "y";
                            if (dateVal.indexOf("a") >= 0)
                                str2use = "a";
                            var periodencoding = "";
                            if (modsData.originInfo.dateIssued.encoding) {
                                periodencoding = modsData.originInfo.dateIssued.encoding;
                            }
                            var datestart = {};
                            var dateend = {};
                            var fechas = dateVal.split(str2use);
                            for (i = 0; i < fechas.length; i++) {
                                if (i === 0) {
                                    datestart = {"format": periodencoding, "value": fechas[i].trim()};
                                } else if (i === 1) {
                                    dateend = {"format": periodencoding, "value": fechas[i].trim()};
                                }
                            }
                            ret.periodcreated = {"datestart": datestart, "dateend": dateend};
                        }
                    }

                    var isDateValid = false;
                    try {
                        var fechaValida = new Date(dateVal);
                        if (isNaN(fechaValida.getTime())) {
                            isDateValid = false;
                        } else {
                            isDateValid = true;
                        }
                    } catch (err) {
                        isDateValid = false;
                    }

                    if (dateVal && modsData.originInfo.dateIssued.encoding && isDateValid) {
                        ret.datecreated = {"format": modsData.originInfo.dateIssued.encoding, "value": dateVal, "textvalue": modsData.originInfo.dateIssued.content};
                    } else if (dateVal && !modsData.originInfo.dateIssued.encoding && isDateValid) {
                        ret.datecreated = {"format": "", "value": dateVal, "textvalue": dateVal};
                    } else if (dateVal && modsData.originInfo.dateIssued.encoding && !isDateValid) {
                        ret.datecreated = {"format": modsData.originInfo.dateIssued.encoding, "textvalue": dateVal};
                    } else if (dateVal && !modsData.originInfo.dateIssued.encoding && !isDateValid) {
                        ret.datecreated = {"format": "", "textvalue": dateVal};
                    }
                }
            }
            //console.log("after date")
            if (modsData.originInfo.place) {
                //console.log("place")
                if (modsData.originInfo.place.placeTerm) {
                    //console.log("term")
                    var pterm = modsData.originInfo.place.placeTerm;
                    if (typeof pterm === 'object') {
                        //console.log("content...");
                        ret.lugar = pterm.content;
                        //console.log("lugar..."+ret.lugar);
                    }
                }
            }
        }

        //console.log("titulo")
        var strTitle = "";
        if (!dcData && elTitle.length === 0 && modsData.titleInfo && modsData.titleInfo.title) {
            //console.log("en title")
            if (typeof modsData.titleInfo.title === 'string') {
                strTitle = modsData.titleInfo.title;
                strTitle = strTitle.replace(new RegExp("´", 'g'), "'");
                strTitle = strTitle.replace(new RegExp("‘", 'g'), "'");
                strTitle = strTitle.replace(new RegExp("“", 'g'), '"');
                strTitle = strTitle.replace(new RegExp("”", 'g'), '"');
                strTitle = strTitle.replace(new RegExp("`", 'g'), "'");
                elTitle.push({type: "main", value: strTitle});
            } else if (modsData.titleInfo.title.content) {
                strTitle = modsData.titleInfo.title.content;
                strTitle = strTitle.replace(new RegExp("´", 'g'), "'");
                strTitle = strTitle.replace(new RegExp("‘", 'g'), "'");
                strTitle = strTitle.replace(new RegExp("“", 'g'), '"');
                strTitle = strTitle.replace(new RegExp("”", 'g'), '"');
                strTitle = strTitle.replace(new RegExp("`", 'g'), "'");
                elTitle.push({type: "main", value: strTitle});
            }
        }

        if (!ret.description && modsData.abstract && modsData.abstract.content) {
            strTitle = modsData.abstract.content;
            strTitle = strTitle.replace(new RegExp("´", 'g'), "'");
            strTitle = strTitle.replace(new RegExp("‘", 'g'), "'");
            strTitle = strTitle.replace(new RegExp("“", 'g'), '"');
            strTitle = strTitle.replace(new RegExp("”", 'g'), '"');
            strTitle = strTitle.replace(new RegExp("`", 'g'), "'");
            elDescrip.push(strTitle);
        }

        if (modsData.physicalDescription && modsData.physicalDescription.internetMediaType && header && header.identifier) {
            var objId = header.identifier.substring(header.identifier.lastIndexOf(":") + 1, header.identifier.length);
            var url = doURL + objId.replace("_", ":") + doURLSuffix;
            ret.resourcethumbnail = doURLTN + objId + "/Thumbnail.jpg";
            ret.digitalObject = [];
            var mimetype = {};
            mimetype.mime = modsData.physicalDescription.internetMediaType;
            if (data.fileName) {
                mimetype.name = data.fileName;
                url = doURLTN + objId + "/" + data.fileName;
            }
            var o_rights = {};
            o_rights.url = urlLicense;
            o_rights.rightstitle = urlLicenseContent;
            o_rights.description = urlLicenseType;

            ret.digitalObject.push({url: url, mediatype: mimetype, rights: o_rights});
        }

        var mods_langs = modsData.language || undefined;
        if (elLang && elLang.length == 0 && mods_langs) {
            if (typeof mods_langs == 'object') {
                if (mods_langs.languageTerm && (mods_langs.languageTerm instanceof org.semanticwb.datamanager.DataList)) {
                    for (var w = 0; w < mods_langs.languageTerm.length; w++) {
                        if (mods_langs.languageTerm[w].content) {
                            elLang.push(mods_langs.languageTerm[w].content);
                        }
                    }
                }
            } else if (mods_langs == 'string') {
                elLang.push(mods_langs);
            }
        }
        ret.lang = elLang;

        //if(elCreator.length===0){
        if (modsData && modsData.name && modsData.name.namePart) {
            var nameParts = modsData.name.namePart;
            if (typeof nameParts === 'string') {
                elCreator.push(nameParts);
            } else if (nameParts.length > 0) {
                var fullcreator = "";
                for (var w = 0; w < nameParts.length; w++) {
                    if (nameParts[w].content) {
                        fullcreator += nameParts[w].content;
                        if (w + 1 < nameParts.length) {
                            fullcreator += " ";
                        }
                    }
                }
                //elCreator.push(fullcreator);
                //console.log(fullcreator)
            }
        }
        //}

        if ((!dcData || !dcData.dc_subject) && modsData.subject) {
            /*
             if(modsData.subject.geographic && typeof modsData.subject.geographic === 'string'){
             ret.lugar = modsData.subject.geographic;
             }
             */
            var kws = modsData.subject;
            //print("modsData.subject:"+kws.class+" "+(kws instanceof java.util.ArrayList))

            if (kws && typeof kws == 'object' && kws instanceof org.semanticwb.datamanager.DataList && kws.length > 0) {
                for (var j = 0; j < kws.length; j++) {
                    var thiskw = kws[j];
                    if (thiskw.topic && typeof thiskw.topic == 'string') {
                        var keylist = thiskw.topic;
                        if (keylist.indexOf(',') > -1) {
                            var arrklist = keylist.split(',');
                            for (var i = 0; i < arrklist.length; i++) {
                                if (elkeys.indexOf(arrklist[i]) == -1) {
                                    elkeys.push(arrklist[i]);
                                }
                            }
                        } else if (keylist.indexOf("--") > -1) {
                            var arrklist = keylist.split("--");
                            for (var i = 0; i < arrklist.length; i++) {
                                if (elkeys.indexOf(arrklist[i]) == -1) {
                                    elkeys.push(arrklist[i]);
                                }
                            }
                        } else {
                            if (elkeys.indexOf(keylist) == -1) {
                                elkeys.push(keylist);
                            }
                        }

                    } else if (thiskw.topic && thiskw.topic instanceof org.semanticwb.datamanager.DataList && typeof thiskw.topic == 'object' && thiskw.topic.length > 0) {
                        for (var k = 0; k < thiskw.topic.length; k++) {
                            var keylist = thiskw.topic[k];
                            if (keylist.indexOf(',') > -1) {
                                var arrklist = keylist.split(',');
                                for (var i = 0; i < arrklist.length; i++) {
                                    if (elkeys.indexOf(arrklist[i]) == -1) {
                                        elkeys.push(arrklist[i]);
                                    }
                                }
                            } else if (keylist.indexOf("--") > -1) {
                                var arrklist = keylist.split("--");
                                for (var i = 0; i < arrklist.length; i++) {
                                    if (elkeys.indexOf(arrklist[i]) == -1) {
                                        elkeys.push(arrklist[i]);
                                    }
                                }
                            } else {
                                if (elkeys.indexOf(keylist) == -1) {
                                    elkeys.push(keylist);
                                }
                            }
                        }
                    }
                }
            }
        }

    }

    if (ret.datecreated === undefined && header.datestamp) {
        ret.datecreated = {"format": "", "value": header.datestamp};
    }

    if (elDescrip.length === 0) {
        elDescrip.push("");
    }

    if (elCreator.length === 0) {
        elCreator.push("Anónimo");
    }

    ret.identifier = idArray;
    ret.recordtitle = elTitle;
    ret.resourcetype = elType;
    ret.collection = elCollection;
    if (ret.holder == undefined) {
        arrHolder.push("Instituto Nacional de Antropología e Historia");
        ret.holder = arrHolder;
    }
    if (ret.publisher == undefined) {
        ret.publisher = "Instituto Nacional de Antropología e Historia";
    }
    if (ret.generator == undefined) {
        elGenerator.push("Instituto Nacional de Antropología e Historia");
        ret.generator = elGenerator;
    }
    if (ret.datecreated) {
        ret.timelinedate = ret.datecreated;
    }
    ret.oaiid = data.oaiid;
    ret.description = elDescrip;
    ret.creator = elCreator;
    ret.indexcreated = Date.now();
    ret.keywords = elkeys;

    return ret;
}