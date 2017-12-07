/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package demo;

import java.io.IOException;
import org.semanticwb.datamanager.DataMgr;
import org.semanticwb.datamanager.DataObject;
import org.semanticwb.datamanager.SWBScriptEngine;

/**
 *
 * @author javiersolis
 */
public class Counter 
{
    public static synchronized int count(SWBScriptEngine eng) throws IOException
    {
        //SWBScriptEngine eng=DataMgr.initPlatform("/demo/datasources.js", session);
        //{data:{nombre:"notas"}}
        DataObject query=new DataObject();
        query.addSubObject("data").addParam("nombre", "notas");

        DataObject res=eng.getDataSource("Variables").fetch(query);
        DataObject obj=res.getDataObject("response")
                        .getDataList("data")
                        .getDataObject(0);

        int counter=Integer.parseInt(obj.getString("valor"))+1;    
        obj.put("valor", ""+counter);
        eng.getDataSource("Variables").updateObj(obj);

        return counter;
    }
    
}
