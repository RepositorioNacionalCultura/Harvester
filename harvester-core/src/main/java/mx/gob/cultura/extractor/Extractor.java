package mx.gob.cultura.extractor;

import org.semanticwb.datamanager.DataObject;

/**
 *
 * @author juan.fernandez
 */
public interface Extractor {

    
    public void start();

    public void stop();

    public String getStatus();

    public String getName();

    public boolean canStart();
    
    public boolean update();
    
    public boolean replace();

    public String getType();  //From DB, From EndPoint ???
    
    public String getScript();
    
    public DataObject getDefinitionObject();
    
    public void index() throws Exception;
    
    public void process() throws Exception;

    public void extract() throws Exception;

}
