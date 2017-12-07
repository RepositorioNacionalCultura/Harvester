package mx.gob.cultura.datasource;

/**
 * Interface to encapsulate methods of different {@link DataSource} implementations.
 * @author Hasdai Pacheco
 */
public interface DataSource {
    /**
     * Retrieves a cursor with fetch results from {@link DataSource}.
     * @return Cursor object with results.
     */
    Cursor fetch(String filter);
}
