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
		String imdbId = "tt0246460";
		String imageURL = extractMoviePosterImageURL(imdbId);
		System.out.println(imageURL);
		String movieTrailerURL = extractMovieTrailerURL(imdbId);
		System.out.println(movieTrailerURL);
	}

	public static String extractMoviePosterImageURL(String imdbId) throws Exception {
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

	public static String extractMovieTrailerURL(String imdbId) throws Exception {
		URL url = new URL("https://www.imdb.com/title/" + imdbId + "/videogallery/");
		BufferedReader in = new BufferedReader(new InputStreamReader(url.openStream()));

		StringBuffer b = new StringBuffer();
		String inputLine;
		while ((inputLine = in.readLine()) != null)
			b.append(inputLine);
		in.close();

		Document doc = Jsoup.parse(b.toString());
		Elements image = doc.getElementsByClass("video-modal");

		for (Element el : image) {
			return "https://www.imdb.com" + el.attr("href");
		}
		return null;
	}
}
