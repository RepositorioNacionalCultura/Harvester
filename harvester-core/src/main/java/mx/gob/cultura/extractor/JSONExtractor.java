/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package mx.gob.cultura.extractor;

import com.mongodb.BasicDBObject;
import com.mongodb.BasicDBList;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.model.IndexOptions;
import com.mongodb.client.model.Indexes;
import com.mongodb.util.JSON;
import java.io.File;
import java.io.FileInputStream;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import mx.gob.cultura.commons.Util;

import mx.gob.cultura.indexer.SimpleESIndexer;
import mx.gob.cultura.transformer.DataObjectScriptEngineMapper;
import org.apache.log4j.Logger;
import org.elasticsearch.client.RestHighLevelClient;
import org.semanticwb.datamanager.DataMgr;
import org.semanticwb.datamanager.DataObject;
import org.semanticwb.datamanager.DataObjectIterator;
import org.semanticwb.datamanager.SWBDataSource;
import org.semanticwb.datamanager.SWBScriptEngine;

/**
 *
 * @author juan.fernandez
 */
public class JSONExtractor extends ExtractorBase {

    static Logger log = Logger.getLogger(JSONExtractor.class);
    protected DataObject extractorDef;
    private SWBScriptEngine engine;
    private SWBDataSource dsExtract;
    private boolean extracting;
    private boolean update;
    private STATUS status = STATUS.LOADED;

    public JSONExtractor(String doID, SWBScriptEngine eng) {
        super(doID, eng);
        extractorDef = super.extractorDef;
        engine = super.engine;
        dsExtract = super.dsExtract;
    }

