function(data) {
    var doURL = "http://mediateca.inah.gob.mx/repositorio/islandora/object/";
    var doURLSuffix = "/datastream/OBJ/download";
    var ret = {};
    var idArray = new Array();
    var elType = new Array();
    var elTitle = new Array();
    var modsData = data.metadata.mods_mods || undefined;
    var dcData = data.metadata.oai_dc_dc || undefined;
    var header = data.header || undefined;

    if (!header || (!modsData && !dcData)) return data;

    idArray.push({type:"oai", value: header.identifier, preferred:true});
    if (dcData) {
        if (dcData.dc_identifier) {
            var dc_ids = dcData.dc_identifier;
            if (dc_ids.length) {
                for (var i = 0; i < dc_ids.length; i++ ) {
                    idArray.push({type: "", value: dc_ids[i].content, preferred:false});
                }
            }
        }

        if (dcData.dc_type && dcData.dc_type.length) {
            for (var i = 0; i < dcData.dc_type.length; i++ ) {
                elType.push(dcData.dc_type[i].content);
            }
        }

        if (dcData.dc_title && dcData.dc_title.content) {
            elTitle.push({type: "dc", value: dcData.dc_title.content});
        }

        if (dcData.dc_description && dcData.dc_description.content) {
            ret.description = dcData.dc_description.content;
        }
    }

    if (modsData) {
        if (modsData.identifier) {
            idArray.push({type: modsData.identifier.type || "", value: modsData.identifier.content, preferred: false});
        }

        if (modsData.typeOfResource) {
            if (elType.indexOf(modsData.typeOfResource) == -1) {
                elType.push(modsData.typeOfResource);
            }
        }

        if (modsData.titleInfo && modsData.titleInfo.title) {
            elTitle.push({type:"mods", value: modsData.titleInfo.title.content});
        }

        if (!ret.description && modsData.abstract && modsData.abstract.content) {
            ret.description = modsData.abstract.content;
        }

        if (modsData.physicalDescription && modsData.physicalDescription.internetMediaType) {
            var objId = header.identifier.substring(header.identifier.lastIndexOf(":")+1, header.identifier.length);
            var url = doURL + objId.replace("_", ":") + doURLSuffix;
            ret.digitalObject = new Array();
            ret.digitalObject.push({url: url, format: modsData.physicalDescription.internetMediaType});
        }
    }

    ret.identifier = idArray;
    ret.title = elTitle;
    ret.type = elType;

    return ret;
}