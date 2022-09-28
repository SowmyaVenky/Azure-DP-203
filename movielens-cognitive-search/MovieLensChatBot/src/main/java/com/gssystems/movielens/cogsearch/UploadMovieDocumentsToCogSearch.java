package com.gssystems.movielens.cogsearch;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import com.azure.core.credential.AzureKeyCredential;
import com.azure.search.documents.indexes.SearchIndexAsyncClient;
import com.azure.search.documents.indexes.SearchIndexClientBuilder;
import com.azure.search.documents.models.IndexingResult;
import com.google.gson.Gson;

public class UploadMovieDocumentsToCogSearch {
	private static final String INDEX_NAME = "movielens";
	private static final int BATCH_SIZE = 100;
	
	private static Properties loadPropertiesFromResource(String resourcePath) throws IOException {
        InputStream inputStream = CreateMovieLensIndex.class.getResourceAsStream(resourcePath);
        Properties configProperties = new Properties();
        configProperties.load(inputStream);
        return configProperties;
    }
	
	public static void main(String[] args) throws Exception {				
		    if (args == null || args.length != 1 ) {
		    	System.out.println("Please specify the path to the movies json file to index!");
		    	System.exit(-1);
		    }
		    
            Properties config = loadPropertiesFromResource("/com/gssystems/movielens/cogsearch/config.properties");
            String endPoint = config.getProperty("ENDPOINT");
            String serviceName = config.getProperty("SearchServiceName");
            String searchServiceAdminKey = config.getProperty("SearchServiceAdminKey");

            String moviesFile = args[0];
            
            SearchIndexAsyncClient searchClient = new SearchIndexClientBuilder()
                    .endpoint(String.format(endPoint, serviceName))
                    .credential(new AzureKeyCredential(searchServiceAdminKey))                    
                    .buildAsyncClient();
            
            System.out.println("uploading docs to movielens search index on azure... ");
            loadDocumentsIntoIndex(searchClient, moviesFile);
	}

	private static void loadDocumentsIntoIndex(SearchIndexAsyncClient searchClient, String moviesFile) throws Exception {
		FileReader fr = new FileReader(moviesFile);
		BufferedReader br = new BufferedReader(fr);
		String aLine = null;
		
		List<Map<String, Object>> docs = new ArrayList<Map<String, Object>>();
		int recs = 0;
		Gson gs = new Gson();
		
		while((aLine = br.readLine()) != null ) {
			recs++;
			Map<String,Object> data = gs.fromJson(aLine, Map.class);
			
			//Push payload to index.
			if( recs % BATCH_SIZE == 0 ) {
				docs.add(data);
				List<IndexingResult> result = searchClient.getSearchAsyncClient(INDEX_NAME).mergeOrUploadDocuments(docs).block().getResults();
				for( IndexingResult r : result) {
					int respcode = r.getStatusCode();
					if( respcode != 200 && respcode != 201) {
						System.out.println( "ERROR IN INDEXING...key = " + r.getKey() + " status code: " + r.getStatusCode() + " error: " + r.getErrorMessage());
					}
				}
				docs.clear();
				System.out.println("Pushed " + recs + " records...");
			}
			else {
				docs.add(data);
			}
			
			//System.out.println(aLine);
		}
		
		System.out.println("Processing last batch! ");
		//Last batch of remaining docs..
		List<IndexingResult> result = searchClient.getSearchAsyncClient(INDEX_NAME).mergeOrUploadDocuments(docs).block().getResults();
		for( IndexingResult r : result) {
			int respcode = r.getStatusCode();
			if( respcode != 200 && respcode != 201) {
				System.out.println( "ERROR IN INDEXING...key = " + r.getKey() + " status code: " + r.getStatusCode() + " error: " + r.getErrorMessage());
			}
		}		
		
		System.out.println("Indexing complete... total records : " + recs);
	}
}
