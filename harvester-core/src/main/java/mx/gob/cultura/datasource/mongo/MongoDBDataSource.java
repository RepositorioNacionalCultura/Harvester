package mx.gob.cultura.datasource.mongo;

import com.mongodb.MongoClient;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import mx.gob.cultura.datasource.Cursor;
import mx.gob.cultura.datasource.DataSource;
import mx.gob.cultura.commons.Util;
import org.bson.Document;

/**
 * Implementation of {@link DataSource} using MongoDB.
 * @author Hasdai Pacheco
 */
public class MongoDBDataSource implements DataSource {
    String collName;
    String dbName;

    /**
     * Constructor. Creates a new instance of {@link MongoDBDataSource} with given database name and collection.
     * @param dbName Name of database to connect to.
     * @param collName Name of collection from which data is going to be fetched.
     */
    public MongoDBDataSource(String dbName, String collName) {
        this.dbName = dbName;
        this.collName = collName;
    }

    @Override
    public Cursor fetch(String filter) {
        MongoClient client = Util.DB.getMongoClient();
        MongoDatabase db = client.getDatabase(dbName);
        MongoCollection coll = db.getCollection(collName);

        FindIterable<Document> it = coll.find();

        return new MongoDBCursor(it.iterator());
    }
}
