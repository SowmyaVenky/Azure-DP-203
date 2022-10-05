package com.gssystems.movielens.chatbot;

import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.CompletionException;

import org.apache.commons.io.IOUtils;
import org.apache.commons.text.StringEscapeUtils;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.gssystems.movielens.cogsearch.MovieDTO;
import com.microsoft.bot.schema.Attachment;

public class MovieAdaptiveCardBuilder {
	public static Attachment buildAdaptiveCard(MovieDTO amovie) {
		Attachment adaptiveCardAttachment = new Attachment();

		try (InputStream inputStream = adaptiveCardAttachment.getClass().getClassLoader()
				.getResourceAsStream("movieResultsadaptiveCard.json")) {

			String imdbId = amovie.getImdbId();
			String movieDetailsURL = "https://www.imdb.com/title/" + imdbId + "/";
			String reviewsURL = "https://www.imdb.com/title/" + imdbId + "/reviews/";
			String videogallery = "https://www.imdb.com/title/" + imdbId + "/videogallery/";
			String imageForPoster = ImdbImageExtractor.extractImageURL(imdbId);
			if (imageForPoster == null) {
				// Default image.
				imageForPoster = "https://m.media-amazon.com/images/S/sash/8ZhQrGnWn9cWUVQ.png";
			}

			String result = IOUtils.toString(inputStream, StandardCharsets.UTF_8);
			String cardFilledWithPlaceholders = String.format(result,
					new Object[] { StringEscapeUtils.escapeJson(amovie.getTitle()),
							StringEscapeUtils.escapeJson(amovie.getTagLine()), imageForPoster,
							StringEscapeUtils.escapeJson(amovie.getOverview()), movieDetailsURL, reviewsURL,
							videogallery });

			adaptiveCardAttachment.setContentType("application/vnd.microsoft.card.adaptive");
			adaptiveCardAttachment
					.setContent(new ObjectMapper().readValue(cardFilledWithPlaceholders, ObjectNode.class));

			return adaptiveCardAttachment;
		} catch (Throwable t) {
			throw new CompletionException(t);
		}
	}
}
