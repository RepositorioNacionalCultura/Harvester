package mx.gob.cultura.extractor;

import com.mongodb.*;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.model.IndexOptions;
import com.mongodb.client.model.Indexes;
import mx.gob.cultura.indexer.SimpleESIndexer;
import mx.gob.cultura.transformer.DataObjectScriptEngineMapper;
import mx.gob.cultura.commons.Util;
import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.json.XML;
import org.semanticwb.datamanager.*;

import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

/**
 * Extractor implementation for OAI-PMH data sources.
 * @author juan.fernandez
 */
public class OAIExtractor extends ExtractorBase {
    static Logger log = Logger.getLogger(OAIExtractor.class);
    protected DataObject extractorDef;
    private SWBScriptEngine engine;
    private SWBDataSource dsExtract;
    private boolean extracting;
    private boolean update;
    private STATUS status = STATUS.LOADED;

    /**
     *
     * @param doID
     * @param eng
     */
    public OAIExtractor(String doID, SWBScriptEngine eng) {
        super(doID, eng);
        extractorDef = super.extractorDef;
        engine = super.engine;
        dsExtract = super.dsExtract;
    }

    @Override
    public void start() {
//        System.out.println("canStart(" + canStart() + ")");
        if (canStart()) {
            log.info("OAIExtractor :: Started extractor " + getName());
            try {
                extract();
            } catch (Exception ex) {
                log.error("Error starting extractor", ex);
            }
        }
    }

    @Override
    public void stop() {
        status = STATUS.STOPPED;
    }

    @Override
    public STATUS getStatus() {
        return status;
    }

    public void setStatus(String s) {
        status = STATUS.valueOf(s);
    }

    public void setStatus(STATUS s) {
        status = s;
    }

    @Override
    public String getName() {
        if (null != extractorDef) {
            return extractorDef.getString("name");
        }
        return null;
    }

    @Override
    public boolean canStart() {
        return status != STATUS.FAILLOAD && (status == STATUS.STOPPED || status == STATUS.LOADED);
    }

    @Override
    public String getType() {
        String ret = extractorDef.getString("OAIExtractor");
        return ret;
    }

