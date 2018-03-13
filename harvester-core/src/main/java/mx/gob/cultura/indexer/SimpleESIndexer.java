package mx.gob.cultura.indexer;

import mx.gob.cultura.commons.Util;
import mx.gob.cultura.commons.config.AppConfig;
import org.elasticsearch.client.RestHighLevelClient;

import java.util.ArrayList;

/**
 * Simple class to index objects using ElasticSearch {@link RestHighLevelClient}.
 * @author Hasdai Pacheco
 */
public class SimpleESIndexer {
    private static RestHighLevelClient client;
    private String indexName;
    private String indexType;

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
        return Util.ELASTICSEARCH.indexObject(client, indexName, indexType, id, objectJson);
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