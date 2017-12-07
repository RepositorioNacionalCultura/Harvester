/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package mx.gob.cultura.extractor;

import java.util.logging.Logger;
import org.json.XML;
import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.MongoClient;
import org.json.JSONObject;
import org.json.JSONArray;
import java.util.Date;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.HashMap;
import mx.gob.cultura.util.Util;
import org.json.JSONException;
import org.semanticwb.datamanager.DataObject;
import org.semanticwb.datamanager.SWBDataSource;
import org.semanticwb.datamanager.SWBScriptEngine;

/**
 *
 * @author juan.fernandez
 */
public class ModsExtractor extends ExtractorBase {

    static Logger log = Logger.getLogger(ModsExtractor.class.getName());

    protected DataObject extractorDef;
    private SWBScriptEngine engine;
    private SWBDataSource dsExtract;
    private boolean extracting;
    private boolean update;

//    public static enum STATUS {
//        LOADED, STARTED, EXTRACTING, STOPPED, ABORTED, FAILLOAD
//    }
    private String status = "LOADED";

    /**
     *
     * @param doID
     * @param eng
     */
    public ModsExtractor(String doID, SWBScriptEngine eng) {
        super(doID, eng);
        extractorDef = super.extractorDef;
        engine = super.engine;
        dsExtract = super.dsExtract;
        //dsEPoint = super.dsEPoint;
    }

    @Override
    public void start() {
        System.out.println("canStart(" + canStart() + ")");
        if (canStart()) {
            log.info("ModsExtractor :: Started extractor " + getName());
            try {
                extract();
            } catch (Exception ex) {
                ex.printStackTrace();
            }
        }
    }

    @Override
    public void stop() {
        status = "STOPPED";
    }

    @Override
    public String getStatus() {
        return status.toString();
    }

    public void setStatus(String s) {
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

        return !status.equals("FAILLOAD") && (status.equals("STOPPED") || status.equals("LOADED"));
    }

    @Override
    public String getType() {

        String ret = extractorDef.getString("");
        return ret;
    }

