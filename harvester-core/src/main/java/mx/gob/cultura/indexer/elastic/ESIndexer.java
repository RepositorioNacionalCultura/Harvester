package mx.gob.cultura.indexer.elastic;

import mx.gob.cultura.commons.Util;
import mx.gob.cultura.datasource.Cursor;
import mx.gob.cultura.datasource.DataSourceObject;
import mx.gob.cultura.exception.IndexException;
import mx.gob.cultura.indexer.IndexerBase;
import mx.gob.cultura.commons.Util;
import org.apache.log4j.Logger;
import org.bson.Document;
import org.elasticsearch.action.index.IndexRequest;
import org.elasticsearch.action.index.IndexResponse;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.common.xcontent.XContentType;

import java.io.IOException;

/**
 * Implementation of ElasticSearch indexer for MongoDBObjects.
 * @author Hasdai Pacheco
 */
public class ESIndexer extends IndexerBase {
    private static final Logger log = Logger.getLogger(ESIndexer.class);
    String [] indexNames;
    String host;
    int port;

    /**
     * Constructor. Creates a new instance of {@link ESIndexer} with default connection parameters.
     * @param indexNames Array of index names where objects will be indexed.
     */
    public ESIndexer (String[] indexNames) {
        super();
        this.indexNames = indexNames;
    }

    /**
     * Constructor. Creates a new instance of {@link ESIndexer} with given node host and port.
     * @param host Host name of ElasticSearch node.
     * @param port Port number of ElasticSearch node.
     * @param indexNames Array of index names where objects will be indexed.
     */
    public ESIndexer (String host, int port, String[] indexNames) {
        this.host = host;
        this.port = port;
        this.indexNames = indexNames;
    }

    @Override
    public void index() throws IndexException {
        RestHighLevelClient client = Util.ELASTICSEARCH.getElasticClient(null==host?"localhost":host, port>0?port:9200);
        Cursor cur = getDataSource().fetch(null);

        while (cur.hasNext()) {
            DataSourceObject<Document> d = cur.next();
            d.getData().remove("_id");
            IndexRequest req = new IndexRequest("rnc", "doc", d.getId());
            req.source(d.getData().toJson(), XContentType.JSON);

            try {
                IndexResponse resp = client.index(req);
            } catch (IOException ioex) {
                log.error("Error indexing objects in ES", ioex);
                throw new IndexException();
            }
        }
    }
}
