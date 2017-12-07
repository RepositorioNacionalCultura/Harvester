package mx.gob.cultura.datasource;

/**
 * Interface to wrap common methods for objects (records) fetched from a {@link mx.gob.cultura.datasource.DataSource}
 * @author Hasdai Pacheco
 */
public interface DataSourceObject<T> {
    /**
     *
     * @return gets record ID
     */
    String getId();

    /**
     * Gets object data in native data type.
     * @return data object.
     */
    T getData();
}
