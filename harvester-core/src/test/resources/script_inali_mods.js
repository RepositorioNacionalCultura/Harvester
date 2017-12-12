function(data) {
    var ret = {};
    var idArray = new Array();
    var missing = [];
    var modsData = data.record.metadata.mods;
    /*Identificadores - primer identificador es el del repositorio*/
    idArray.push({type: "oai", value: data.record.header.identifier, preferred: true});
    if (modsData.identifier) {
        if (modsData.identifier[0] !== null) {
            for (var x=0; x<modsData.identifier.length; x++) {
                idArray.push({type: modsData.identifier[x].type, value: modsData.identifier[x].content});
            }
        } else {
            idArray.push({type: modsData.identifier.type, value: modsData.identifier.content});
        }
    }
    ret.id = idArray;
    
    /*tipo de bien cultural*/
    var typeArray = [];
    if (modsData.genre) {
        if (typeof modsData.genre === "object") {
            typeArray = modsData.genre;
        } else {
            typeArray.push(modsData.genre);
        }
        ret.type = typeArray;
    } else {
        missing.push("type");
    }
    /*titulos*/
    var titleArray = new Array();
    if (modsData.titleInfo) {
        var completeTitle = "";
        if (modsData.titleInfo.nonSort) {
            completeTitle = modsData.titleInfo.nonSort + " ";
        }
        if (modsData.titleInfo.title) {
            completeTitle = completeTitle + modsData.titleInfo.title + " ";
        }
        if (modsData.titleInfo.partNumber) {
           completeTitle = modsData.titleInfo.title.partNumber + " ";
        }
        if (modsData.titleInfo.partName) {
           completeTitle = modsData.titleInfo.title.partName;
        }
        titleArray.push(completeTitle.trim());
        
        if (modsData.titleInfo.subtitle) {
            titleArray.push(modsData.titleInfo.subtitle);
        }
    }
    if (titleArray.length > 0) {
        ret.title = titleArray;
    } else {
        missing.push("title");
    }
    /*objeto digital*/
    var digitalObjcts = new Array();
    digitalObjcts.push({
            url : modsData.identifier.content,
            format : modsData.physicalDescription ? 
                     modsData.physicalDescription.physicalDescription.internetMediaType ?
                     modsData.physicalDescription.physicalDescription.internetMediaType : "" :
                     "",
            rights : modsData.accessCondition ? modsData.accessCondition : ""
        });
    if (digitalObjcts.length > 0) {
        ret.digitalObject = digitalObjcts;
        if (!digitalObjcts[0].url) {
            missing.push("digitalObject.url");
        }
        if (!digitalObjcts[0].format) {
            missing.push("digitalObject.format");
        }
        if (!digitalObjcts[0].rights) {
            missing.push("digitalObject.rights");
        }
    } else {
        missing.push("digitalObject");
    }
    
    /*creadores*/
    var creators = new Array();
    if (modsData.name) {
        if (modsData.name[0] !== null) {
            for (var i=0; i<modsData.name.length; i++) {
                if (modsData.name[i].role === null || 
                        (modsData.name[i].role && modsData.name[i].role.roleTerm &&
                        (modsData.name[i].role.roleTerm === "creator" ||
                         modsData.name[i].role.roleTerm === "author"))) {
                    creators.push(modsData.name[i].namePart);
                }
            }
        } else {
            if (modsData.name.role === null || 
                    (modsData.name.role && modsData.name.role.roleTerm &&
                    (modsData.name.role.roleTerm === "creator" ||
                     modsData.name.role.roleTerm === "author"))) {
                creators.push(modsData.name.namePart);
            }
        }
    }
    if (creators.length > 0) {
        ret.creator = creators;
    } else {
        missing.push("creator");
    }
    /*fecha de creacion*/
    if (modsData.originInfo.dateIssued) {
        var thisDate = null;
        try {
            thisDate = new Date(modsData.originInfo.dateIssued.content);
            ret.dateCreated = thisDate.toISOString();
        } catch(err) {
            ret.periodCreated = modsData.originInfo.dateIssued.content;
        }
    } else if (modsData.originInfo.dateCreated) {
        try {
            thisDate = new Date(modsData.originInfo.dateCreated.content);
            ret.dateCreated = thisDate.toISOString();
        } catch(err) {
            ret.periodCreated = modsData.originInfo.dateCreated.content;
        }
    }
    if (!ret.dateCreated && !ret.periodCreated) {
        missing.push("creator");
    }
    /*resguardante del bien*/
    ret.holder = "Instituto Nacional de Lenguas Indígenas";
    /*datos faltantes*/
    ret.missing = missing;
    return ret;
}
