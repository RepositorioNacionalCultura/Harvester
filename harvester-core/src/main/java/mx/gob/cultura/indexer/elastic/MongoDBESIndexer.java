package mx.gob.cultura.indexer.elastic;

import mx.gob.cultura.commons.Util;
import mx.gob.cultura.commons.exception.IndexException;
import mx.gob.cultura.datasource.Cursor;
import mx.gob.cultura.datasource.DataSourceObject;
import mx.gob.cultura.indexer.IndexerBase;
import org.bson.Document;
import org.elasticsearch.client.RestHighLevelClient;

/**
 * Implementation of ElasticSearch indexer for MongoDBObjects.
 * @author Hasdai Pacheco
 */
public class MongoDBESIndexer extends IndexerBase {
    private String indexName;
    private String typeName;
    private String host;
    private int port;

    /**
     * Constructor. Creates a new instance of {@link MongoDBESIndexer} with default connection parameters.
     * @param indexName Index name where objects will be indexed.
     * @param typeName Name of type in index.
     */
    public MongoDBESIndexer(String indexName, String typeName) {
        super();
        this.indexName = indexName;
        this.typeName = typeName;
    }

    /**
     * Constructor. Creates a new instance of {@link MongoDBESIndexer} with given node host and port.
     * @param host Host name of ElasticSearch node.
     * @param port Port number of ElasticSearch node.
     * @param indexName Index name where objects will be indexed.
     * @param typeName Name of type in index.
     */
    public MongoDBESIndexer(String host, int port, String indexName, String typeName) {
        this.host = host;
        this.port = port;
        this.indexName = indexName;
        this.typeName = typeName;
    }

    @Override
    public void index() throws IndexException {
        RestHighLevelClient client = Util.ELASTICSEARCH.getElasticClient(null==host?"localhost":host, port>0?port:9200);
        Cursor cur = getDataSource().fetch(null);

        while (cur.hasNext()) {
            DataSourceObject<Document> d = cur.next();
            d.getData().remove("_id");
            String id = Util.ELASTICSEARCH.indexObject(client, indexName, typeName, null, d.getData().toJson());

            if (null == id) {
                throw new IndexException("Indexing object failed");
            }
        }
    }

    @Override
    public String index(Object o) {
        RestHighLevelClient client = Util.ELASTICSEARCH.getElasticClient(null==host?"localhost":host, port>0?port:9200);
        String ret = null;
        if (o instanceof Document) {
            Document d = (Document) o;
            d.remove("_id");
            String id = Util.ELASTICSEARCH.indexObject(client, indexName, typeName, null, d.toJson());
        }

        return ret;
    }
}