    @Override
    public void extract() throws Exception {
        log.trace("\n\n\n>>>>>>>>>>>> EXTRACTING <<<<<<<<<<<<<<\n\n\n");
        log.trace("DO Extract:"+extractorDef);

        //2017-12-01T13:05:00.000
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
        //DataObject do_extrac = null;
        String ext_name = null;
        String ext_coll = null;
        String ext_url = null;
        String ext_verbs = null;
        String[] ext_prefix = null;
        boolean ext_resTkn = false;
        String ext_resTknVal = null;
        String ext_class = null;
        String ext_script = null;
        boolean ext_period = false;
        int ext_inter = -1;
        String ext_mapeo = null;
        String ext_created = null;
        String ext_lastExec = null;
        String ext_status = null;
        int ext_r2harvest = -1;
        int ext_harvestered = 0;
        int ext_r2process = 0;
        int ext_process = 0;
        int ext_cursor = 0;
        String ext_pfxExtracted = null;
        String ext_pfxActual = null;

        String pid = extractorDef.getId();

        String jsonstr = null;

        String resTkn_str = null;
        String tmpTkn = null;
        String listSize_str = null;
        String cursor_str = null;

        int listSize = 0;
        int cursor = 0;
        int resTkn = 0;

        if (null != pid) {
            //do_extrac = dsExtract.fetchObjById(pid);

            if (null != extractorDef) {
                ext_name = extractorDef.getString("name");
                ext_coll = extractorDef.getString("collection", "objects");
                ext_url = extractorDef.getString("url");
                ext_script = extractorDef.getString("script");
                ext_verbs = extractorDef.getString("verbs");
                DataList dlpfx = extractorDef.getDataList("prefix");
                log.debug("num items:" + dlpfx.size());
                ext_prefix = new String[dlpfx.size()];
                for (int i = 0; i < dlpfx.size(); i++) {
                    ext_prefix[i] = dlpfx.getString(i);
//                    System.out.println("prefix:" + ext_prefix[i]);
                }
                ext_resTkn = extractorDef.getBoolean("resumptionToken", false);
                ext_resTknVal = extractorDef.getString("tokenValue", null);
                ext_period = extractorDef.getBoolean("periodicity");
                ext_class = extractorDef.getString("class");
                ext_inter = extractorDef.getInt("interval", 0);
                ext_mapeo = extractorDef.getString("mapeo");
                ext_created = extractorDef.getString("created");
                ext_lastExec = extractorDef.getString("lastExecution", null);
                ext_status = extractorDef.getString("status");
                ext_r2harvest = extractorDef.getInt("rows2harvest", -1);
                ext_harvestered = extractorDef.getInt("harvestered", 0);
                ext_r2process = extractorDef.getInt("rows2Processed", -1);
                ext_process = extractorDef.getInt("processed", 0);
                ext_cursor = extractorDef.getInt("cursor", -1);
                ext_pfxExtracted = extractorDef.getString("pfxExtracted", null);
                ext_pfxActual = extractorDef.getString("pfxActual", null);

                String[] pfxDone = null;
                HashMap<String, String> hmPfxs = new HashMap();

                if (ext_pfxExtracted != null) {
                    if (ext_pfxExtracted.contains(",")) {
                        pfxDone = ext_pfxExtracted.split(",");
                    } else {
                        pfxDone = new String[1];
                        pfxDone[0] = ext_pfxExtracted;
                    }
                    for (String pfx : pfxDone) {
                        hmPfxs.put(pfx, pfx);
                    }
                }

                extractorDef.put("status", STATUS.STARTED.name());
                dsExtract.updateObj(extractorDef);

                DB db = ExtractorManager.client.getDB(ext_name.toUpperCase());

                if (null != ext_lastExec) {
                    ext_lastExec = ext_lastExec.replace(" ", "T");
                }

                HashMap<String, String> hm = Util.SWBForms.loadOccurrences(engine);
                boolean isResumeExtract = false;
                if (ext_pfxActual != null) {
                    isResumeExtract = true;
                }

                if (null != ext_prefix) {
                    try {
                        long itemsExtracted = 0;
                        Date startTime = new Date();
                        for (String pfx : ext_prefix) {

                            if (hmPfxs.get(pfx) != null) {
                                continue;
                            }

                            if (getStatus() == STATUS.STOPPED || getStatus() == STATUS.ABORTED) {
                                break;
                            }
                            log.trace("\n\nEmpezando con:...." + pfx);
                            // creando la colección por prefijo
                            DBCollection objects = db.getCollection(pfx);
                            objects.createIndex("oaiid");

                            String urlConn = ext_url + "?verb=" + ext_verbs + "&metadataPrefix=" + pfx;
                            urlConn = ext_url + "?verb=" + ext_verbs + "&metadataPrefix=" + pfx;
                            if (update && null != ext_lastExec) {
                                urlConn = ext_url + "?verb=" + ext_verbs + "&metadataPrefix=" + pfx + "&from=" + ext_lastExec;
                            }

                            if (isResumeExtract || (null != ext_status && ext_status.equals("EXTRACTING") || (null != ext_resTknVal && !ext_resTknVal.equals("0") && ext_resTknVal.length() > 0)) && resTkn_str != null) {
                                urlConn = ext_url + "?verb=" + ext_verbs + "&resumptionToken=" + resTkn_str;
                                resTkn_str = ext_resTknVal;
                                listSize = ext_r2harvest;
                                cursor = ext_cursor;
                            }

                            URL theUrl = new URL(urlConn);

//                            System.out.println("Making request " + theUrl.toString());
                            extractorDef.put("lastExecution", sdf.format(new Date()));
                            extractorDef.put("pfxActual", pfx);
                            dsExtract.updateObj(extractorDef);

                            boolean tknFound = false;
                            int numextract = 0;
                            int numalready = 0;
                            int retries = 0;
                            log.trace("Empezando extracción..." + ext_name.toUpperCase());
                            do {
                                tknFound = false;
                                try {

                                    jsonstr = Util.makeRequest(theUrl, true);
                                    if (jsonstr != null && jsonstr.startsWith("#Error") && jsonstr.endsWith("#")) {
                                        log.debug(jsonstr.substring(1, jsonstr.length() - 1));
                                        break;
                                    }
                                    jsonstr = Util.TEXT.replaceOccurrences(hm, jsonstr);

                                    if (jsonstr.contains("resumptionToken")) {
                                        tknFound = true;
                                    }

                                    JSONObject json = XML.toJSONObject(jsonstr,true);
                                    //System.out.println("\n\n\nJSON:" + json.toString());
                                    JSONObject jsonroot = json.getJSONObject("OAI-PMH");

                                    Object objtmp = null;
                                    try {
                                        objtmp = jsonroot.get("ListRecords");
                                    } catch (Exception excp) {

                                    }
                                    if (null == objtmp) {
                                        retries++;
                                        continue;
                                    }
                                    JSONObject jsonLst = jsonroot.getJSONObject("ListRecords");

                                    JSONObject jsonTkn = null;
                                    if (tknFound) {

                                        try {
                                            //System.out.println("Buscando token...");
                                            jsonTkn = jsonLst.getJSONObject("resumptionToken");

                                            if (null != jsonTkn) {
                                                //System.out.println("Token encontrado...");
                                                resTkn_str = jsonTkn.getString("content");
                                                listSize_str = jsonTkn.getString("completeListSize");
                                                cursor_str = jsonTkn.getString("cursor");
                                                if (listSize == 0) {
                                                    try {
                                                        listSize = Integer.parseInt(listSize_str);
                                                    } catch (Exception e) {
                                                        log.error("Error: Invalid records size number", e);
                                                        listSize = -1;
                                                    }
                                                }
                                                try {
                                                    cursor = Integer.parseInt(cursor_str);
                                                } catch (Exception e) {
                                                    log.error("Error: Invalid cursor size number", e);
                                                    cursor = -1;
                                                }
                                            }

                                        } catch (Exception e) {
                                            //System.out.println("Error...No Resumption Token found.");
                                            //e.printStackTrace();
                                            resTkn_str = null;
                                            listSize_str = null;
                                            cursor_str = null;
                                        }
                                    }

                                    JSONArray jsonRd = jsonLst.getJSONArray("record");

                                    extractorDef.put("status", STATUS.EXTRACTING.name());
                                    extracting = true;
                                    extractorDef.put("rows2harvest", (listSize - numextract));
                                    extractorDef.put("cursor", cursor);
                                    extractorDef.put("rows2Processed", listSize);
                                    extractorDef.put("processed", 0);
                                    dsExtract.updateObj(extractorDef);

                                    if (listSize > (numextract + numalready)) {

                                        String nid = null;
                                        for (int i = 0; i < jsonRd.length(); i++) {
                                            JSONObject jsonhdr = jsonRd.getJSONObject(i).getJSONObject("header");
                                            nid = jsonhdr.getString("identifier");

                                            try {

                                                DBObject dbres = null;
                                                if (isResumeExtract) {
                                                    BasicDBObject dbQuery = new BasicDBObject("oaiid", nid);
                                                    dbres = objects.findOne(dbQuery);
                                                }
                                                if (null == dbres) {
                                                    numextract++;
                                                    String nodeAsString = jsonRd.getJSONObject(i).toString();
                                                    DataObject rec = new DataObject();
                                                    rec.put("oaiid", nid);
                                                    rec.put("body", DataObject.parseJSON(nodeAsString));
                                                    BasicDBObject bjson = Util.SWBForms.toBasicDBObject(rec);
                                                    objects.insert(bjson);
                                                    itemsExtracted++;
                                                } else {
                                                    numalready++;
//                                        //        System.out.println("Already Extracted...");
                                                }

                                            } catch (Exception e) {
                                                log.error("Error...", e);
                                            }
                                        }
                                    } else {
                                        setStatus(STATUS.STOPPED);
                                    }

                                    if (resTkn_str != null) {
                                        tmpTkn = resTkn_str;
                                        extractorDef.put("tokenValue", resTkn_str);
                                        theUrl = new URL(ext_url + "?verb=" + ext_verbs + "&resumptionToken=" + resTkn_str);
                                        resTkn_str = null;
                                    }
                                    extractorDef.put("harvestered", numextract);
                                    dsExtract.updateObj(extractorDef);

                                } catch (JSONException jex) {
                                    Thread.sleep(5000);
                                    retries++;
                                    log.error(jex);
                                }

                                if (getStatus() == STATUS.STOPPED || getStatus() == STATUS.ABORTED) {
                                    break;
                                }
                                if (numextract % 1000 == 0 && numextract > 0) {
                                    log.trace("Extracted ==>" + numextract);
                                }
                                if (numalready % 1000 == 0 && numalready > 0) {
                                    log.trace("Already ==>" + numalready + "(" + listSize + ")");
                                }
                                if (retries > 0) {
                                    log.trace("Retries ==>" + retries);
                                }
                                if (itemsExtracted % 1000 == 0 && itemsExtracted > 0) {
                                    log.trace("Retries(" + retries + ")Token(" + tmpTkn + "), List(" + listSize + "), Extracted(" + numextract + "),Existing(" + numalready + "), Total Extracted(" + itemsExtracted + ")");
                                }
                                tmpTkn = null;
                            } while (retries < 5 && tknFound && listSize > (numextract + numalready));  //(listSize > numextract && listSize > numalready) && 
                            update = false;
                            //extractorDef.put("status", "STOPPED");
                            //extracting = false;
                            if (null == ext_pfxExtracted) {
                                ext_pfxExtracted = pfx;
                            } else {
                                ext_pfxExtracted = ext_pfxExtracted + "," + pfx;
                            }
                            extractorDef.put("pfxExtracted", ext_pfxExtracted);
                            dsExtract.updateObj(extractorDef);
                            ExtractorManager.getInstance().loadExtractor(extractorDef);
                            log.trace("Finalizando extracción..." + ext_name.toUpperCase() + " ==> Extracted(" + numextract + "), EXISTING(" + numalready + ")");
                            numextract = 0;
                            numalready = 0;
                            listSize = 0;
                            resTkn_str = null;
                            isResumeExtract = false;

                        }
                        extractorDef.put("harvestered", itemsExtracted);
                        extractorDef.put("rows2Processed", itemsExtracted);
                        extractorDef.put("status", getStatus().name());
                        if (getStatus() == STATUS.STOPPED) {
                            extracting = false;
                        }
                        extractorDef.put("rows2harvest", 0);
                        extractorDef.put("cursor", 0);
                        extractorDef.put("pfxExtracted", null);
                        extractorDef.put("tokenValue", null);
                        extractorDef.put("pfxActual", null);
                        dsExtract.updateObj(extractorDef);
                        ExtractorManager.getInstance().loadExtractor(extractorDef);
                    } catch (Exception e) {
                        log.error("Error extracción de metadatos", e);
                    }
                }
            }
        }
    }

