package mx.gob.cultura.util;

import com.mongodb.MongoClient;
import jdk.nashorn.api.scripting.ScriptObjectMirror;
import org.apache.http.HttpHost;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestHighLevelClient;
import org.json.JSONArray;
import org.json.JSONObject;

import java.util.*;

/**
 * Utility class with common methods.
 *
 * @author Hasdai Pacheco
 */
public final class Util {
    private Util() {
    }

    /**
     * Inner class to encapsulate methods related to DataBase actions.
     */
    public static final class DB {
        private static HashMap<String, MongoClient> mongoClients = new HashMap<>();
        private static HashMap<String, RestHighLevelClient> elasticClients = new HashMap<>();

        /**
         * Gets a {@link MongoClient} instance with default host and port.
         *
         * @return MongoClient instance object.
         */
        public static MongoClient getMongoClient() {
            return getMongoClient("localhost", 27017);
        }

        /**
         * Gets a {@link MongoClient} instance with given host and port.
         *
         * @param host MongoDB server host.
         * @param port MongoDB server port.
         * @return MongoClient instance object.
         */
        public static MongoClient getMongoClient(String host, int port) {
            MongoClient ret = mongoClients.get(host + ":" + String.valueOf(port));
            if (null == ret) {
                ret = new MongoClient(host, port);
                mongoClients.put(host + ":" + String.valueOf(port), ret);
            }

            return ret;
        }

        /**
         * Gets a {@link RestHighLevelClient} instance with default host and port.
         *
         * @return RestHighLevelClient instance object.
         */
        public static RestHighLevelClient getElasticClient() {
            return getElasticClient("localhost", 9200);
        }

        /**
         * Gets a {@link RestHighLevelClient} instance with given host and port.
         *
         * @param host ElasticSearch node host name.
         * @param port ElasticSearch node port.
         * @return RestHighLevelClient instance object.
         */
        public static RestHighLevelClient getElasticClient(String host, int port) {
            RestHighLevelClient ret = elasticClients.get(host + ":" + String.valueOf(port));
            if (null == ret) {
                ret = new RestHighLevelClient(
                        RestClient.builder(new HttpHost(host, port)));

                elasticClients.put(host + ":" + String.valueOf(port), ret);
            }
            return ret;
        }
    }
}
