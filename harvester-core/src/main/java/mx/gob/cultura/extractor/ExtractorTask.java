/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package mx.gob.cultura.extractor;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Iterator;
import java.util.TimerTask;
import org.semanticwb.datamanager.DataObject;

/**
 *
 * @author juan.fernandez
 */
public class ExtractorTask extends TimerTask {

    @Override
    public void run() {
        //throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
        checkExtractorPeriodicity();
    }
    
    public void checkExtractorPeriodicity(){
        // Obtener todos los extractores con periodicidad y ver cada cuando se tienen que ejecutar
        System.out.println("\nRevisando periodicidad......\n\n"+new Date().toString());
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
        Iterator<String> it = ExtractorManager.hmExtractor.keySet().iterator();
        while (it.hasNext()) {  //
            String next = it.next();
            System.out.println("key----"+next);
            Extractor extractor = ExtractorManager.hmExtractor.get(next);
            System.out.println("Extractor NULL===("+(extractor==null?"TRUE":"FALSE")+")");
             
             System.out.println("Status:"+(extractor!=null?extractor.getStatus():"NULL"));
             System.out.println("\n=============================================");
            if (null!=extractor && (extractor.getStatus().equals("LOADED")|| extractor.getStatus().equals("STOPPED"))) {
                try {
                    DataObject dobj = ExtractorManager.hmExtractorDef.get(next);
                    Date now = new Date();
                    // Revisando si tiene periodicidad
                    boolean hasPeriodicity = false;
                    try {
                        hasPeriodicity = dobj.getBoolean("periodicity");
                    } catch (Exception e) {
                        hasPeriodicity = false;
                    }
                    if (hasPeriodicity) {
                        //obteniendo la fecha de última ejecución
                        String lastExec = dobj.getString("lastExecution");
                        System.out.println("Ultima ejecución:"+lastExec);
                        if(null!=lastExec){
                            //obteniendo el tiempo
                            long tiempo = dobj.getInt("interval",1);
                            //obteniendo Unidad de tiempo: h|d|m (horas, días, meses)
                            //String unidad = dobj.getString("unit");
                            long unitmilis = 1000;
                            //if(unidad.equals("h")){ // equivalencia de una hora en milisegundos
                                //unitmilis = 60 * 60 * 1000;
                            //    unitmilis = 1000;
                            //} else if(unidad.equals("d")){ // equivalencia de un dia en milisegundos
                                unitmilis = 24 * 60 * 60 * 1000;
                            //} else if(unidad.equals("m")){// equivalencia de un mes de 30 dias a milisegundos
                            //    unitmilis = 30 * 24 * 60 * 60 * 1000;
                            //}
                            Date nextExecution = sdf.parse(lastExec);
                            long fechaejecucion = nextExecution.getTime()+(tiempo*unitmilis);
                            System.out.println("ID:"+dobj.getId());
                            System.out.println("Revisando fecha ejecución..."+fechaejecucion);
                            System.out.println("Revisando fecha actual..."+now.getTime());
                            System.out.println(now.getTime()-fechaejecucion);
                            System.out.println("Se tiene que ejecutar....."+(now.getTime()>=fechaejecucion));
                            System.out.println("=============================================\n");
                            if(now.getTime() >= fechaejecucion){
                                extractor.start();
                                //dobj.addParam("lastExecution", sdf.format(now));
                                //org.semanticwb.oaiextractor.ExtractorManager.datasource.updateObj(dobj);
                            }
                        } else { // se ejecuta el extractor y se actualiza la fecha de ultima ejecucion 
                            extractor.start();
                            //dobj.addParam("lastExecution", sdf.format(now));
                            //org.semanticwb.oaiextractor.ExtractorManager.datasource.updateObj(dobj);
                        }
                    }
                } catch ( ParseException e) { //IOException |
                    System.out.println("Error al obtener la definición del Extractor. " + e.getMessage());
                }
            }
        }
        System.out.println("Terminando de revisar periodicidad...."+new Date().toString());
    }
    
}
