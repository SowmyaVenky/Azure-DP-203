package com.gssystems.movielens.cogsearch;

import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;
import java.util.Properties;

import com.azure.core.credential.AzureKeyCredential;
import com.azure.search.documents.indexes.SearchIndexAsyncClient;
import com.azure.search.documents.indexes.SearchIndexClientBuilder;
import com.azure.search.documents.indexes.models.SearchField;
import com.azure.search.documents.indexes.models.SearchFieldDataType;
import com.azure.search.documents.indexes.models.SearchIndex;
import com.azure.search.documents.indexes.models.SearchSuggester;

//Sample record 
//{
//"movie_id":26,
//"is_adult":"False",
//"budget":1400000,
//"homepage":"http://www.walkonwatermovie.com",
//"original_language":"he",
//"original_title":"LaLehet Al HaMayim",
//"overview":"Eyal, an Israeli Mossad agent, is given the mission to track down and kill the very old Alfred Himmelman, an ex-Nazi officer, who might still be alive. Pretending to be a tourist guide, he befriends his grandson Axel, in Israel to visit his sister Pia. The two men set out on a tour of the country during which, Axel challenges Eyal's values.",
//"title":"Walk on Water",
//"popularity":1.709996,
//"release_date":"2004-02-05",
//"revenue":0,
//"runtime":103.0,
//"status":"Released",
//"tagline":"He was trained to hate until he met the enemy.",
//"vote_count":20,
//"vote_average":6.5,
//"genres":[],
//"keywords":[]
//}

/*
 * 
 * root
 |-- movie_id: string (nullable = true)
 |-- is_adult: string (nullable = true)
 |-- budget: long (nullable = true)
 |-- homepage: string (nullable = true)
 |-- original_language: string (nullable = true)
 |-- original_title: string (nullable = true)
 |-- overview: string (nullable = true)
 |-- title: string (nullable = true)
 |-- popularity: double (nullable = true)
 |-- release_date: date (nullable = true)
 |-- revenue: long (nullable = true)
 |-- runtime: float (nullable = true)
 |-- status: string (nullable = true)
 |-- tagline: string (nullable = true)
 |-- vote_count: integer (nullable = true)
 |-- vote_average: float (nullable = true)
 |-- genres: array (nullable = true)
 |    |-- element: string (containsNull = false)
 |-- keywords: array (nullable = true)
 |    |-- element: string (containsNull = false)
 |-- cast: array (nullable = true)
 |    |-- element: string (containsNull = false)
 */

public class CreateMovieLensIndex {
	private static final String INDEX_NAME = "movielens";
	
	private static Properties loadPropertiesFromResource(String resourcePath) throws IOException {
        InputStream inputStream = CreateMovieLensIndex.class.getResourceAsStream(resourcePath);
        Properties configProperties = new Properties();
        configProperties.load(inputStream);
        return configProperties;
    }
	
	public static void main(String[] args) throws Exception {		
            Properties config = loadPropertiesFromResource("/com/gssystems/movielens/cogsearch/config.properties");
            String endPoint = config.getProperty("ENDPOINT");
            String serviceName = config.getProperty("SearchServiceName");
            String searchServiceAdminKey = config.getProperty("SearchServiceAdminKey");
            //String apiVersion = config.getProperty("ApiVersion");
            
            SearchIndexAsyncClient searchClient = new SearchIndexClientBuilder()
                    .endpoint(String.format(endPoint, serviceName))
                    .credential(new AzureKeyCredential(searchServiceAdminKey))                    
                    .buildAsyncClient();
            
            System.out.println("Creating movielens search index on azure... ");
            createIndex(searchClient);
	}
	
	private static void createIndex(SearchIndexAsyncClient searchClient) throws IOException, InterruptedException {
        // Typical application initialization may createIndex an index if it doesn't exist. Deleting an index
	    // on initialization is a sample-only thing to do
	    SearchIndex index = new SearchIndex(INDEX_NAME);
	    index.setFields(Arrays.asList(
	            new SearchField("movie_id", SearchFieldDataType.STRING).setKey(true).setFilterable(true),
	            new SearchField("is_adult", SearchFieldDataType.STRING).setSearchable(true),
	            new SearchField("budget", SearchFieldDataType.DOUBLE),
	            new SearchField("homepage", SearchFieldDataType.STRING).setSearchable(true),
	            new SearchField("original_language", SearchFieldDataType.STRING).setSearchable(true).setFilterable(true).setSortable(true).setFacetable(true),
	            new SearchField("original_title", SearchFieldDataType.STRING).setSearchable(true),
	            new SearchField("overview", SearchFieldDataType.STRING).setSearchable(true),
	            new SearchField("title", SearchFieldDataType.STRING).setSearchable(true),
	            new SearchField("popularity", SearchFieldDataType.DOUBLE),
	            new SearchField("release_date", SearchFieldDataType.STRING).setSearchable(true),
	            new SearchField("revenue", SearchFieldDataType.DOUBLE),
	            new SearchField("runtime", SearchFieldDataType.DOUBLE),
	            new SearchField("status", SearchFieldDataType.STRING).setSearchable(true),
	            new SearchField("tagline", SearchFieldDataType.STRING).setSearchable(true),
	            new SearchField("vote_count", SearchFieldDataType.DOUBLE),
	            new SearchField("vote_average", SearchFieldDataType.DOUBLE),	            
	            new SearchField("genres", SearchFieldDataType.collection(SearchFieldDataType.STRING)).setSearchable(true).setFilterable(true).setFacetable(true),
	            new SearchField("keywords", SearchFieldDataType.collection(SearchFieldDataType.STRING)).setSearchable(true).setFilterable(true).setFacetable(true),
	            new SearchField("cast", SearchFieldDataType.collection(SearchFieldDataType.STRING)).setSearchable(true).setFilterable(true).setFacetable(true)
	    ));
	    
	    //index.setSuggesters(new SearchSuggester("sg", Arrays.asList("title")));
	    searchClient.createIndex(index).block();
	}
}
