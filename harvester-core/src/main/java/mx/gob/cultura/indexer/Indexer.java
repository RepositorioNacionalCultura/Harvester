package mx.gob.cultura.indexer;

import mx.gob.cultura.commons.exception.IndexException;

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
