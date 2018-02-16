package mx.gob.cultura.transformer;

import jdk.nashorn.api.scripting.ScriptObjectMirror;
import mx.gob.cultura.commons.mapper.Mapper;
import org.apache.log4j.Logger;
import org.semanticwb.datamanager.DataObject;
import org.semanticwb.datamanager.DataUtils;

import javax.script.ScriptEngine;
import javax.script.ScriptException;

/**
 * Implements a {@link Mapper} to transform a SWBForms {@link DataObject} using a {@link ScriptEngine}.
 * @author Hasdai Pacheco
 */
public class DataObjectScriptEngineMapper implements Mapper<DataObject, DataObject> {
    private static final Logger log = Logger.getLogger(DataObjectScriptEngineMapper.class);
    private ScriptObjectMirror mapFunction;
    private ScriptEngine engine;

    /**
     * Constructor. Creates a new instance of {@link DataObjectScriptEngineMapper}.
     * @param engine {@link ScriptEngine} object to use;
     * @param mapFunction Javascript function to execute on the source of transformation.
     */
    public DataObjectScriptEngineMapper(ScriptEngine engine, String mapFunction) {
        this.engine = engine;

        try {
            this.mapFunction = (ScriptObjectMirror) engine.eval(mapFunction);
        }catch (ScriptException scex) {
            log.error("Error parsing map function", scex);
        }
    }

    @Override
    public DataObject map(DataObject source) {
        if (null != mapFunction) {
            try {
                ScriptObjectMirror result = (ScriptObjectMirror) mapFunction.call(engine, source);
                if (null != result) {
                    return DataUtils.toDataObject(result);
                }
            } catch (Exception e) {
                log.error("Error mapping object ", e);
            }
        }

        return source;
    }
}