    @Override
    public void start() {
//        System.out.println("canStart(" + canStart() + ")");
        if (canStart()) {
            log.info("JSONExtractor :: Started extractor " + getName());
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
        //return !status.equals("FAILLOAD") && (status.equals("STOPPED") || status.equals("LOADED"));
    }

    @Override
    public String getType() {
        String ret = extractorDef.getString("");
        return ret;
    }

    @Override
    public void extract() throws Exception {
        log.trace("\n\n\n>>>>>>>>>>>> EXTRACTING <<<<<<<<<<<<<<\n\n\n");

        //2017-12-01T13:05:00.000
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");

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
        if (null != pid) {

            if (null != extractorDef) {
                ext_name = extractorDef.getString("name");

                ext_script = extractorDef.getString("script");

                ext_period = extractorDef.getBoolean("periodicity");
                ext_class = extractorDef.getString("class");
                ext_inter = extractorDef.getInt("interval", 0);

                ext_created = extractorDef.getString("created");
                ext_lastExec = extractorDef.getString("lastExecution", null);
                ext_status = extractorDef.getString("status");
                ext_r2harvest = extractorDef.getInt("rows2harvest", -1);
                ext_harvestered = extractorDef.getInt("harvestered", 0);
                ext_r2process = extractorDef.getInt("rows2Processed", -1);
                ext_process = extractorDef.getInt("processed", 0);
                ext_cursor = extractorDef.getInt("cursor", -1);

                DataObject dofile = extractorDef.getDataList("csvfile").getDataObject(0);
                if (null == dofile) {
                    log.error("Error no se encontró archivo JSON.");
                    throw new Exception();
                }

                log.trace("\n\nEmpezando con:....JSON File");

                String name = dofile.getString("name");

                String binaryfilename = dofile.getString("id");
                File f = new File(DataMgr.getApplicationPath() + "/uploadfile/", binaryfilename);
                FileInputStream fin = new FileInputStream(f);

                String nameExt = name.substring(name.lastIndexOf('.'));

                String path = DataMgr.getApplicationPath() + "/uploadfile/";

                String jsf = Util.FILE.readFromStream(fin, "UTF-8").trim();

                StringBuilder jsfa = new StringBuilder();
                if (!jsf.startsWith("[")) {
                    jsfa.append("[");
                }
                jsfa.append(jsf);
                if (!jsf.endsWith("]")) {
                    jsfa.append("]");
                }
                jsf = jsfa.toString();
                //System.out.println("JSON:\n" + jsf);
                HashMap<String, String> hm = Util.SWBForms.loadOccurrences(engine);
                jsf = Util.TEXT.replaceOccurrences(hm, jsf);
                BasicDBList jarr = (BasicDBList) JSON.parse(jsf);

                DB db = Util.MONGODB.getMongoClient().getDB(ext_name.toUpperCase());
                DBCollection objects = db.getCollection("fullobjects");
                objects.createIndex("oaiid");

                extractorDef.put("status", STATUS.STARTED.name());
                extractorDef.put("lastExecution", sdf.format(new Date()));

                dsExtract.updateObj(extractorDef);

                int numextract = 0;
                int numalready = 0;
                //ArrayList<String> arr = new ArrayList();
                String nid = null;
                for (int i = 0; i < jarr.size(); i++) {

                    BasicDBObject jo = (BasicDBObject) jarr.get(i);

                    extractorDef.put("status", STATUS.EXTRACTING.name());
                    extracting = true;
                    dsExtract.updateObj(extractorDef);

                    BasicDBObject jid = (BasicDBObject) ((BasicDBList) jo.get("identifier")).get(0);
                    nid = jid.getString("value");

                    try {

                        DBObject dbres = null;
                        BasicDBObject dbQuery = new BasicDBObject("oaiid", nid);
                        dbres = objects.findOne(dbQuery);

                        if (null == dbres) {
                            numextract++;
                            jo.append("oaiid", nid);
                            objects.insert(jo);
                        } else {
                            numalready++;
                        }

                    } catch (Exception e) {
                        log.error("Error...", e);
                    }
                }

                extractorDef.put("status", STATUS.FINISHED.name());
                extracting = false;
                extractorDef.put("rows2harvest", 0);
                extractorDef.put("cursor", 0);
                extractorDef.put("rows2Processed", 0);

                extractorDef.put("harvestered", numextract);
                extractorDef.put("processed", numextract);
                dsExtract.updateObj(extractorDef);

                log.trace("Finalizando extracción..." + ext_name.toUpperCase() + " ==> Extracted(" + numextract + ")");
            }

            log.trace("\n\n\n>>>>>>>>>> TRANSFORMING <<<<<<<<<<<<<<<<<\n\n\n");
            String idScript = extractorDef.getString("transScript");
            SWBDataSource dsTScript = engine.getDataSource("TransformationScript");
            DataObject doTS = dsTScript.fetchObjById(idScript);
            String scriptsrc = doTS.getString("script");
            ScriptEngineManager factory = new ScriptEngineManager();
            long numItemsIndexed = 0;
            long numItemsDeleted = 0;

            if (null != scriptsrc && scriptsrc.trim().length() > 0 && (getStatus() == STATUS.STOPPED || getStatus() == STATUS.FINISHED
                    || getStatus() == STATUS.LOADED)) {
//            System.out.println("tiene script...");
                extractorDef.put("status", STATUS.PROCESSING.name());
                dsExtract.updateObj(extractorDef);
                ScriptEngine screngine = factory.getEngineByName("JavaScript");
                DataObjectScriptEngineMapper mapper = new DataObjectScriptEngineMapper(screngine, scriptsrc);

                //Generar el nuevo DataObject combinado por cada prefix
                try {
                    //Create index in spanish language
                    IndexOptions opts = new IndexOptions();
                    opts.defaultLanguage("spanish");

                    DB db = ExtractorManager.client.getDB(extractorDef.getString("name").toUpperCase());
                    DBCollection objects = db.getCollection("fullobjects");
                    MongoCollection mcoll = Util.MONGODB.getMongoClient().getDatabase(extractorDef.getString("name").toUpperCase()).getCollection("TransObject");
                    mcoll.createIndex(Indexes.compoundIndex(Indexes.text("identifier.value"), Indexes.text("resourcetitle"), Indexes.text("resourcedescription")), opts);
                    SWBDataSource transobjs = engine.getDataSource("TransObject", extractorDef.getString("name").toUpperCase());

//                System.out.println("encontro DB y colección...");
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
                                continue;
                            }

                            dobj = (DataObject) DataObject.parseJSON(next.toString());
                            String annotationKey = dobj.getString("oaiid", "").replace(":", "_").replace("/", "__");
                            dobj.put("annKey", annotationKey);
                            try {
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
                                //System.out.println("Resultado del Mapeo:....\n" + result);
                                numItemsIndexed++;
                            } catch (Exception e) {
                                log.error("Error en el mapeo...");
                            }

                            if (numItemsIndexed % 1000 == 0 && numItemsIndexed > 0) {
                                log.trace("Items Indexed: " + numItemsIndexed);
                            }
                        }
                        cursor.close();
                        log.trace("Total Items Indexed: " + numItemsIndexed);
                        log.trace("Total Items Deleted: " + numItemsDeleted);

                        //eliminando colección fullobjects
                        objects.drop();
                    } catch (Exception e) {
                        log.error("Error al indexar\n", e);
                    }
                    extractorDef.put("status", STATUS.FINISHED.name());
                    extractorDef.put("indexed", numItemsIndexed);
                    dsExtract.updateObj(extractorDef);

                } catch (Exception e) {
                    log.error("Error al procesar la Base de Datos", e);
                    extractorDef.put("processed", numItemsIndexed);
                    dsExtract.updateObj(extractorDef);
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
        throw new Exception("Method not implemented");
    }

    @Override
    public void index() throws Exception {
        log.trace("\n\n\n>>>>>>>>>> INDEXING <<<<<<<<<<<<<<<<<\n\n\n");
        String ext_fullHoldername = extractorDef.getString("fullHolderName", "N/A");
        SWBDataSource transobjs = engine.getDataSource("TransObject", extractorDef.getString("name").toUpperCase());
        long numItemsIndexed = 0;

        if ((getStatus() == STATUS.STOPPED || getStatus() == STATUS.FINISHED || getStatus() == STATUS.LOADED)) {
            extractorDef.put("status", STATUS.INDEXING.name());
            dsExtract.updateObj(extractorDef);

            try {
//                long objsDeleted = Util.ELASTICSEARCH.deleteObjectsByHolder(ext_fullHoldername);
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
                            next.put("indexcreated", System.currentTimeMillis());
                            // usar indice de "repositorio" para pruebas, el que se utilizará para la aplicación será "cultura"
                            //SimpleESIndexer sesidx = new SimpleESIndexer("test", "bic");
                            SimpleESIndexer sesidx = new SimpleESIndexer("127.0.0.1", 9200, "cultura", "bic");

                            //System.out.println("\n\n\n"+next.toString());
                            sesidx.index(next.toString(), iddo);
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
