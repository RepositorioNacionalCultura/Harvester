package mx.gob.cultura.transformer;

import mx.gob.cultura.commons.mapper.Mapper;
import org.json.JSONObject;
import org.json.XML;

/**
 * Implements a {@link Mapper} to translate XML Strings into JSON objects using org.json library.
 * @author Hasdai Pacheco
 */
public class XMLStringToJSONMapper implements Mapper<String, JSONObject> {

    @Override
    public JSONObject map(String source) {
        return XML.toJSONObject(source, true);
    }
}