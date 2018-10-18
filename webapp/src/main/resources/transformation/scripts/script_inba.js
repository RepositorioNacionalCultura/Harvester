function (data) {
/**
INBA Script
**/
    var ret = {};
    var idArray =[];
    var elType = [];
    var elTitle = [];
    var elDescrip = [];
    var elkeys = [];
    var elLang = [];
    var dObjs = [];
    var elCollection = [];
    var elCreator = [];
    var arrHolder = [];
    var urlLicense = "";
    var modsData = data.mods.mods_mods || undefined; 
    var oreData = data.ore.atom_entry || undefined;
    var header = data.header || undefined;
    var missing = [];
    var rightsTitle = "";

    /*Identificadores - primer identificador es el del repositorio*/
    idArray.push({type: "oai", value: data.header.identifier, preferred: true});
    


    if (header && header.setSpec) {
     var colles = header.setSpec;
     if (colles.length>0) {
            for (var i = 0; i < colles.length; i++ ) {
                elCollection.push(colles[i]);
            }
        }
        else {
             elCollection.push(colles);
         }
    } else {
        missing.push("collection");
    }
 
    ret.collection = elCollection;

    if(data && data.oai_dc && data.oai_dc.oai_dc_dc){

    var dcData = data.oai_dc.oai_dc_dc || undefined;

    if (dcData) {


        if (dcData.dc_type){
          
          if(typeof dcData.dc_type === 'string') {
            elType.push(dcData.dc_type);
              //ret.resourcetype = elType;
            
          } else if(dcData.dc_type.length>0){
              for (var i = 0; i < dcData.dc_type.length; i++ ) {
                elType.push(dcData.dc_type[i]);
            }
            //ret.resourcetype = elType;
          }
        }

        var tmpTitle = "";
        if(dcData.dc_title){
            if(typeof dcData.dc_title === 'string') {
                tmpTitle = dcData.dc_title;
                tmpTitle = tmpTitle.replace(new RegExp("´", 'g'),"'");
                tmpTitle = tmpTitle.replace(new RegExp("‘", 'g'),"'");
                tmpTitle = tmpTitle.replace(new RegExp("“", 'g'),'"');
                tmpTitle = tmpTitle.replace(new RegExp("”", 'g'),'"');
                tmpTitle = tmpTitle.replace(new RegExp("`", 'g'),"'");
                elTitle.push({type: "main", value: tmpTitle});
            } else if (Array.isArray(dcData.dc_title) && dcData.dc_title.length>0) {
                for (var i = 0; i < dcData.dc_title.length; i++ ) {
                    tmpTitle = dcData.dc_title[i];
                    tmpTitle = tmpTitle.replace(new RegExp("´", 'g'),"'");
                    tmpTitle = tmpTitle.replace(new RegExp("‘", 'g'),"'");
                    tmpTitle = tmpTitle.replace(new RegExp("“", 'g'),'"');
                    tmpTitle = tmpTitle.replace(new RegExp("”", 'g'),'"');
                    tmpTitle = tmpTitle.replace(new RegExp("`", 'g'),"'");
                    if(i===0){
                        elTitle.push({type: "main", value: tmpTitle});
                    }
                    else {
                        elTitle.push({type: "other", value: tmpTitle});
                    }
                }
            }
        }

        if(dcData.dc_description){
            var fullDescription = "";
            if(typeof dcData.dc_description === 'string') {
                fullDescription = dcData.dc_description;
                fullDescription = fullDescription.replace(new RegExp("´", 'g'),"'");
                fullDescription = fullDescription.replace(new RegExp("‘", 'g'),"'");
                fullDescription = fullDescription.replace(new RegExp("“", 'g'),'"');
                fullDescription = fullDescription.replace(new RegExp("”", 'g'),'"');
                fullDescription = fullDescription.replace(new RegExp("`", 'g'),"'");
                elDescrip.push(fullDescription);
            } else  if (Array.isArray(dcData.dc_description) && dcData.dc_description.length>0) {
                for (var i = 0; i < dcData.dc_description.length; i++ ) {
                    fullDescription += dcData.dc_description[i];
                    fullDescription = fullDescription.replace(new RegExp("´", 'g'),"'");
                    fullDescription = fullDescription.replace(new RegExp("‘", 'g'),"'");
                    fullDescription = fullDescription.replace(new RegExp("“", 'g'),'"');
                    fullDescription = fullDescription.replace(new RegExp("”", 'g'),'"');
                    fullDescription = fullDescription.replace(new RegExp("`", 'g'),"'");
                  if(i+1<dcData.dc_description.length)  {
                    fullDescription += " ";
                  }
                }  
              elDescrip.push(fullDescription);
            } 
        }
        
        if(dcData.dc_subject){
            if(typeof dcData.dc_subject === 'string') {
                var palabras = dcData.dc_subject;
                palabras = palabras.replace(new RegExp("´", 'g'),"'");
                palabras = palabras.replace(new RegExp("‘", 'g'),"'");
                palabras = palabras.replace(new RegExp("“", 'g'),'"');
                palabras = palabras.replace(new RegExp("”", 'g'),'"');
                palabras = palabras.replace(new RegExp("`", 'g'),"'");
                if (palabras.indexOf(',') > -1){ //revisando si son palabras clave separadas por ","
                    var arrklist = palabras.split(',');
                    for(var i = 0; i<arrklist.length; i++){
                        elkeys.push(arrklist[i]);
                    }
                } else {  //es una palabra clave
                    elkeys.push(palabras);
                }
                ret.keywords = elkeys; 
            } else if (Array.isArray(dcData.dc_subject) && dcData.dc_subject.length>0) {
                for (var i = 0; i < dcData.dc_subject.length; i++ ) {
                    elkeys.push(dcData.dc_subject[i]);
                }
                ret.keywords = elkeys;
            } 
        }

        var dc_creators = dcData.dc_creator || undefined;
        if (oreData === undefined && dc_creators) {
            if(typeof dc_creators === 'string') {
                elCreator.push(dc_creators);
            } else if(dc_creators.length>0){
                for (var w = 0; w < dc_creators.length; w++ ) {
                    elCreator.push(dc_creators[w]);
                }
                
            } 
        }
        
        if(dcData.dc_rights){
            if(dcData.dc_rights.length>0){
                rightsTitle = dcData.dc_rights[0];
            }
        }
    }
}

 if (modsData) {

    var mods_keys = modsData.mods_subject || undefined;

    if ((!dcData || !dcData.dc_subject) && mods_keys && typeof mods_keys === "object") {
        if( mods_keys instanceof org.semanticwb.datamanager.DataList && mods_keys.length>0){
            for (var w = 0; w < mods_keys.length; w++ ) {
                elkeys.push(mods_keys[w].mods_topic); 
            }
        } else if(mods_keys.mods_topic && typeof mods_keys.mods_topic === "string"){
            elkeys.push(mods_keys.mods_topic);
        }
        ret.keywords = elkeys; 
    }

    /*AbstracT or Description*/
    var strTitle = "";
    if(modsData.mods_abstract){
        strTitle = modsData.mods_abstract;
        strTitle = strTitle.replace(new RegExp("´", 'g'),"'");
        strTitle = strTitle.replace(new RegExp("‘", 'g'),"'");
        strTitle = strTitle.replace(new RegExp("“", 'g'),'"');
        strTitle = strTitle.replace(new RegExp("”", 'g'),'"');
        strTitle = strTitle.replace(new RegExp("`", 'g'),"'");
        elDescrip.push(strTitle);
    } else {
        missing.push("description");
    }

    /*tipo de bien cultural*/
    if (elType.length===0 && modsData.mods_genre) {
        if(typeof modsData.mods_genre === 'string') {
            elType.push(modsData.mods_genre);
              //ret.resourcetype = elType;
            
          } else if(typeof modsData.mods_genre === 'object' && modsData.mods_genre.length>0){
              for (var i = 0; i < modsData.mods_genre.length; i++ ) {
                elType.push(modsData.mods_genre[i]);
            }
            //ret.resourcetype = elType;
          }     
        
    } else {
        missing.push("resourcetype");
    }

    /*titulos*/
    if (elTitle.length===0 && modsData.mods_titleInfo && modsData.mods_titleInfo === "object") {
        var completeTitle = "";
        if (modsData.mods_titleInfo.nonSort) {
            completeTitle = modsData.mods_titleInfo.nonSort + " ";
        }
        if (modsData.mods_titleInfo.title) {
            completeTitle = completeTitle + modsData.titleInfo.title + " ";
        }
        if (modsData.mods_titleInfo.partNumber) {
           completeTitle = modsData.mods_titleInfo.title.partNumber + " ";
        }
        if (modsData.mods_titleInfo.partName) {
           completeTitle = modsData.mods_titleInfo.title.partName;
        }
        if(completeTitle!==""){
            strTitle = completeTitle;
            strTitle = strTitle.replace(new RegExp("´", 'g'),"'");
            strTitle = strTitle.replace(new RegExp("‘", 'g'),"'");
            strTitle = strTitle.replace(new RegExp("“", 'g'),'"');
            strTitle = strTitle.replace(new RegExp("”", 'g'),'"');
            strTitle = strTitle.replace(new RegExp("`", 'g'),"'");
            elTitle.push({type: "main", value: strTitle.trim()});
        }
        if (modsData.mods_titleInfo.subtitle) {
            strTitle = modsData.mods_titleInfo.subtitle;
            strTitle = strTitle.replace(new RegExp("´", 'g'),"'");
            strTitle = strTitle.replace(new RegExp("‘", 'g'),"'");
            strTitle = strTitle.replace(new RegExp("“", 'g'),'"');
            strTitle = strTitle.replace(new RegExp("”", 'g'),'"');
            strTitle = strTitle.replace(new RegExp("`", 'g'),"'");
            elTitle.push({type: "subtitle", value: strTitle});
        }
    } else {
        if(elTitle.length===0 && modsData.mods_titleInfo.mods_title){
            strTitle = modsData.mods_titleInfo.mods_title;
            strTitle = strTitle.replace(new RegExp("´", 'g'),"'");
            strTitle = strTitle.replace(new RegExp("‘", 'g'),"'");
            strTitle = strTitle.replace(new RegExp("“", 'g'),'"');
            strTitle = strTitle.replace(new RegExp("”", 'g'),'"');
            strTitle = strTitle.replace(new RegExp("`", 'g'),"'");
            elTitle.push({type: "main", value: strTitle});
            
        }
    }

    if (modsData.mods_originInfo && modsData.mods_originInfo.mods_dateIssued) {
        if(modsData.mods_originInfo.mods_dateIssued.encoding && modsData.mods_originInfo.mods_dateIssued.content){            
            ret.datecreated = {format:modsData.mods_originInfo.mods_dateIssued.encoding,value:modsData.mods_originInfo.mods_dateIssued.content};
        } else if(modsData.mods_originInfo.mods_dateIssued.encoding && !modsData.mods_originInfo.mods_dateIssued.content){
            ret.datecreated = {format:"",value:modsData.mods_originInfo.mods_dateIssued.content};
        }      
    }

    var mods_langs = modsData.mods_language || undefined;

    if (mods_langs) {
        if( mods_langs instanceof org.semanticwb.datamanager.DataList && mods_langs.length>0){
            for (var w = 0; w < mods_langs.length; w++ ) {
                elLang.push(mods_langs[w].mods_languageTerm);
            }
            
        } else if(mods_langs.mods_languageTerm){
           elLang.push(mods_langs.mods_languageTerm);
        }
        ret.lang = elLang;
    }

    var mods_names = modsData.mods_name || undefined;

    if (mods_names && oreData===undefined) {
        if( mods_names.length>0){
            for (var w = 0; w < mods_names.length; w++ ) {
                elCreator.push(mods_names[w].mods_namePart);
            }
            
        } else {
           elCreator.push(mods_names);
        }
        //ret.creator = elCreator;
    }
}
if (oreData) {
    /*objeto digital*/
    var oreTrip = oreData.oreatom_triples.rdf_Description || undefined;
    if(oreTrip && oreTrip.length>0){

            for (var i=0; i<oreTrip.length; i++) {
                var props = oreTrip[i];
                if (props.dcterms_description && props.dcterms_description === "ORIGINAL") {

                    dObjs.push({
                            url : props.rdf_about
                        });
                }
                if (props.dcterms_description && props.dcterms_description === "LICENSE") {
                    urlLicense = props.rdf_about ? props.rdf_about : "";
                }
               if (props.dcterms_description && props.dcterms_description === "THUMBNAIL") {
                    ret.resourcethumbnail = props.rdf_about ? props.rdf_about : "";
                }
            }
        }

    if(oreData.xmlns_dcterms){
        rightsTitle = oreData.xmlns_dcterms;
    }    


        var alink = oreData.atom_link || undefined;

            
            if(alink && alink.length>0){
                var loadTypes = false;
                if(elType.length===0) loadTypes = true;
                for (var j=0; j<alink.length; j++) {
                    var digObj = alink[j];
                    if (digObj.type && digObj.title && digObj.href) {
                        for (var k=0; k<dObjs.length; k++) {
                            if (digObj.href === dObjs[k].url) {
                                if(loadTypes){
                                    if (elType.indexOf(digObj.type) == -1) {
                                        elType.push(digObj.type);
                                    }     
                                }
                                var mimetype = {};
                                mimetype.mime = digObj.type;
                                if(digObj.title){
                                    mimetype.name = digObj.title;
                                }
                                dObjs[k].mediatype = mimetype;
                                var o_rights = {};
                                o_rights.url = urlLicense;
                                if(rightsTitle.length>0){
                                    o_rights.rightstitle = rightsTitle;
                                } else {
                                    o_rights.rightstitle = urlLicense;
                                }
                                dObjs[k].rights = o_rights;
                                
                            }
                        }
                    }
                }
            }
 

        var ore_creators = oreData.atom_author || undefined;
        if(ore_creators){
           if(typeof ore_creators === 'string') {
                elCreator.push(ore_creators);
            } else if(ore_creators.length>0){
            for(var l = 0; l<ore_creators.length;l++){
               elCreator.push(ore_creators[l].atom_name); 
            }         
          } else if(typeof ore_creators === 'object') {
                elCreator.push(ore_creators.atom_name);
            } 
        }

    }
    if (!ret.dateCreated && !ret.periodCreated) {
        missing.push("dateCreated");
    }
    /*resguardante del bien*/
    ret.resourcetype = elType;
    ret.digitalObject = dObjs;
    ret.creator = elCreator; 
    ret.oaiid = data.oaiid;
    arrHolder.push("Instituto Nacional de Bellas Artes");
    ret.holder = arrHolder;
    ret.collection = elCollection;
    ret.identifier = idArray;
    //ret.resourcetitle = elTitle;
    ret.recordtitle = elTitle;
    ret.description = elDescrip;
    /*datos faltantes*/
    ret.missing = missing;
    ret.resourcestats= {"views":0};
    var today = Date.now();
    ret.indexcreated = today;
    
    return ret;
}