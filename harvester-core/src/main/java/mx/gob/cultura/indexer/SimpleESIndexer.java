package mx.gob.cultura.indexer;

import mx.gob.cultura.commons.Util;
import mx.gob.cultura.commons.config.AppConfig;
import org.elasticsearch.client.RestHighLevelClient;

import java.util.ArrayList;
import org.semanticwb.datamanager.DataObject;
import org.semanticwb.datamanager.SWBDataSource;
import org.semanticwb.datamanager.SWBScriptEngine;

/**
 * Simple class to index objects using ElasticSearch {@link RestHighLevelClient}.
 * @author Hasdai Pacheco
 */
public class SimpleESIndexer {
    private static RestHighLevelClient client;
    private String indexName = AppConfig.getConfigObject().getIndexName();
    private String indexType = AppConfig.getConfigObject().getIndexType();

    /**
     * Constructor. Creates a new instance of {@link SimpleESIndexer}.
     * @param host ElasticSearch host URL.
     * @param port ElasticSearch port.
     * @param indexName Name of index to use.
     * @param typeName Name of index type.
     */
    public SimpleESIndexer (String host, int port, String indexName, String typeName) {
        client = Util.ELASTICSEARCH.getElasticClient(host, port);
        this.indexName = indexName;
        this.indexType = typeName;
    }

    /**
     * Constructor. Creates a new instance of {@link SimpleESIndexer}.
     * @param indexName Name of index to use.
     * @param typeName Name of index type.
     */
    public SimpleESIndexer(String indexName, String typeName) {
        this(AppConfig.getConfigObject().getElasticHost(), AppConfig.getConfigObject().getElasticPort(), indexName, typeName);
    }

    /**
     * Constructor. Creates a new instance of {@link SimpleESIndexer}.
     */
    public SimpleESIndexer() {
        this(AppConfig.getConfigObject().getElasticHost(),
                AppConfig.getConfigObject().getElasticPort(),
                AppConfig.getConfigObject().getIndexName(),
                AppConfig.getConfigObject().getIndexType());
    }

    /**
     * Indexes object in ElasticSearch.
     * @param objectJson Object JSON.
     * @return ID of indexed object or null if indexing fails.
     */
    public String index(String objectJson) {
        return Util.ELASTICSEARCH.indexObject(client, indexName, indexType, null, objectJson);
    }

    /**
     * Indexes object in ElasticSearch using specified id.
     * @param objectJson Object JSON.
     * @param id Identifier to use.
     * @return ID of indexed object or null if indexing fails.
     */
    public String index(String objectJson, String id) {
        String ret = null;
        if(!Util.ELASTICSEARCH.existsIndex(client, indexName, indexType, id)){
            //System.out.println("Se crea nuevo INDICE....\n\n");
            ret =Util.ELASTICSEARCH.indexObject(client, indexName, indexType, id, objectJson);
        } else {
            //System.out.println("Se actualiza INDICE....\n\n");
            ret =Util.ELASTICSEARCH.updateObject(client, indexName, indexType, id, objectJson);
        }
        return ret;
    }
    
    /**
     * Indexes object in ElasticSearch using specified id.
     * @param objectJson Object JSON.
     * @param id Identifier to use.
     * @return ID of indexed object or null if indexing fails.
     */
    public String index(String objectJson, String id, DataObject extractor, SWBScriptEngine engine, SWBDataSource transobj) {
        String ret = null;
        if(!Util.ELASTICSEARCH.existsIndex(client, indexName, indexType, id)){
            //System.out.println("Se crea nuevo INDICE....\n\n");
            //Generar cultuaoaiid con el id del holder y consecutivo
            DataObject resdo = Util.addPatternOAIID2DataObject(objectJson, extractor, engine, transobj);
            ret =Util.ELASTICSEARCH.indexObject(client, indexName, indexType, id, resdo.toString());
        } else {
            //System.out.println("Se actualiza INDICE....\n\n");
            DataObject dataO = (DataObject)DataObject.parseJSON(objectJson);
            String coaiid = Util.ELASTICSEARCH.checkForCulturaOAIIDPropByIdentifier(client, indexName, indexType, dataO.getString("oaiid"));
            String tmpobjectJson = objectJson;
            if(null==coaiid){
//                System.out.println("No tiene culturaoaiid");
                DataObject resdo = Util.addPatternOAIID2DataObject(objectJson, extractor, engine, transobj);
                tmpobjectJson = resdo.toString();
            } 
//            else {
//                System.out.println("Ya tiene culturaoaiid");
//            }
            ret =Util.ELASTICSEARCH.updateObject(client, indexName, indexType, id, tmpobjectJson);
        }
        return ret;
    }

    /**
     * Indexes a list of objects in ElasticSearch.
     * @param objects {@link ArrayList} of JSON Strings for objects.
     * @return {@link ArrayList} of identifiers of indexed objects.
     */
    public ArrayList<String> index (ArrayList<String> objects) {
        return Util.ELASTICSEARCH.indexObjects(client, indexName, indexType, objects);
    }
}