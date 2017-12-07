package mx.gob.cultura.test;

import mx.gob.cultura.util.URLBuilder;
import mx.gob.cultura.util.URLBuilderBase;
import mx.gob.cultura.util.oai.OAIPMHURLBuilder;
import org.junit.Test;

import java.net.MalformedURLException;

import static org.junit.Assert.assertEquals;

public class OAIPMHURLBuilderTest {

    @Test
    public void buildURL() throws MalformedURLException {
        URLBuilder builder = new URLBuilderBase("https://test.mx/api/v1/oai2");
        builder.putQueryParameter("verb", "Identify");

        assertEquals(builder.build().toString(), "https://test.mx/api/v1/oai2?verb=Identify");

        builder.removeQueryParameters();
        builder.putQueryParameter("verb", "ListIdentifiers");
        builder.putQueryParameter("metadataPrefix", "mods");

        assertEquals(builder.build().toString(), "https://test.mx/api/v1/oai2?metadataPrefix=mods&verb=ListIdentifiers");

        builder.putQueryParameter("verb", "GetRecord");
        builder.putQueryParameter("identifier", "23441");
        assertEquals(builder.build().toString(), "https://test.mx/api/v1/oai2?identifier=23441&metadataPrefix=mods&verb=GetRecord");
    }

    @Test
    public void buildOAIURL() throws MalformedURLException {
        OAIPMHURLBuilder builder = new OAIPMHURLBuilder("https://test.mx/api/v1/oai2");

        builder.setVerb(OAIPMHURLBuilder.VERB.Identify);
        assertEquals(builder.build().toString(), "https://test.mx/api/v1/oai2?verb=Identify");

        builder.setVerb(OAIPMHURLBuilder.VERB.ListIdentifiers).setPrefix(OAIPMHURLBuilder.PREFIX.mods);
        assertEquals(builder.build().toString(), "https://test.mx/api/v1/oai2?metadataPrefix=mods&verb=ListIdentifiers");

        builder.setVerb(OAIPMHURLBuilder.VERB.ListRecords).setPrefix(OAIPMHURLBuilder.PREFIX.mods);
        assertEquals(builder.build().toString(), "https://test.mx/api/v1/oai2?metadataPrefix=mods&verb=ListRecords");

        builder.setVerb(OAIPMHURLBuilder.VERB.GetRecord).setIdentifier("23441");
        assertEquals(builder.build().toString(), "https://test.mx/api/v1/oai2?identifier=23441&metadataPrefix=mods&verb=GetRecord");
    }
}
