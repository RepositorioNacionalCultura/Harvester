package mx.gob.cultura.datasource.mongo;

import com.mongodb.client.MongoCursor;
import mx.gob.cultura.datasource.Cursor;
import mx.gob.cultura.datasource.DataSourceObject;
import org.bson.Document;

/**
 * Implementation of {@link Document} cursor for {@link MongoDBDataSource}.
 * @author Hasdai Pacheco
 */
public class MongoDBCursor implements Cursor {
    MongoCursor<Document> cur;

    /**
     * Constructor. Creates a new instance of {@link MongoDBCursor}
     * @param cursor MongoCursor object with fetch results from database.
     */
    public MongoDBCursor(MongoCursor cursor) {
        this.cur = cursor;
    }

    @Override
    public boolean hasNext() {
        return cur.hasNext();
    }

    @Override
    public DataSourceObject next() {
        Document d = cur.next();

        //Wrap mongo document in DataSourceObject instance
        return new DataSourceObject<Document>() {
            String id = d.get("_id").toString();

            @Override
            public String getId() {
                return id;
            }

            @Override
            public Document getData() {
                return d;
            }
        };

    }
}