    @Override
    public boolean replace() {
        boolean ret = false;
        try {
            DB db = ExtractorManager.client.getDB(extractorDef.getString("name").toUpperCase());
            db.dropDatabase();
//            String collName = extractorDef.getString("collection", "objects");
//            if (db.collectionExists(collName)) {
//                db.getCollection(collName).drop();
//            }
            ret = true;
            extract();
        } catch (Exception e) {
            log.error("Error al tratar de borrar la Base de Datos", e);
        }
        return ret;
    }

    @Override
    /**
     * Método para traer los registros a partir de la última ejecución, revisar
     * como pedir los registros por fecha
     */
    public boolean update() {
        boolean ret = false;
        update = true;
        try {
            extract();
            ret = true;
        } catch (Exception e) {
            log.error(e);
        }
        return ret;
    }

    @Override
    public String getScript() {
        String ret = extractorDef.getString("script");
        return ret;
    }

    @Override
    public void process() throws Exception {
        log.trace("\n\n\n>>>>>>>>>> PROCESSING <<<<<<<<<<<<<<<<<\n\n\n");

        long numItems = 0;
        long numAlready = 0;
        
        extractorDef.put("status", STATUS.PROCESSING.name());
        dsExtract.updateObj(extractorDef);

        DataList dlpfx = extractorDef.getDataList("prefix");
//        System.out.println("num items:" + dlpfx.size());
        String[] ext_prefix = new String[dlpfx.size()];
        //Generar el nuevo DataObject combinado por cada prefix
        try {
            DB db = ExtractorManager.client.getDB(extractorDef.getString("name").toUpperCase());
            DBCollection objects = db.getCollection("fullobjects");
            objects.createIndex("oaiid");
//                HashMap<String, DataObject> hmfull = new HashMap();
            boolean hdrLoaded = false;
            DataObject dobj = null;

            for (int i = 0; i < dlpfx.size(); i++) {
                if (getStatus() == STATUS.STOPPED || getStatus() == STATUS.ABORTED) {
                    break;
                }
                String pfx = dlpfx.getString(i).trim();
                log.debug("Revisando colección: " + pfx);
                try {
                    DBCollection datasource = db.getCollection(pfx);
                    DBCursor cursor = datasource.find();
                    log.debug(pfx + " cursor size: " + (null != cursor ? cursor.count() : "NULO"));

                    while (null != cursor && cursor.hasNext()) {
                        if (getStatus() == STATUS.STOPPED || getStatus() == STATUS.ABORTED) {
                            break;
                        }
                        DBObject next = cursor.next();
                        String key = (String) next.get("oaiid");
                        boolean isDODeleted = false;
                        boolean add2DB = false;
                        hdrLoaded = false;
                        //Revisar si existe en fullobjects
                        BasicDBObject dbQuery = new BasicDBObject("oaiid", key);
                        DBObject dbres = objects.findOne(dbQuery);
                        if (null == dbres) {
                            add2DB = true;
                            dobj = new DataObject();
                            dobj.put("oaiid", key);
                        }
                        if (null != dbres) {
                            //Existe en la DB

                            dobj = (DataObject) DataObject.parseJSON(dbres.toString()); //hmfull.get(key.trim());
                            if (dobj.get("header") != null) {
                                hdrLoaded = true;
                            }
                            if (dobj.get(pfx) != null) {
                                numAlready++;
                                continue;
                            }
                        }

                        DataObject tmpObj = (DataObject) DataObject.parseJSON(next.get("body").toString());
                        if (!hdrLoaded) {
                            if (null != tmpObj) {
                                Object header = tmpObj.get("header");
                                if (null != header) {
                                    dobj.put("header", header);
                                    hdrLoaded = true;
                                }
                            }
                        }
                        Object metadata = tmpObj.get("metadata");
                        if (null != metadata) {
                            dobj.put(pfx, metadata);
                            //System.out.println(metadata.toString());
                        } else {
                            DataObject doHdr = (DataObject) DataObject.parseJSON(tmpObj.get("header").toString());
                            if (null != doHdr) {
                                if (doHdr.getString("status") != null) {
                                    dobj.put("status", doHdr.getString("status"));
                                    if (doHdr.getString("status").equals("deleted")) {
                                        isDODeleted = true;
                                    }
                                }
                            }
                        }
                        //hmfull.put(key.trim(), dobj);

                        // Esta parte sólo es para verificar como forma los objetos completos.
                        BasicDBObject bjson = Util.SWBForms.toBasicDBObject(dobj);
                        if (add2DB) {
                            objects.insert(bjson);
                        } else {
                            objects.update(dbQuery, bjson);
                        }
                        numItems++;
                        if (numItems % 1000 == 0 && numItems > 0) {
                            log.trace("Items Processed: " + numItems);
                        }
                    }
                    try {
                        cursor.close();
                    } catch (Exception e) {
                    }

                } catch (Exception e) {
                    log.error("Error al cargar el DataSource. ", e);
                }
            }

            extractorDef.put("rows2Processed", 0);
            extractorDef.put("processed", numItems);
            extractorDef.put("status", STATUS.FINISHED.name());
            dsExtract.updateObj(extractorDef);

        } catch (Exception e) {
            log.error("Error al procesar la Base de Datos", e);
            extractorDef.put("processed", numItems);
            dsExtract.updateObj(extractorDef);
        }

        log.trace("\n\n\n>>>>>>>>>> TRANSFORMING <<<<<<<<<<<<<<<<<\n\n\n");
        String idScript = extractorDef.getString("transScript");
        SWBDataSource dsTScript = engine.getDataSource("TransformationScript");
        DataObject doTS = dsTScript.fetchObjById(idScript);
        String scriptsrc = doTS.getString("script");
        ScriptEngineManager factory = new ScriptEngineManager();
        long numItemsIndexed = 0;
        long numItemsDeleted = 0;
        String oaiKey = null;

        if (null != scriptsrc && scriptsrc.trim().length() > 0 && (getStatus() == STATUS.STOPPED ||
                getStatus() == STATUS.FINISHED || getStatus() == STATUS.LOADED)) {

            extractorDef.put("status", STATUS.PROCESSING.name());
            dsExtract.updateObj(extractorDef);
            ScriptEngine scrptengine = factory.getEngineByName("JavaScript");
            DataObjectScriptEngineMapper mapper = new DataObjectScriptEngineMapper(scrptengine, scriptsrc);
            List<String> list = null;
            //Generar el nuevo DataObject combinado por cada prefix
            try {
                //Create index in spanish language
                IndexOptions opts = new IndexOptions();
                opts.defaultLanguage("spanish");

                DB db = ExtractorManager.client.getDB(extractorDef.getString("name").toUpperCase());
                DBCollection objects = db.getCollection("fullobjects");
                MongoCollection mcoll = Util.MONGODB.getMongoClient().getDatabase(extractorDef.getString("name").toUpperCase()).getCollection("TransObject");
                mcoll.createIndex(Indexes.compoundIndex(Indexes.text("identifier"),Indexes.text("resourcetitle"),Indexes.text("resourcedescription")), opts);
                SWBDataSource transobjs = engine.getDataSource("TransObject", extractorDef.getString("name").toUpperCase());
                
                DataObject dobj = null;

                try {
                    DBCursor cursor = objects.find();
                    while (null != cursor && cursor.hasNext()) {
                        if (getStatus() == STATUS.STOPPED || getStatus() == STATUS.ABORTED) {
                            break;
                        }
                        DBObject next = cursor.next();

                        //Se tiene que hacer el llamado al proceso de transformación validando si el objeto está eliminado "deleted"
                        String str_deleted = (String) next.get("status");
                        if (null != str_deleted && str_deleted.equals("deleted")) {
                            numItemsDeleted++;
                            //Si está eliminado no hace nada, continúa con el siguiente
                            continue;
                        }

                        dobj = (DataObject) DataObject.parseJSON(next.toString());
                        oaiKey = dobj.getString("oaiid");
                        //System.out.println("DataObject: " + dobj);
                        try {

                            //Transformación del DataObject
                            DataObject result = mapper.map(dobj);
                            HashMap<String, String> hmmaptable = Util.SWBForms.loadExtractorMapTable(engine, extractorDef);
                            // Mapeo de propiedades definidas en la tabla con los a encontrar en los catálogos 
                            // Se actualizan las propiedades del DataObject
                            if (!hmmaptable.isEmpty()) {
                                Util.SWBForms.findProps(result, hmmaptable, engine);
                            }
                            //System.out.println("Antes de agregar el objeto");
                            result.put("forIndex", true);
                            DataObject dobjnew = transobjs.addObj(result);
                            //System.out.println("\n===============================================\nResultado del Mapeo:....\n==========================================\n" + result);
                            numItemsIndexed++;
                        } catch (Exception e) {
                            log.error("Error en el mapeo e indexación..."+oaiKey, e);
                            System.out.println("ERROR--in: \n\n================================\n"+e.toString());
                        }

                        if (numItemsIndexed % 1000 == 0 && numItemsIndexed > 0) {
                            log.trace("Items Transformed: " + numItemsIndexed);
                        }

                    }
                    cursor.close();
                    log.trace("Total Items Transformed: " + numItemsIndexed);
                    log.trace("Total Items Deleted: " + numItemsDeleted);
                } catch (Exception e) {
                    log.error("Error en la transformación y mapeo\n", e);
                    System.out.println("ERROR--ext: \n\n================================\n"+e.toString());
                }
                extractorDef.put("status", STATUS.FINISHED.name());
                extractorDef.put("transformed", numItemsIndexed);
                dsExtract.updateObj(extractorDef);
                //eliminando colección fullobjects
                //objects.drop();

            } catch (Exception e) {
                log.error("Error al procesar la Base de Datos", e);
                extractorDef.put("transformed", numItemsIndexed);
                dsExtract.updateObj(extractorDef);
            }
        }

    }

