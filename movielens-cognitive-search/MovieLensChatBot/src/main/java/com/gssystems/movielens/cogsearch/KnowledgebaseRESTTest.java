package com.gssystems.movielens.cogsearch;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;

import org.apache.http.Header;
import org.apache.http.NameValuePair;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicHeader;

public class KnowledgebaseRESTTest {
	public static void main(String[] args) {
		String JSON_STRING = "{\"top\":3,\"question\":\"What is Azure Kubernetes Service\",\"includeUnstructuredSources\":true,\"confidenceScoreThreshold\":\"0\",\"answerSpanRequest\":{\"enable\":true,\"topAnswersWithSpan\":1,\"confidenceScoreThreshold\":\"0\"}}";
		CloseableHttpClient httpClient = HttpClients.createDefault();
		HttpPost httpPost = new HttpPost(
				"https://venky-az900-language-resource-1001.cognitiveservices.azure.com/language/:query-knowledgebases?projectName=venky-az900-project-1001&api-version=2021-10-01&deploymentName=production");
		List<NameValuePair> params = new ArrayList<NameValuePair>();
		Header key = new BasicHeader("Ocp-Apim-Subscription-Key", "6eae03ec119d430b8b42f43d99280245");
		Header contentType = new BasicHeader("Content-Type", "application/json");
		httpPost.setHeaders(new Header[] { contentType, key });
		try {
			
			StringEntity requestEntity = new StringEntity(
				    JSON_STRING,
				    ContentType.APPLICATION_JSON);
			
			httpPost.setEntity(requestEntity);
			CloseableHttpResponse response = httpClient.execute(httpPost);
			System.out.println(response.getEntity());
			System.out.println(response);
		} catch (UnsupportedEncodingException ec) {
			throw new AssertionError(ec.getMessage());
		} catch (ClientProtocolException e) {
			throw new RuntimeException(e);
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
	}
}
