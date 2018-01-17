package mx.gob.cultura.datasource.mongo;

import com.mongodb.client.FindIterable;
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
     * @param iterable MongoCursor object with fetch results from database.
     */
    public MongoDBCursor(FindIterable<Document> iterable) {
        if (null != iterable) {
            cur = iterable.iterator();
        }
    }

    @Override
    public boolean hasNext() {
        return null != cur && cur.hasNext();
    }

    @Override
    public DataSourceObject next() {
        if (null != cur) {
            Document doc = cur.next();
            if (null != doc) {
                return MongoDBDataSource.toDataSourceObject(doc);
            }
        }
        return null;
    }

    @Override
    public Object getNativeCursor() {
        return cur;
    }

    @Override
    public void close() throws Exception {
        if (null != cur) cur.close();
    }
}