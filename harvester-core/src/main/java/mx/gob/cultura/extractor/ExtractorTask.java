package mx.gob.cultura.extractor;

import org.apache.log4j.Logger;
import org.semanticwb.datamanager.DataObject;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Iterator;
import java.util.TimerTask;

/**
 * Recurrent task for Extractor launching.
 * @author juan.fernandez
 */
public class ExtractorTask extends TimerTask {
    private static final Logger log = Logger.getLogger(ExtractorTask.class);

    @Override
    public void run() {
        //throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
        checkExtractorPeriodicity();
    }

    public void checkExtractorPeriodicity(){
        // Obtener todos los extractores con periodicidad y ver cada cuando se tienen que ejecutar
        log.trace("\nRevisando periodicidad......\n\n"+new Date().toString());
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
        Iterator<String> it = ExtractorManager.hmExtractor.keySet().iterator();
        while (it.hasNext()) {  //
            String next = it.next();
            //log.debug("key----"+next);
            Extractor extractor = ExtractorManager.hmExtractor.get(next);

            if(null!=extractor){
                log.trace("Extractor "+extractor.getName()+" Status:("+extractor.getStatus()+")");
            } else {
                log.trace("Extractor NULL===("+(extractor==null?"TRUE":"FALSE")+")");
            }
            log.trace("\n=============================================");
            if (null!=extractor && (extractor.getStatus() == Extractor.STATUS.LOADED || extractor.getStatus() == Extractor.STATUS.STOPPED)) {
                try {
                    DataObject dobj = extractor.getDefinitionObject();
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
                        log.trace("Ultima ejecución:"+lastExec);
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
                            log.debug("ID:"+dobj.getId());
                            log.debug("Revisando fecha ejecución..."+fechaejecucion);
                            log.debug("Revisando fecha actual..."+now.getTime());
                            log.debug(now.getTime()-fechaejecucion);
                            log.debug("Se tiene que ejecutar....."+(now.getTime()>=fechaejecucion));
                            log.trace("=============================================\n");
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
                    log.error("Error al obtener la definición del Extractor. ", e);
                }
            }
        }
        log.trace("Terminando de revisar periodicidad...."+new Date().toString());
    }
}
