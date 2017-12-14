function(data) {
    var ret = {};
    var missing = [];
    var oreData = data.record.metadata.entry;
    /*Identificadores - primer identificador es el del repositorio*/
    var idArray = [];
    idArray.push({type: "oai", value: data.record.header.identifier, preferred: true});
    ret.id = idArray;
    /*tipo de bien cultural*/
    missing.push("type");
    /*titulos*/
    var titleArray = new Array();
    if (oreData.title) {
        titleArray.push(oreData.title);
    }
    if (titleArray.length > 0) {
        ret.title = titleArray;
    } else {
        missing.push("title");
    }
    /*objeto digital*/
    var digitalObjcts = new Array();
    var urlLicense = "";
    for (var i=0; i<oreData.oretriples.rdf_Description.length; i++) {
        var element = oreData.oretriples.rdf_Description[i];
        if (element.dcterms_description === "ORIGINAL") {
            digitalObjcts.push({
                    url : element.rdf_about
                });
        }
        if (urlLicense === "" && element.dcterms_description === "LICENSE") {
            urlLicense = element.rdf_about ? element.rdf_about : "";
        }
    }
    if (digitalObjcts.length > 0) {
        for (var j=0; j<oreData.link.length; j++) {
            var digObj = oreData.link[j];
            if (digObj.type && digObj.title && digObj.href) {
                for (var k=0; k<digitalObjcts.length; k++) {
                    if (digObj.href === digitalObjcts[k].url) {
                        digitalObjcts[k].format = digObj.type;
                        digitalObjcts[k].rights = urlLicense;
                    }
                }
            }
        }
        if (urlLicense === "") {
            missing.push("digitalObject.rights");
        }
        ret.digitalObject = digitalObjcts;
    } else {
        missing.push("digitalObject");
    }
    /*creadores*/
    var creators = new Array();
    if (oreData.author) {
        if (oreData.author[0] !== null) {
            for (var i=0; i<oreData.author.length; i++) {
                creators.push(oreData.author[i].name);
            }
        } else {
            creators.push(oreData.author.name);
        }
    }
    if (creators.length > 0) {
        ret.creator = creators;
    } else {
        missing.push("creator");
    }
    /*fecha de creacion*/
    if (oreData.updated) {
        var thisDate = null;
        try {
            thisDate = new Date(oreData.updated);
            ret.dateCreated = thisDate.toISOString();
        } catch(err) {
            ret.periodCreated = oreData.updated;
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
