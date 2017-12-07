## Aplicación de extracción de datos de diferentes orígenes para el Repositorio Digital del Patrimonio Cultural de México

Aplicación construida utilizando como base [SWBForms](https://github.com/SWBForms/SWBForms). Requiere un servidor de bases de datos MongoDB.


### Quickstart
````
git clone https://github.com/RepositorioNacionalCultura/Harvester.git
cd Harvester
mvn clean && mvn package
java -jar webapp/target/dependency/webapp-runner.jar webapp/target/Harvester.war 
````

En un navegador ir a http://localhost:8080