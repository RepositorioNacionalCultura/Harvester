package mx.gob.cultura.extractor;

import java.io.IOException;

import org.apache.log4j.Logger;
import org.semanticwb.datamanager.DataObject;
import org.semanticwb.datamanager.SWBDataSource;
import org.semanticwb.datamanager.SWBScriptEngine;

/**
 * Base class that implements core methods of an {@link Extractor}.
 * @author juan.fernandez
 */
public abstract class ExtractorBase implements Extractor {
    static Logger log = Logger.getLogger(ExtractorBase.class);
    protected DataObject extractorDef;
    protected SWBScriptEngine engine;
    protected SWBDataSource dsExtract;
    private SWBDataSource ds;
    private STATUS status = STATUS.LOADED;

    /**
     * Constructor. Creates a new instance of {@link ExtractorBase}.
     * @param doID Identifier of {@link DataObject} with extractor definition.
     * @param eng {@link SWBScriptEngine} object to use.
     */
    public ExtractorBase(String doID, SWBScriptEngine eng)
    {
        engine = eng;
        if (eng != null) {
            dsExtract = engine.getDataSource("Extractor");
            try {
                extractorDef = dsExtract.fetchObjById(doID);
                log.debug("Extractor status: "+extractorDef.getString("status"));
                status = STATUS.valueOf(extractorDef.getString("status", "LOADED"));
            } catch (IOException e) {
                log.error("Error getting DataObject definition for extractor "+doID, e);
            }
        }
    }

    @Override
    public boolean update() {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    @Override
    public boolean replace() {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    @Override
    public void start() {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    @Override
    public void stop() {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    @Override
    public STATUS getStatus() {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    @Override
    public String getName() {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    @Override
    public boolean canStart() {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    @Override
    public String getType() //URL, URI(Support File) 
    {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    @Override
    public void extract() throws Exception {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    @Override
    public String getScript() {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    @Override
    public void process() throws Exception{
        throw new UnsupportedOperationException("Not supported yet.");
    }

    @Override
    public DataObject getDefinitionObject() {
        return extractorDef;
    }

    @Override
    public void index() throws Exception {
        throw new UnsupportedOperationException("Not supported yet.");
    }
}