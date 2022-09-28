package com.gssystems.movielens.chatbot;

import com.gssystems.movielens.cogsearch.MovieDTO;
import com.microsoft.bot.schema.ActionTypes;
import com.microsoft.bot.schema.CardAction;
import com.microsoft.bot.schema.CardImage;
import com.microsoft.bot.schema.HeroCard;

public class MovieAdaptiveCardBuilder {
	private static boolean includeImages = false;

	public static HeroCard buildAdaptiveCard(MovieDTO amovie) {
		HeroCard heroCard = new HeroCard();
		heroCard.setTitle(amovie.getTitle());
		heroCard.setSubtitle(amovie.getTagLine());
		heroCard.setText(amovie.getOverview());
		if (includeImages) {
			heroCard.setImages(new CardImage(
					"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvhJJ6YylOFTggEiAUEQHHi-aAgWcTXbBuNiprQ156zqhTdiOa9_k5&usqp=CAU"));
		}
		if (amovie.getHomePage() != null && !amovie.getHomePage().isEmpty()) {
			heroCard.setButtons(new CardAction(ActionTypes.OPEN_URL, "Movie Details", amovie.getHomePage()));
		}

		return heroCard;
	}
}
