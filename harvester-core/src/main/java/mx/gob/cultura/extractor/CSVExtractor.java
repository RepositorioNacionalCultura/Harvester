package mx.gob.cultura.extractor;

import com.mongodb.*;
import mx.gob.cultura.commons.Util;
import mx.gob.cultura.indexer.SimpleESIndexer;
import mx.gob.cultura.transformer.DataObjectScriptEngineMapper;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVRecord;
import org.apache.log4j.Logger;
import org.semanticwb.datamanager.*;

import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStreamReader;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;

/**
 * Extractor implementation that reads and processes a CSV file.
 * @author juan.fernandez
 */
public class CSVExtractor extends ExtractorBase {
    static final Logger log = Logger.getLogger(CSVExtractor.class);
    protected DataObject extractorDef;
    private SWBScriptEngine engine;
    private SWBDataSource dsExtract;
    private boolean extracting;
    private boolean update;

    private STATUS status = STATUS.LOADED;

    /**
     * Constructor. Creates a new instance of {@link CSVExtractor}.
     * @param doID Identifier of {@link DataObject} with extractor definition.
     * @param eng {@link SWBScriptEngine} object to use.
     */
    public CSVExtractor(String doID, SWBScriptEngine eng) {
        super(doID, eng);
        extractorDef = super.extractorDef;
        engine = super.engine;
        dsExtract = super.dsExtract;
    }

    @Override
    public void start() {
        //System.out.println("canStart(" + canStart() + ")");
        if (canStart()) {
            log.info("CSVExtractor :: Started extractor " + getName());
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
                    log.error("Error no se encontró archivo CSV.");
                    throw new Exception();
                }

                log.trace("\n\nEmpezando con:....CSV File");

                String name = dofile.getString("name");

                String binaryfilename = dofile.getString("id");
                File f = new File(DataMgr.getApplicationPath() + "/uploadfile/", binaryfilename);
                FileInputStream fin = new FileInputStream(f);

                String nameExt = name.substring(name.lastIndexOf('.'));

                String path = DataMgr.getApplicationPath() + "/uploadfile/";
                InputStreamReader in = new InputStreamReader(fin, "utf-8");

                DB db = ExtractorManager.client.getDB(ext_name.toUpperCase());
                DBCollection objects = db.getCollection("fullobjects");
                objects.createIndex("oaiid");

                extractorDef.put("status", STATUS.STARTED.name());
                extractorDef.put("lastExecution", sdf.format(new Date()));

                dsExtract.updateObj(extractorDef);
                HashMap<String, String> hm = Util.SWBForms.loadOccurrences(engine);
                int r = 0;
                ArrayList<String> arr = new ArrayList();
                for (CSVRecord record : CSVFormat.DEFAULT.parse(in)) {

                    extractorDef.put("status", STATUS.EXTRACTING.name());
                    extracting = true;
                    dsExtract.updateObj(extractorDef);


                    //arreglo con el nombre de las columnas
                    if (r == 0) {
                        int c = 0;
                        for (String field : record) {
                            if (field.trim().length() > 0) {
                                if (c == 0) {
                                    arr.add(c, "oaiid");
                                } else {
                                    field = field.toLowerCase().trim();
                                    field = Util.TEXT.replaceSpecialCharacters(field, true);
                                    field = Util.TEXT.replaceOccurrences(hm, field.trim());

                                    arr.add(c, field);
                                }
                            } else {
                                arr.add(c, "");
                            }
                            c++;
                        }
                    } else {
                        //Agregar a la coleccion fullobjects cada record como DataObject
                        int c = 0;
                        boolean add = true;
                        DataObject rec = new DataObject();
                        for (String field : record) {
                            String colname = arr.get(c);
                            if (colname != null && colname.trim().length() > 0) {
                                Object val = field.trim();
                                rec.put(colname, val);
                            }
                            c++;
                        }
                        BasicDBObject bjson = Util.SWBForms.toBasicDBObject(rec);
                        objects.insert(bjson);
                    }
                    r++;
                    if (getStatus() == STATUS.STOPPED || getStatus() == STATUS.ABORTED) {
                        break;
                    }
                }

                extractorDef.put("status", STATUS.FINISHED.name());
                extracting = false;
                extractorDef.put("rows2harvest", 0);
                extractorDef.put("cursor", 0);
                extractorDef.put("rows2Processed", 0);

                extractorDef.put("harvestered", r);
                extractorDef.put("processed", r);
                dsExtract.updateObj(extractorDef);

                log.trace("Finalizando extracción..." + ext_name.toUpperCase() + " ==> Extracted(" + r + ")");
            }

            log.trace("\n\n\n>>>>>>>>>> TRANSFORMING <<<<<<<<<<<<<<<<<\n\n\n");
            String idScript = extractorDef.getString("transScript");
            SWBDataSource dsTScript = engine.getDataSource("TransformationScript");
            DataObject doTS = dsTScript.fetchObjById(idScript);
            String scriptsrc = doTS.getString("script");
            ScriptEngineManager factory = new ScriptEngineManager();
            long numItemsIndexed = 0;
            long numItemsDeleted = 0;

            if (null != scriptsrc && scriptsrc.trim().length() > 0 && (getStatus() == STATUS.STOPPED || getStatus() == STATUS.FINISHED ||
                    getStatus() == STATUS.LOADED)) {
//            System.out.println("tiene script...");
                extractorDef.put("status", STATUS.PROCESSING.name());
                dsExtract.updateObj(extractorDef);
                ScriptEngine screngine = factory.getEngineByName("JavaScript");
                DataObjectScriptEngineMapper mapper = new DataObjectScriptEngineMapper(screngine, scriptsrc);

                //Generar el nuevo DataObject combinado por cada prefix
                try {
                    DB db = ExtractorManager.client.getDB(extractorDef.getString("name").toUpperCase());
                    DBCollection objects = db.getCollection("fullobjects");
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
                    extractorDef.put("status", STATUS.FINISHED);
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
//            String collName = extractorDef.getString("collection", "objects");
//            if (db.collectionExists(collName)) {
//                db.getCollection(collName).drop();
//            }
            ret = true;
            extract();
        } catch (Exception e) {
            log.error("Error al tratar de borrar la Base de Datos",e);
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
            log.error("Error updating data for extractor", e);
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
                            next.remove("_id");
                            // usar indice de "repositorio" para pruebas, el que se utilizará para la aplicación será "cultura"
                            //SimpleESIndexer sesidx = new SimpleESIndexer("test", "bic");
                            //SimpleESIndexer sesidx = new SimpleESIndexer("127.0.0.1", 9200, "repositorio", "bic");
                            SimpleESIndexer sesidx = new SimpleESIndexer("127.0.0.1", 9200, "cultura", "bic");
                            //System.out.println("\n\n\n"+next.toString());
                            sesidx.index(next.toString());
                            numItemsIndexed++;
                        } catch (Exception e) {
                            log.error("Error en el mapeo e indexación...");
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
