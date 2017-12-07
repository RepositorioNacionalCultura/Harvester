package mx.gob.cultura.util;

import com.mongodb.BasicDBList;
import com.mongodb.BasicDBObject;
import com.mongodb.MongoClient;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import jdk.nashorn.api.scripting.ScriptObjectMirror;
import org.apache.http.HttpHost;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestHighLevelClient;
import org.json.JSONArray;
import org.json.JSONObject;

import java.util.*;
import org.semanticwb.datamanager.DataList;
import org.semanticwb.datamanager.DataObject;
import org.semanticwb.datamanager.SWBDataSource;
import org.semanticwb.datamanager.SWBScriptEngine;

/**
 * Utility class with common methods.
 *
 * @author Hasdai Pacheco
 */
public final class Util {
    private Util() {
    }

    /**
     * Inner class to encapsulate methods related to DataBase actions.
     */
    public static final class DB {
        private static HashMap<String, MongoClient> mongoClients = new HashMap<>();
        private static HashMap<String, RestHighLevelClient> elasticClients = new HashMap<>();

        /**
         * Gets a {@link MongoClient} instance with default host and port.
         *
         * @return MongoClient instance object.
         */
        public static MongoClient getMongoClient() {
            return getMongoClient("localhost", 27017);
        }

        /**
         * Gets a {@link MongoClient} instance with given host and port.
         *
         * @param host MongoDB server host.
         * @param port MongoDB server port.
         * @return MongoClient instance object.
         */
        public static MongoClient getMongoClient(String host, int port) {
            MongoClient ret = mongoClients.get(host + ":" + String.valueOf(port));
            if (null == ret) {
                ret = new MongoClient(host, port);
                mongoClients.put(host + ":" + String.valueOf(port), ret);
            }

            return ret;
        }

        /**
         * Gets a {@link RestHighLevelClient} instance with default host and port.
         *
         * @return RestHighLevelClient instance object.
         */
        public static RestHighLevelClient getElasticClient() {
            return getElasticClient("localhost", 9200);
        }

        /**
         * Gets a {@link RestHighLevelClient} instance with given host and port.
         *
         * @param host ElasticSearch node host name.
         * @param port ElasticSearch node port.
         * @return RestHighLevelClient instance object.
         */
        public static RestHighLevelClient getElasticClient(String host, int port) {
            RestHighLevelClient ret = elasticClients.get(host + ":" + String.valueOf(port));
            if (null == ret) {
                ret = new RestHighLevelClient(
                        RestClient.builder(new HttpHost(host, port)));

                elasticClients.put(host + ":" + String.valueOf(port), ret);
            }
            return ret;
        }
    }
     public static BasicDBObject toBasicDBObject(DataObject obj) {
        BasicDBObject ret = new BasicDBObject();
        Iterator<Map.Entry<String, Object>> it = obj.entrySet().iterator();
        while (it.hasNext()) {
            Map.Entry<String, Object> entry = it.next();
            ret.put(entry.getKey(), toBasicDB(entry.getValue()));
        }
        return ret;
    }

    public static Object toBasicDB(Object obj) {
        if (obj instanceof DataObject) {
            return toBasicDBObject((DataObject) obj);
        } else if (obj instanceof DataList) {
            return toBasicDBList((DataList) obj);
        }
        return obj;
    }

    public static BasicDBList toBasicDBList(DataList obj) {
        BasicDBList ret = new BasicDBList();
        Iterator it = obj.iterator();
        while (it.hasNext()) {
            ret.add(toBasicDB(it.next()));
        }
        return ret;
    }
    
    
    
    
    /**
     * Carga la colección de Replace a un HashMap<ocurrencia, reemplazo> 
     *
     * @param engine Utilizado para poder cargar la colección de Replace en un HashMap
     * @return HashMap con DataSource cargado en memoria.
     */
    public static HashMap<String,String> loadOccurrences( SWBScriptEngine engine) {

        SWBDataSource datasource = null;
        HashMap<String,String> hm = new HashMap();
        
        if (null != engine) {
            try {
                datasource = engine.getDataSource("Replace");
                DataObject r = new DataObject();
                DataObject data = new DataObject();
                r.put("data", data);

                DataObject ret = datasource.fetch(r);
                String occurrence = "";
                String replace = "";

                DataList rdata = ret.getDataObject("response").getDataList("data");
                DataObject dobj = null;
                if (!rdata.isEmpty()) {
                    for (int i = 0; i < rdata.size(); i++) {
                        dobj = rdata.getDataObject(i);  // DataObject de Replace
                        occurrence = dobj.getString("occurrence");
                        replace = dobj.getString("replace");
                        hm.put(occurrence, replace);
                    }
                }
            } catch (Exception e) {
                System.out.println("Error al cargar el DataSource. " + e.getMessage());
                e.printStackTrace(System.out);
            }
        } else {
            System.out.println("Error al cargar el DataSource al HashMap, falta inicializar el engine.");
            return null;
        }

        return hm;
    }
    
    
    
    /**
     * Reemplaza las ocurrencias en el string recibido
     *
     * @param hm HashMap con las ocurrencias y su reemplazo previamente cargado
     * @param oaistr Stream del registro OAI a revisar
     * @return String con todas las ocurrencias reemplazadas.
     */
    public static String replaceOccurrences(HashMap<String,String> hm, String oaistr) {
        if (null != hm && null!=oaistr) {
                String occurrence = "";
                String replace = "";
                Iterator<String> it = hm.keySet().iterator();
                while (it.hasNext()) {
                    occurrence = it.next();
                    replace = hm.get(occurrence);
                     oaistr = oaistr.replace(occurrence, replace);
                }
        } 
        return oaistr;
    }
    
    public static String makeRequest(URL theUrl, boolean XMLSupport)  {
        HttpURLConnection con = null;
        StringBuilder response = new StringBuilder();
        String errorMsg = null;
        int retries = 0;
        boolean isConnOk = false;
        do {
            try {
                con = (HttpURLConnection) theUrl.openConnection();
                isConnOk = true;
                //AQUI SE PIDE EN XML
                if (XMLSupport) {
                    con.setRequestProperty("accept", "application/xml");
                }
                con.setRequestMethod("GET");
                //System.out.println("content type:" + con.getContentType());

                
                    int statusCode = con.getResponseCode();

                    if (statusCode == 200) {
                        try (BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()))) {
                            String inputLine;

                            while ((inputLine = in.readLine()) != null) {
                                response.append(inputLine);
                            }
                        } catch (IOException ioex) {
                            ioex.printStackTrace();
                        }
                    } else {
                        //throw new ServerErrorException();
                    }
                
            } catch (IOException e) {
                if (null != con) {
                    con.disconnect();
                }
                retries++;
                try {
                     Thread.sleep(5000);
                } catch (Exception te) {
                    te.printStackTrace();
                }
               
                e.printStackTrace();
                isConnOk = false;
                if(retries==5){
                    errorMsg="#Error: No se puede conectar al servidor#";
                }
            }
        } while (isConnOk == false && retries < 5); 
        return errorMsg!=null?errorMsg:response.toString();
    }

}
