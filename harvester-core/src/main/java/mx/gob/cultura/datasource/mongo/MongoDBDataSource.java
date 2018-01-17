package mx.gob.cultura.datasource.mongo;

import com.mongodb.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import mx.gob.cultura.commons.Util;
import mx.gob.cultura.datasource.DataSource;
import mx.gob.cultura.datasource.DataSourceObject;
import mx.gob.cultura.transformer.Mapper;
import org.bson.Document;
import org.bson.types.ObjectId;

/**
 * Implementation of {@link DataSource} using MongoDB.
 * @author Hasdai Pacheco
 */
public class MongoDBDataSource implements DataSource<Document> {
    MongoCollection coll;
    MongoDatabase db;
    MongoClient client;

    /**
     * Constructor. Creates a new instance of {@link MongoDBDataSource} with given database name and collection.
     * @param dbName Name of database to connect to.
     * @param collName Name of collection from which data is going to be fetched.
     */
    public MongoDBDataSource(String dbName, String collName) {
        client = Util.MONGODB.getMongoClient();
        db = client.getDatabase(dbName);
        coll = db.getCollection(collName);
    }

    @Override
    public MongoDBCursor fetch(String filter) {
        if (null != filter) {
            return new MongoDBCursor(coll.find(Document.parse(filter)));
        } else {
            return new MongoDBCursor(coll.find());
        }
    }

    @Override
    public DataSourceObject<Document> findById(String id) {
        Object ret = coll.find(new Document("_id", new ObjectId(id))).first();

        if (null != ret) {
            return toDataSourceObject((Document)ret);
        }
        return null;
    }

    /**
     * Wraps a {@link Document} into a {@link DataSourceObject}.
     * @param doc {@link Document} object to wrap.
     * @return {@link DataSourceObject} wrapping {@link Document} object.
     */
    public static DataSourceObject<Document> toDataSourceObject(Document doc) {
        Document ref = doc;
        if (null != ref) {
            String did = ref.get("_id").toString();
            return new DataSourceObject<Document>() {
                @Override
                public String getId() {
                    return did;
                }

                @Override
                public Document getData() {
                    return ref;
                }

                @Override
                public Object getData(Mapper mapper) {
                    return mapper.map(ref);
                }
            };
        }

        return null;
    }
}