    @Override
    public void extract() throws Exception {

        //2017-12-01T13:05:00.000
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
        //DataObject do_extrac = null;
        String ext_name = null;
        String ext_coll = null;
        String ext_url = null;
        String ext_verbs = null;
        String ext_prefix = null;
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
                ext_prefix = extractorDef.getString("prefix");
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

                extractorDef.put("status", "STARTED");
                dsExtract.updateObj(extractorDef);
                ExtractorManager.hmExtractorDef.put(pid, extractorDef);

                MongoClient client = new MongoClient("localhost", 27017);
                DB db = client.getDB(ext_name.toUpperCase());
                DBCollection objects = db.getCollection(ext_coll);
                try {
                    objects.dropIndex("oaiid");
                } catch (Exception e) {
                }
                objects.createIndex("oaiid");

                if(null!=ext_lastExec) ext_lastExec = ext_lastExec.replace(" ", "T");

                boolean isResumeExtract = false;
                String urlConn = ext_url + "?verb=" + ext_verbs + "&metadataPrefix=" + ext_prefix;

                if (update && null != ext_lastExec) {
                    urlConn = ext_url + "?verb=" + ext_verbs + "&metadataPrefix=" + ext_prefix + "&from=" + ext_lastExec;
                }

                if (null != ext_status && ext_status.equals("EXTRACTING") || (null != ext_resTknVal && !ext_resTknVal.equals("0") && ext_resTknVal.length() > 0)) {
                    urlConn = ext_url + "?verb=" + ext_verbs + "&resumptionToken=" + resTkn_str;
                    resTkn_str = ext_resTknVal;
                    listSize = ext_r2harvest;
                    cursor = ext_cursor;
                    isResumeExtract = true;
                }

                URL theUrl = new URL(urlConn);

                System.out.println("Making request " + theUrl.toString());
                extractorDef.put("lastExecution", sdf.format(new Date()));

                HashMap<String, String> hm = Util.loadOccurrences(engine);

                boolean tknFound = false;
                int numextract = 0;
                int numalready = 0;
                int retries = 0;
                System.out.println("Empezando extracción..." + ext_name.toUpperCase());
                do {
                    tknFound = false;
                    try {

                        jsonstr = Util.makeRequest(theUrl, true);
                        jsonstr = Util.replaceOccurrences(hm, jsonstr);

                        if (jsonstr.contains("resumptionToken")) {
                            tknFound = true;
                        }

                        if (jsonstr != null && jsonstr.startsWith("#Error") && jsonstr.endsWith("#")) {
                            System.out.println(jsonstr.substring(1, jsonstr.length() - 1));
                            break;
                        }

                        JSONObject json = XML.toJSONObject(jsonstr);
                        //System.out.println("JSON:"+json.toString());
                        JSONObject jsonroot = json.getJSONObject("OAI-PMH");
                        JSONObject jsonLst = jsonroot.getJSONObject("ListRecords");

                        JSONObject jsonTkn = null;
                        if (tknFound) {

                            try {
                                System.out.println("Buscando token...");
                                jsonTkn = jsonLst.getJSONObject("resumptionToken");

                                if (null != jsonTkn) {
                                    resTkn_str = jsonTkn.getString("content");
                                    listSize_str = jsonTkn.getString("completeListSize");
                                    cursor_str = jsonTkn.getString("cursor");
                                    if (listSize == 0) {
                                        try {
                                            listSize = Integer.parseInt(listSize_str);
                                        } catch (Exception e) {
                                            System.out.println("Error: Invalid records size number");
                                            e.printStackTrace();
                                            listSize = -1;
                                        }
                                    }
                                    try {
                                        cursor = Integer.parseInt(cursor_str);
                                    } catch (Exception e) {
                                        System.out.println("Error: Invalid cursor size number");
                                        e.printStackTrace();
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

                        extractorDef.put("status", "EXTRACTING");
                        extracting = true;
                        extractorDef.put("rows2harvest", (listSize - numextract));
                        extractorDef.put("cursor", cursor);
                        extractorDef.put("rows2Processed", listSize);
                        extractorDef.put("processed", 0);
                        dsExtract.updateObj(extractorDef);
                        ExtractorManager.hmExtractorDef.put(pid, extractorDef);

                        if (listSize > (numextract + numalready)) {

                            String nid = null;
                            for (int i = 0; i < jsonRd.length(); i++) {
                                JSONObject jsonhdr = jsonRd.getJSONObject(i).getJSONObject("header");
                                nid = jsonhdr.getString("identifier");

                                try {
//                                    BasicDBObject dbQuery = new BasicDBObject("oaiid", nid);
//                                    DBObject dbres = objects.findOne(dbQuery);
//                                    if (null == dbres) {
                                    numextract++;
                                    String nodeAsString = jsonRd.getJSONObject(i).toString();
                                    DataObject rec = new DataObject();
                                    rec.put("oaiid", nid);
                                    rec.put("body", DataObject.parseJSON(nodeAsString));
                                    BasicDBObject bjson = Util.toBasicDBObject(rec);
                                    objects.insert(bjson);
//                                    } else {
//                                        numalready++;
//                                        //System.out.println("Already Extracted...");
//                                    }

                                } catch (Exception e) {
                                    System.out.println("Error..." + e.toString());
                                    e.printStackTrace();
                                }
                            }
                        } else {
                            setStatus("STOPPED");
                        }

                        if (resTkn_str != null) {
                            tmpTkn = resTkn_str;
                            extractorDef.put("tokenValue", resTkn);
                            theUrl = new URL(ext_url + "?verb=" + ext_verbs + "&resumptionToken=" + resTkn_str);
                            resTkn_str = null;
                        }
                        extractorDef.put("harvestered", numextract);
                        dsExtract.updateObj(extractorDef);
                        ExtractorManager.hmExtractorDef.put(pid, extractorDef);
                    } catch (JSONException jex) {
                        Thread.sleep(5000);
                        retries++;
                        jex.printStackTrace();
                    }

                    if (getStatus().equals("STOPPED") || getStatus().equals("ABORT")) {
                        break;
                    }
                    if (numextract % 100 == 0 && numextract > 0) {
                        System.out.println("Extracted ==>" + numextract);
                    }
                    if (numalready % 100 == 0 && numalready > 0) {
                        System.out.println("Already ==>" + numalready + "(" + listSize + ")");
                    }
                    if (retries > 0) {
                        System.out.println("Retries ==>" + retries);
                    }

                    System.out.println("Retries(" + retries + ")Token(" + tmpTkn + "), List(" + listSize + "), Extracted(" + numextract + "),Existing(" + numalready + ")");
                    tmpTkn = null;
                } while (retries < 5 || tknFound || listSize > (numextract + numalready));  //(listSize > numextract && listSize > numalready) && 
                update = false;
                extractorDef.put("status", "STOPPED");
                extracting = false;
                dsExtract.updateObj(extractorDef);
                ExtractorManager.hmExtractorDef.put(pid, extractorDef);
                ExtractorManager.getInstance().loadExtractor(extractorDef);
                System.out.println("Finalizando extracción..." + ext_name.toUpperCase() + " ==> Extracted(" + numextract + "), EXISTING(" + numalready + ")");

            }
        }

    }

    @Override
    public boolean replace() {
        boolean ret = false;
        try {
            MongoClient client = new MongoClient("localhost", 27017);
            DB db = client.getDB(extractorDef.getString("name").toUpperCase());
            String collName = extractorDef.getString("collection", "objects");
            if (db.collectionExists(collName)) {
                db.getCollection(collName).drop();
            }
            ret = true;
            extract();
        } catch (Exception e) {
            System.out.println("Error al tratar de borrar la Base de Datos");
            e.printStackTrace();
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
            e.printStackTrace();
        }

        return ret; //To change body of generated methods, choose Tools | Templates.
    }

    @Override
    public String getScript() {

        String ret = extractorDef.getString("script");

        return ret;
    }

}
