/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package mx.gob.cultura.extractor;

import com.mongodb.MongoClient;
import java.util.HashMap;
import java.util.Timer;
import java.util.TimerTask;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.semanticwb.datamanager.DataList;
import org.semanticwb.datamanager.DataMgr;
import org.semanticwb.datamanager.DataObject;
import org.semanticwb.datamanager.SWBDataSource;
import org.semanticwb.datamanager.SWBScriptEngine;

/**
 *
 * @author juan.fernandez
 */

public class ExtractorManager {

    protected static HashMap<String, Extractor> hmExtractor = new HashMap(); //id del DataObject, instancia del extractor
    protected static HashMap<String, DataObject> hmExtractorDef = new HashMap(); //id del DataObject, DataObject de la definición del extractor
    protected static SWBDataSource datasource = null;
    private static SWBScriptEngine engine = null;
    private static ExtractorManager instance = null; //  Instancia del ExtractorManager
    private long TIME_INTERVAL_REVIEW = 60000; //Se ejecutará cada 60 segundos la revisión de todos los extractores con periodicidad
    protected static MongoClient client = null;

    public ExtractorManager() {
    }

    public static ExtractorManager getInstance() {
        if (null == instance) {
            instance = new ExtractorManager();
            instance.init();
        }
        return instance;
    }

    ;
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
                            } else if (className.endsWith("OAIDCExtractor")) {
                                extractor = new OAIExtractor(key,engine);
                            }
                        }
                    }
                    hmExtractor.put(key, extractor);
                    hmExtractorDef.put(key, dobj);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        // Inicializando el Timer para que empiece a ejecutar los extractores con periodicidad
        TimerTask timerTask = new ExtractorTask();
        //Corriendo el  TimerTask como daemon thread
        Timer timer = new Timer(true);
        timer.scheduleAtFixedRate(timerTask, 0, TIME_INTERVAL_REVIEW);
        System.out.println("TimerTask periodicidad started");
    }

    /**
     * Loads an extractor from its configuration object
     *
     * @param extractorConfig
     */
    public void loadExtractor(DataObject extractorConfig) {

        if (null != extractorConfig) {
            String className = extractorConfig.getString("class");
            Extractor extractor = hmExtractor.get(extractorConfig.getId());
            String status = null;
            if ((null != extractor)) {  //Revisando el tipo de extractor para saber su estaus.
               
                if (extractor instanceof CSVExtractor) {
                    status = ((CSVExtractor) extractor).getStatus();
                } else if (extractor instanceof OAIExtractor) {
                    status = ((OAIExtractor) extractor).getStatus();
                }
                 System.out.println("LOADEXTRACTOR..."+status);
                if (null == status && status.equals("EXTRACTING")) {
                    while(status.equals("EXTRACTING")){ //Esperando a que termine el extractor
                        try {
                            // el extractor tiene el status de EXTRACTING, se espera 2 segundos  a que termine y se verifica el status
                            Thread.sleep(2000);
                            if (extractor instanceof CSVExtractor) {
                                status = ((CSVExtractor) extractor).getStatus();
                            } else if (extractor instanceof OAIExtractor) {
                                status = ((OAIExtractor) extractor).getStatus();
                            }
                             System.out.println("===>LOADEXTRACTOR..."+status);
                        } catch (InterruptedException ex) {
                            Logger.getLogger(ExtractorManager.class.getName()).log(Level.SEVERE, null, ex);
                        }
                    }
                }
            }

            if (null != status && (status.equals("STARTED") || status.equals("STOPPED")) || null == extractor) {
                if (null != className) { // Generando la nueva instancia del extractor
                    if (className.endsWith("CSVExtractor")) {
                        extractor = new CSVExtractor(extractorConfig.getId(),engine);
                    } else if (className.endsWith("OAIExtractor")) {
                        extractor = new OAIExtractor(extractorConfig.getId(),engine);
                    }
                }
                hmExtractor.put(extractorConfig.getId(), extractor);  // actualizando instancia del extractor en el HashMap
                hmExtractorDef.put(extractorConfig.getId(), extractorConfig);  // actualizando configuración del extractor en el HashMap
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
        return null!=ret?ret.getStatus():null;
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
            if (null != ret && (ret.getStatus().equals("STOPPED")|| ret.getStatus().equals("LOADED"))) {
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
            if (null != ret && (ret.getStatus().equals("STOPPED")|| ret.getStatus().equals("LOADED"))) {
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
            if (null != ret && (ret.getStatus().equals("STOPPED")|| ret.getStatus().equals("LOADED"))) {
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
            System.out.println("Process..."+(null!=ret&&null!=ret.getStatus()?ret.getStatus():"No Status"));
            if (null != ret && (ret.getStatus().equals("STOPPED")|| ret.getStatus().equals("LOADED"))) {
                try {
                   ret.process(); 
                } catch (Exception e) {
                    System.out.println("Error al ejecutar el process del Extractor...");
                    e.printStackTrace();
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
            System.out.println("Indexing..."+(null!=ret&&null!=ret.getStatus()?ret.getStatus():"No Status"));
            if (null != ret && (ret.getStatus().equals("PROCESSED")|| ret.getStatus().equals("STOPPED") || ret.getStatus().equals("FINISHED")|| ret.getStatus().equals("LOADED"))) {
                try {
                   ret.index(); 
                } catch (Exception e) {
                    System.out.println("Error al ejecutar el index del Extractor...");
                    e.printStackTrace();
                }

                return true;
            }
        }
        return false;
    }
    
    
    /**
     * Gets MongoClient to MongoDB
     * @return client
     */
    public static MongoClient getMongoClient(){

        return client;
    }

}

