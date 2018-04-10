package mx.gob.cultura.extractor;

import com.mongodb.MongoClient;
import org.apache.log4j.Logger;
import org.semanticwb.datamanager.*;

import java.util.HashMap;
import java.util.Timer;
import java.util.TimerTask;

/**
 * Class that manages Extractor execution.
 * @author juan.fernandez
 */
public class ExtractorManager {
    protected static HashMap<String, Extractor> hmExtractor = new HashMap(); //id del DataObject, instancia del extractor
    //protected static HashMap<String, DataObject> hmExtractorDef = new HashMap(); //id del DataObject, DataObject de la definición del extractor
    protected static SWBDataSource datasource = null;
    protected static MongoClient client = null;
    private static Logger log = Logger.getLogger(ExtractorManager.class);
    private static SWBScriptEngine engine = null;
    private static ExtractorManager instance = null; //  Instancia del ExtractorManager
    private long TIME_INTERVAL_REVIEW = 60000; //Se ejecutará cada 60 segundos la revisión de todos los extractores con periodicidad

    public ExtractorManager() {
    }

    public static ExtractorManager getInstance() {
        if (null == instance) {
            instance = new ExtractorManager();
            instance.init();
        }
        return instance;
    }

    /**
     * Gets MongoClient to MongoDB
     * @return client
     */
    public static MongoClient getMongoClient(){

        return client;
    }

    /**
     * Initializes extractor manager
     */
    public void init() {
        client = new MongoClient("localhost", 27017);
        engine = DataMgr.getUserScriptEngine("/work/cultura/jsp/datasources.js", null);
        //engine = DataMgr.initPlatform(null);
        try {
            datasource = engine.getDataSource("Extractor");
            DataObject r = new DataObject();
            DataObject data = new DataObject();
            r.put("data", data);
            DataObject ret = datasource.fetch(r);
            String key = null;
            String className = null;
            DataList rdata = ret.getDataObject("response").getDataList("data");
            DataObject dobj = null;
            Extractor extractor = null;
            //System.out.println("Antes de cargar el HashMap...");
            if (!rdata.isEmpty()) {
                for (int i = 0; i < rdata.size(); i++) { // Cargando los extractores al HashMap
                    dobj = rdata.getDataObject(i);  // DataObject del  extractor
                    //System.out.println("DataObject: "+dobj.toString());
                    if (null != dobj) {
                        key = dobj.getString("_id");
                        className = dobj.getString("class");
                        extractor = null;
                        if (null != className) {
                            if (className.endsWith("CSVExtractor")) {
                                extractor = new CSVExtractor(key,engine);
                            } else if (className.endsWith("OAIExtractor")) {
                                extractor = new OAIExtractor(key,engine);
                            } else if (className.endsWith("JSONExtractor")) {
                                extractor = new JSONExtractor(key,engine);
                            }
                        }
                    }
                    hmExtractor.put(key, extractor);
//                    hmExtractorDef.put(key, dobj);
                }
            }
        } catch (Exception e) {
            log.error(e);
        }
        // Inicializando el Timer para que empiece a ejecutar los extractores con periodicidad
        TimerTask timerTask = new ExtractorTask();
        //Corriendo el  TimerTask como daemon thread
        Timer timer = new Timer(true);
        timer.scheduleAtFixedRate(timerTask, 0, TIME_INTERVAL_REVIEW);
        log.info("TimerTask periodicidad started");
    }

    /**
     * Loads an extractor from its configuration object
     * @param extractorConfig
     */
    public void loadExtractor(DataObject extractorConfig) {
        if (null != extractorConfig) {
            log.trace("Revisando estatus del extractor.....");
            String className = extractorConfig.getString("class");
            Extractor extractor = hmExtractor.get(extractorConfig.getId());
            Extractor.STATUS status = null;
            if ((null != extractor)) {  //Revisando el tipo de extractor para saber su estaus.
                status = extractor.getStatus();
                log.trace("LOADEXTRACTOR..."+status);
                if (null == status && status == Extractor.STATUS.EXTRACTING) {
                    while(status == Extractor.STATUS.EXTRACTING ||status == Extractor.STATUS.PROCESSING ||status == Extractor.STATUS.INDEXING){ //Esperando a que termine el extractor
                        try {
                            // el extractor tiene el status de EXTRACTING, se espera 2 segundos  a que termine y se verifica el status
                            Thread.sleep(2000);
                            status = extractor.getStatus();
                            log.trace("===>LOADEXTRACTOR..."+status);
                        } catch (InterruptedException ex) {
                            log.error(ex);
                        }
                    }
                }
            }
            extractor=null;
            if (null != status && (status == Extractor.STATUS.STOPPED || status == Extractor.STATUS.ABORTED ||
                    status == Extractor.STATUS.FINISHED) || null == extractor) {
                if (null != className) { // Generando la nueva instancia del extractor
                    if (className.endsWith("CSVExtractor")) {
                        extractor = new CSVExtractor(extractorConfig.getId(),engine);
                    } else if (className.endsWith("OAIExtractor")) {
                        extractor = new OAIExtractor(extractorConfig.getId(),engine);
                    } else if (className.endsWith("JSONExtractor")) {
                        extractor = new JSONExtractor(extractorConfig.getId(),engine);
                    }
                    hmExtractor.put(extractorConfig.getId(), extractor);  // actualizando instancia del extractor en el HashMap
//                    hmExtractorDef.put(extractorConfig.getId(), extractorConfig);  // actualizando configuración del extractor en el HashMap
                }
            }
        }
    }

