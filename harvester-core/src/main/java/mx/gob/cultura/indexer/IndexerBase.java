package mx.gob.cultura.indexer;

import mx.gob.cultura.commons.exception.IndexException;
import mx.gob.cultura.datasource.DataSource;

import java.util.Properties;

/**
 * Base implementation of Indexer.
 * @author Hasdai Pacheco
 */
public class IndexerBase implements Indexer {
    DataSource source = null;
    Properties props = null;

    /**
     * Constructor. Creates a new Instance of {@link IndexerBase}
     */
    public IndexerBase() {
        this.init();
    }

    /**
     * Sets the {@link DataSource} from wich index data is retrieved.
     * @param source
     */
    public void setDataSource(DataSource source) {
        this.source = source;
    }

    /**
     * Gets {@link DataSource} related to this {@link Indexer}.
     * @return DataSource object.
     */
    protected DataSource getDataSource() {
        return source;
    }

    /**
     * Sets indexer properties.
     */
    protected void setProperties(Properties props) {
        this.props = props;
    }

    /**
     * Gets indexer properties
     * @return Properties object of this {@link Indexer}
     */
    protected Properties getProperties() {
        return props;
    }

    /**
     * Initializes indexer.
     */
    protected void init() {
        this.props = new Properties();
    }

    @Override
    public void index() throws IndexException {
        throw new UnsupportedOperationException("Method not implemented");
    }
}
