package mx.gob.cultura.test;

import mx.gob.cultura.transformer.DataObjectScriptEngineMapper;
import org.json.JSONArray;
import org.json.JSONObject;
import org.junit.Test;
import org.semanticwb.datamanager.DataObject;

import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

public class DataObjectScriptEngineMapperTest {
    private static ScriptEngine engine;
    private static DataObjectScriptEngineMapper mapper;

    public DataObjectScriptEngineMapperTest() {
        InputStream scriptis = getClass().getClassLoader().getResourceAsStream("script_mediateca_mixed.js");
        String scriptsrc = readFile(scriptis);

        ScriptEngineManager factory = new ScriptEngineManager();
        engine = factory.getEngineByName("JavaScript");
        mapper = new DataObjectScriptEngineMapper(engine, scriptsrc);
    }

    @Test
    public void testConvert() {
        InputStream datais = getClass().getClassLoader().getResourceAsStream("data_mediateca_mixed.json");
        String jsonData = readFile(datais);

        if (null != jsonData && !jsonData.isEmpty()) {
            JSONArray data = new JSONArray(jsonData.toString());
            for (int i = 0; i < data.length(); i++) {
                JSONObject o = data.getJSONObject(i);

                DataObject dob = (DataObject) DataObject.parseJSON(o.toString());
                DataObject result = mapper.map(dob);
                System.out.println(result);
            }
        }
    }

    private String readFile(InputStream is) {
        StringBuilder json = new StringBuilder();
        if (null != is) {
            try (BufferedReader br = new BufferedReader(new InputStreamReader(is, "UTF-8")) ) {
                String line;
                while ((line = br.readLine()) != null) {
                    json.append(line);
                }
            } catch (IOException ioex) {
                ioex.printStackTrace();
            }
        }
        return json.toString();
    }
}
