function(data) {
    var ret = {};
    var idArray = new Array();
    var missing = [];
    var modsData = data.record.metadata.mods;
    /*Identificadores - primer identificador es el del repositorio*/
    idArray.push({type: "oai", value: data.record.header.identifier, preferred: true});
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
    missing.push("digitalObject");
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
        missing.push("dateCreated");
    }
    /*resguardante del bien*/
    ret.holder = "Instituto Nacional de Bellas Artes";

    /*datos faltantes*/
    ret.missing = missing;
    return ret;
}
