package mx.gob.cultura.extractor;

import org.semanticwb.datamanager.DataObject;

/**
 * Interface that defines Extractor behavior.
 * @author juan.fernandez
 */
public interface Extractor {

    public void start();

    public void stop();

    public STATUS getStatus();

    public String getName();

    public boolean canStart();

    public boolean update();

    public boolean replace();

    public String getType();

    public String getScript();

    public DataObject getDefinitionObject();

    public void index() throws Exception;

    public void process() throws Exception;

    public void extract() throws Exception;

    public static enum STATUS {
        LOADED, STARTED, EXTRACTING, PROCESSING, INDEXING, FINISHED, PROCESSED, STOPPED, ABORTED, FAILLOAD
    }

}
