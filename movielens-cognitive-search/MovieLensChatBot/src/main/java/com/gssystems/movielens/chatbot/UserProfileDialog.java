// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

package com.gssystems.movielens.chatbot;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

import com.gssystems.movielens.cogsearch.SearchMovies;
import com.microsoft.bot.builder.MessageFactory;
import com.microsoft.bot.builder.StatePropertyAccessor;
import com.microsoft.bot.builder.UserState;
import com.microsoft.bot.dialogs.ComponentDialog;
import com.microsoft.bot.dialogs.DialogTurnResult;
import com.microsoft.bot.dialogs.WaterfallDialog;
import com.microsoft.bot.dialogs.WaterfallStep;
import com.microsoft.bot.dialogs.WaterfallStepContext;
import com.microsoft.bot.dialogs.choices.ChoiceFactory;
import com.microsoft.bot.dialogs.choices.FoundChoice;
import com.microsoft.bot.dialogs.prompts.ChoicePrompt;
import com.microsoft.bot.dialogs.prompts.ConfirmPrompt;
import com.microsoft.bot.dialogs.prompts.PromptOptions;
import com.microsoft.bot.dialogs.prompts.TextPrompt;

public class UserProfileDialog extends ComponentDialog {
	private final StatePropertyAccessor<UserProfile> userProfileAccessor;
	private static final Map<String, List<String>> facets = SearchMovies.getFacets();
	
	public UserProfileDialog(UserState withUserState) {
		super("UserProfileDialog");

		userProfileAccessor = withUserState.createProperty("UserProfile");

		WaterfallStep[] waterfallSteps = { UserProfileDialog::topLevelSearchBasisStep, UserProfileDialog::searchTextStep,
				this::searchTextConfirmStep, this::performSearchStep };

		// Add named dialogs to the DialogSet. These names are saved in the dialog
		// state.
		addDialog(new WaterfallDialog("WaterfallDialog", Arrays.asList(waterfallSteps)));
		addDialog(new TextPrompt("TextPrompt"));
		addDialog(new ChoicePrompt("ChoicePrompt"));
		addDialog(new ConfirmPrompt("ConfirmPrompt"));

		// The initial child Dialog to run.
		setInitialDialogId("WaterfallDialog");
	}

	private static CompletableFuture<DialogTurnResult> topLevelSearchBasisStep(WaterfallStepContext stepContext) {
		PromptOptions promptOptions = new PromptOptions();
		promptOptions.setPrompt(MessageFactory.text("How do you want to search for movies?"));
		promptOptions.setChoices(ChoiceFactory.toChoices("Title", "Cast", "Keywords", "Genre", "Language"));

		return stepContext.prompt("ChoicePrompt", promptOptions);
	}

	private static CompletableFuture<DialogTurnResult> searchTextStep(WaterfallStepContext stepContext) {
		stepContext.getValues().put("topLevelSearchBasis", ((FoundChoice) stepContext.getResult()).getValue());

		FoundChoice userSelectedItem = (FoundChoice) stepContext.getResult();
		String userSelectedValue = userSelectedItem.getValue();
		
		PromptOptions promptOptions = new PromptOptions();

		//Let us see if the person gets one of the faceted items.
		if( userSelectedValue != null && userSelectedValue.equalsIgnoreCase("Cast")) {
			List<String> values = facets.get("cast");
			if( values != null && values.size() > 0 ) {
				promptOptions.setChoices(ChoiceFactory.toChoices(values));
			}
			return stepContext.prompt("ChoicePrompt", promptOptions);
		}

		//Let us see if the person gets one of the faceted items.
		if( userSelectedValue != null && userSelectedValue.equalsIgnoreCase("Genre")) {
			List<String> values = facets.get("genres");
			if( values != null && values.size() > 0 ) {
				promptOptions.setChoices(ChoiceFactory.toChoices(values));
			}
			return stepContext.prompt("ChoicePrompt", promptOptions);
		}

		//Let us see if the person gets one of the faceted items.
		if( userSelectedValue != null && userSelectedValue.equalsIgnoreCase("Language")) {
			List<String> values = facets.get("original_language");
			if( values != null && values.size() > 0 ) {
				promptOptions.setChoices(ChoiceFactory.toChoices(values));
			}
			return stepContext.prompt("ChoicePrompt", promptOptions);
		}

		promptOptions.setPrompt(
				MessageFactory.text("Please enter the search term for searching on \"" + userSelectedValue + "\""));
		return stepContext.prompt("TextPrompt", promptOptions);
	}

	private CompletableFuture<DialogTurnResult> searchTextConfirmStep(WaterfallStepContext stepContext) {
		//When we get to this step, the user might have selected either options presented, or might have just typed in a keyword.
		//The object returned will be either a FoundChoice or String.
		
		String searchTermFromUser = "";
		
		Object userSelectedSearchTerm = stepContext.getResult();
		if( userSelectedSearchTerm instanceof FoundChoice ) {
			searchTermFromUser = ( (FoundChoice) userSelectedSearchTerm ).getValue();
		}else {
			searchTermFromUser = userSelectedSearchTerm.toString();
		}
		
		stepContext.getValues().put("searchTerm", searchTermFromUser);
		
		String searchBasis = "Unknown";
		
		Object userSelectedItem = stepContext.getValues().get("topLevelSearchBasis");
		if( userSelectedItem != null ) {
			searchBasis = userSelectedItem.toString();
		}
		
		// We can send messages to the user at any point in the WaterfallStep.
		return stepContext.getContext()
				.sendActivity(MessageFactory.text(
						String.format("Thanks will search for movies having \"%s\" in the \"%s\" field ", searchTermFromUser, searchBasis)))
				.thenCompose(resourceResponse -> {
					// WaterfallStep always finishes with the end of the Waterfall or with another
					// dialog; here it is a Prompt Dialog.
					PromptOptions promptOptions = new PromptOptions();
					promptOptions.setPrompt(MessageFactory.text("Is this what you want to do?"));
					return stepContext.prompt("ConfirmPrompt", promptOptions);
				});
				
	}

	private CompletableFuture<DialogTurnResult> performSearchStep(WaterfallStepContext stepContext) {
		if ((Boolean) stepContext.getResult()) {
			// User said "yes" so we will be perform the actual step here.
			return stepContext.getContext().sendActivity(MessageFactory.text("Here are your search results! Top 10 results are shown. Type any message to restart"))
					.thenCompose(resourceResponse -> stepContext.endDialog());
		}

		// User said "no" so we will skip the next step. Give -1 as the age.
		return stepContext.replaceDialog("WaterfallDialog");
	}
}
