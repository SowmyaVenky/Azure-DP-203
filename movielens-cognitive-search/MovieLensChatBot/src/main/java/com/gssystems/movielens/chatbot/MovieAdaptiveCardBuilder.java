package com.gssystems.movielens.chatbot;

import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Random;
import java.util.concurrent.CompletionException;

import org.apache.commons.io.IOUtils;
import org.apache.commons.text.StringEscapeUtils;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.gssystems.movielens.cogsearch.MovieDTO;
import com.microsoft.bot.schema.Attachment;

public class MovieAdaptiveCardBuilder {
	private static final String[] fakeTrailerLinks = {
			"http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
			"http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
			"http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
			"http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
			"http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4"
	};
	
	public static Attachment buildAdaptiveCard(MovieDTO amovie) {		
		Attachment adaptiveCardAttachment = new Attachment();

		try (InputStream inputStream = adaptiveCardAttachment.getClass().getClassLoader()
				.getResourceAsStream("movieResultsadaptiveCard.json")) {

			String imdbId = amovie.getImdbId();
			String movieDetailsURL = "https://www.imdb.com/title/" + imdbId + "/";
			String reviewsURL = "https://www.imdb.com/title/" + imdbId + "/reviews/";
			String videogallery = "https://www.imdb.com/title/" + imdbId + "/videogallery/";
			String imageForPoster = ImdbImageExtractor.extractMoviePosterImageURL(imdbId);
			if (imageForPoster == null) {
				// Default image.
				imageForPoster = "https://m.media-amazon.com/images/S/sash/8ZhQrGnWn9cWUVQ.png";
			}

			String videoURL = ImdbImageExtractor.extractMovieTrailerURL(imdbId);
			if (videoURL == null) {
				videoURL = "https://adaptivecardsblob.blob.core.windows.net/assets/AdaptiveCardsOverviewVideo.mp4";
			}

			Random randomGenerator=new Random();
			int index = randomGenerator.nextInt(5);
			
			// Hard coded trailer till I can figure out how to get to it.
			String result = IOUtils.toString(inputStream, StandardCharsets.UTF_8);
			String cardFilledWithPlaceholders = String.format(result, new Object[] {
					StringEscapeUtils.escapeJson(amovie.getTitle()), StringEscapeUtils.escapeJson(amovie.getTagLine()),
					imageForPoster, StringEscapeUtils.escapeJson(amovie.getOverview()),
					"https://dcassetcdn.com/design_img/236622/39748/39748_2420982_236622_image.jpg",
					fakeTrailerLinks[index], movieDetailsURL, reviewsURL, videoURL });

			adaptiveCardAttachment.setContentType("application/vnd.microsoft.card.adaptive");
			adaptiveCardAttachment
					.setContent(new ObjectMapper().readValue(cardFilledWithPlaceholders, ObjectNode.class));

			return adaptiveCardAttachment;
		} catch (Throwable t) {
			throw new CompletionException(t);
		}
	}
}
