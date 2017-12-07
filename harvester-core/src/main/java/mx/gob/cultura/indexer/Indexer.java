package mx.gob.cultura.indexer;

import mx.gob.cultura.exception.IndexException;

import java.util.Properties;

/**
 * Interface to encapsulate different {@link Indexer} implementations
 * @author Hasdai Pacheco
 */
public interface Indexer {
    /**
     * Starts execution oh indexer.
     * @throws IndexException if index process fails.
     */
    void index() throws IndexException;
}
