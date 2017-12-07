
import com.mongodb.util.JSON;
import java.util.ArrayList;
import java.util.List;
import java.util.function.Consumer;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 *
 * @author javiersolis
 */
public class Test {
    public static void main(String[] args) {
        //String source="[GLOBAL]";
        //String source="/catalogs/datasource.js";
        String source="/test/[\"datasource.js\",\"/catalogs/datasource.js\"]";
        ArrayList<String> sources=new ArrayList();
        if(!source.equals("[GLOBAL]"))
        {
            int i=source.indexOf("[");
            if(i>-1)
            {
                String base=source.substring(0,i);
                String arr=source.substring(i);
                List<String> o=(List)JSON.parse(arr);
                System.out.println(o);
                o.forEach(s->{
                    if(s.startsWith("/"))
                    {
                        sources.add(s);
                    }else
                    {
                        sources.add(base+s);
                    }
                });
            }else
            {
                sources.add(source);
            }
        }
        
        System.out.println(sources.size()+":"+sources);
        
    }
}