    /**
     * Gets current status of a particular extractor
     *
     * @return
     */
    public String getStatus(String extractorId) {
        // throw new UnsupportedOperationException();
        Extractor ret=null;
        if (null != extractorId) {
            ret = hmExtractor.get(extractorId);
        }
        return null!=ret?ret.getStatus().name():null;
    }

    /**
     * Calls start method on a particular extractor
     *
     * @param extractorId
     * @return
     */
    public boolean startExtractor(String extractorId) {
        //throw new UnsupportedOperationException();
        Extractor ret;
        if (null != extractorId) {
            ret = hmExtractor.get(extractorId);
            //revisando si se puede inicializar el extractor
            if (null != ret && (ret.getStatus() == Extractor.STATUS.STOPPED || ret.getStatus() == Extractor.STATUS.LOADED)) {
                ret.start();
                return true;
            }
        }
        return false;
    }

    /**
     * Calls stop method on a particular extractor
     *
     * @param extractorId
     * @return
     */
    public boolean stopExtractor(String extractorId) {
        // throw new UnsupportedOperationException();
        Extractor ret;
        if (null != extractorId) {
            ret = hmExtractor.get(extractorId);
            if (null != ret) {
                ret.stop();
                return true;
            }
        }
        return false;
    }

    /**
     * Calls start method on a particular extractor
     *
     * @param extractorId
     * @return
     */
    public boolean replaceExtractor(String extractorId) {
        //throw new UnsupportedOperationException();
        Extractor ret;
        if (null != extractorId) {
            ret = hmExtractor.get(extractorId);
            //revisando si se puede inicializar el extractor
            if (null != ret && (ret.getStatus() == Extractor.STATUS.STOPPED || ret.getStatus() == Extractor.STATUS.LOADED)) {
                ret.replace();
                return true;
            }
        }
        return false;
    }

    /**
     * Calls update method on a particular extractor, retrives last updated records
     *
     * @param extractorId
     * @return
     */
    public boolean updateExtractor(String extractorId) {
        //throw new UnsupportedOperationException();
        Extractor ret;
        if (null != extractorId) {
            ret = hmExtractor.get(extractorId);
            //revisando si se puede inicializar el extractor
            if (null != ret && (ret.getStatus() == Extractor.STATUS.STOPPED || ret.getStatus() == Extractor.STATUS.LOADED)) {
                ret.update();
                return true;
            }
        }
        return false;
    }

    /**
     * Calls process method on a particular extractor
     *
     * @param extractorId
     * @return
     */
    public boolean processExtractor(String extractorId) {
        //throw new UnsupportedOperationException();
        Extractor ret;
        if (null != extractorId) {
            ret = hmExtractor.get(extractorId);
            //revisando si se puede procesar el extractor
            log.trace("Process..."+(null!=ret&&null!=ret.getStatus()?ret.getStatus():"No Status"));
            if (null != ret && (ret.getStatus() == Extractor.STATUS.STOPPED || ret.getStatus() == Extractor.STATUS.LOADED)) {
                try {
                    ret.process();
                } catch (Exception e) {
                    log.error("Error al ejecutar el process del Extractor...", e);
                }
                return true;
            }
        }
        return false;
    }

    public boolean indexExtractor(String extractorId) {
        //throw new UnsupportedOperationException();
        Extractor ret;
        if (null != extractorId) {
            ret = hmExtractor.get(extractorId);
            //revisando si se puede procesar el extractor
            log.trace("Indexing..."+(null!=ret&&null!=ret.getStatus()?ret.getStatus():"No Status"));
            if (null != ret && (ret.getStatus() == Extractor.STATUS.PROCESSED || ret.getStatus() == Extractor.STATUS.STOPPED ||
                    ret.getStatus() == Extractor.STATUS.FINISHED || ret.getStatus() == Extractor.STATUS.LOADED)) {
                try {
                    ret.index();
                } catch (Exception e) {
                    log.error("Error al ejecutar el index del Extractor...", e);
                }
                return true;
            }
        }
        return false;
    }
}

