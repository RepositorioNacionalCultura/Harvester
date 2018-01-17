package mx.gob.cultura.datasource;

/**
 * Interface to wrap {@link DataSource} fetch results as cursor.
 * @author Hasdai Pacheco
 */
public interface Cursor extends AutoCloseable {
    /**
     * Checks whether there are more elements in the cursor.
     * @return true if there are more elements in the cursor, false otherwise
     */
    boolean hasNext();

    /**
     * Gets next element in the cursor.
     * @return Next element int he cursor as an instance of {@link DataSourceObject}.
     */
    DataSourceObject next();

    /**
     * Gets wrapped object used as cursor.
     * @return Object used as cursor internally.
     */
    Object getNativeCursor();
}
