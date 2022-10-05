// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

package com.gssystems.movielens.chatbot;

import com.codepoetics.protonpack.collectors.CompletableFutures;
import com.microsoft.bot.builder.ActivityHandler;
import com.microsoft.bot.builder.BotState;
import com.microsoft.bot.builder.ConversationState;
import com.microsoft.bot.builder.MessageFactory;
import com.microsoft.bot.dialogs.Dialog;
import com.microsoft.bot.schema.ChannelAccount;
import com.microsoft.bot.builder.TurnContext;
import com.microsoft.bot.builder.UserState;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.concurrent.CompletableFuture;
import org.apache.commons.lang3.StringUtils;

/**
 * This IBot implementation can run any type of Dialog. The use of type
 * parameterization is to allows multiple different bots to be run at different
 * endpoints within the same project. This can be achieved by defining distinct
 * Controller types each with dependency on distinct IBot types, this way ASP
 * Dependency Injection can glue everything together without ambiguity. The
 * ConversationState is used by the Dialog system. The UserState isn't, however,
 * it might have been used in a Dialog implementation, and the requirement is
 * that all BotState objects are saved at the end of a turn.
 */
public class DialogBot extends ActivityHandler {
	protected final Dialog dialog;
	protected final BotState conversationState;
	protected final BotState userState;

	private static final String WELCOME_MESSAGE = "Welcome! This bot will allow you to search for movies using various techniques. Please type any message to continue...";

	public DialogBot(ConversationState withConversationState, UserState withUserState, Dialog withDialog) {
		dialog = withDialog;
		conversationState = withConversationState;
		userState = withUserState;
	}

	@Override
	public CompletableFuture<Void> onTurn(TurnContext turnContext) {
		return super.onTurn(turnContext).thenCompose(result -> conversationState.saveChanges(turnContext))
				// Save any state changes that might have occurred during the turn.
				.thenCompose(result -> userState.saveChanges(turnContext));
	}

	@Override
	protected CompletableFuture<Void> onMessageActivity(TurnContext turnContext) {
		LoggerFactory.getLogger(DialogBot.class).info("Running dialog with Message Activity.");

		// Run the Dialog with the new message Activity.
		return Dialog.run(dialog, turnContext, conversationState.createProperty("DialogState"));
	}

	@Override
	protected CompletableFuture<Void> onMembersAdded(List<ChannelAccount> membersAdded, TurnContext turnContext) {
		return membersAdded.stream()
				.filter(member -> !StringUtils.equals(member.getId(), turnContext.getActivity().getRecipient().getId()))
				.map(channel -> {
					return Dialog.run(dialog, turnContext, conversationState.createProperty("DialogState"));
				}).collect(CompletableFutures.toFutureList()).thenApply(resourceResponses -> null);
	}
}
