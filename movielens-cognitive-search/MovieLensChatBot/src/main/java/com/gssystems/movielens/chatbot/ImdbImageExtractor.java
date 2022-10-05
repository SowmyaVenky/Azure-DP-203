package com.gssystems.movielens.chatbot;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URL;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

public class ImdbImageExtractor {
	public static void main(String[] args) throws Exception {
		String imdbId = "tt0241527";
		String imageURL = extractImageURL(imdbId);
		System.out.println(imageURL);
	}

	public static String extractImageURL(String imdbId) throws Exception {
		URL url = new URL("https://www.imdb.com/title/" + imdbId + "/videogallery/");
		BufferedReader in = new BufferedReader(new InputStreamReader(url.openStream()));

		StringBuffer b = new StringBuffer();
		String inputLine;
		while ((inputLine = in.readLine()) != null)
			b.append(inputLine);
		in.close();

		Document doc = Jsoup.parse(b.toString());
		Elements image = doc.getElementsByTag("img");

		for (Element el : image) {
			String src = el.absUrl("src");
			if (src.indexOf("https://m.media-amazon.com/images/M/") > -1) {
				return src;
			}
		}
		return null;
	}

}