    @Override
    public void index() throws Exception {
        log.trace("\n\n\n>>>>>>>>>> INDEXING <<<<<<<<<<<<<<<<<\n\n\n");
        SWBDataSource transobjs = engine.getDataSource("TransObject", extractorDef.getString("name").toUpperCase());
        long numItemsIndexed = 0;

        if ((getStatus() == STATUS.STOPPED || getStatus() == STATUS.FINISHED || getStatus() == STATUS.LOADED)) {
            extractorDef.put("status", STATUS.INDEXING.name());
            dsExtract.updateObj(extractorDef);

            try {
                DataObjectIterator cursor = transobjs.find();
                while (null != cursor && cursor.hasNext()) {
                    if (getStatus() == STATUS.STOPPED || getStatus() == STATUS.ABORTED) {
                        break;
                    }
                    DataObject next = cursor.next();
                    if (next.getBoolean("forIndex", true)) {
                        try {
                            String iddo = next.getId();
                            next.remove("_id");
                            // usar indice de "repositorio" para pruebas, el que se utilizará para la aplicación será "cultura"
                            //SimpleESIndexer sesidx = new SimpleESIndexer("test", "bic");
                            //SimpleESIndexer sesidx = new SimpleESIndexer("127.0.0.1", 9200, "repositorio", "bic");
                            SimpleESIndexer sesidx = new SimpleESIndexer("127.0.0.1", 9200, "cultura", "bic");
                            //System.out.println("\n\n\n"+next.toString());
                            sesidx.index(next.toString(),iddo);
                            numItemsIndexed++;
                        } catch (Exception e) {
                            log.error("Error en el mapeo e indexación...", e);
                        }
                    }
                    if (numItemsIndexed % 1000 == 0 && numItemsIndexed > 0) {
                        log.trace("Items Indexed: " + numItemsIndexed);
                    }
                    //Sólo para pruebas
//                    if (numItemsIndexed == 10) {
//                        break;
//                    }
                }
                cursor.close();
                log.trace("Total Items Indexed: " + numItemsIndexed);
                extractorDef.put("status", STATUS.FINISHED.name());
                extractorDef.put("indexed", numItemsIndexed);
                dsExtract.updateObj(extractorDef);
            } catch (Exception e) {
                log.error("Error al indexar\n", e);
                extractorDef.put("indexed", numItemsIndexed);
                dsExtract.updateObj(extractorDef);
            }

        }
    }

    public DataObject getDefinitionObject() {
        return extractorDef;
    }

}
