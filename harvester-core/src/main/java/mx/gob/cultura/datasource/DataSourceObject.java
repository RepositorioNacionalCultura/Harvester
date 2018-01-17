package mx.gob.cultura.datasource;

import mx.gob.cultura.transformer.Mapper;

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

    /**
     * Gets mapped object data.
     * @param mapper {@link Mapper} to transform source object.
     * @return
     */
    Object getData(Mapper mapper);
}