import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { close, confirm, delegate, validateConfirmation } from "./utils.mjs";

export const handler = async (event, context) => {
  const slotName = Object.keys(event.sessionState.intent.slots);

  const outputSessionAttributes = event.sessionState.sessionAttributes || {};

  if (event.sessionState.intent.name === "GetRestaurantReviews") {
    var showMoreReviews = event.currentIntent.slots.ShowMoreReviews;
    var currentPage =
      (event.sessionAttributes && event.sessionAttributes.CurrentReviewPage) ||
      1;

    if (showMoreReviews) {
      currentPage++;
      outputSessionAttributes["CurrentReviewPage"] = currentPage;
    }
    // API call for fetching reviews for restaurant based on offset

    return event.sessionState.intent.confirmationState === "Confirmed"
      ? close(
          event.sessionState,
          "Fulfilled",
          outputSessionAttributes,
          {
            contentType: "PlainText",
            content: `Delight Dine's has following reviews.`,
          },
          event.requestAttributes
        )
      : confirm(
          event.sessionState,
          outputSessionAttributes,
          {
            contentType: "PlainText",
            content: `Shall I continue getting some reviews for your restaurant?`,
          },
          event.requestAttributes
        );
  } else if (event.sessionState.intent.name === "GetMenuItemReviews") {
    var showMoreReviews = event.currentIntent.slots.ShowMoreReviews;
    var currentPage =
      (event.sessionAttributes && event.sessionAttributes.CurrentReviewPage) ||
      1;
    var menuItem =
      event.sessionState.intent.slots.MenuItem?.value?.interpretedValue;

    if (menuItem) {
      if (showMoreReviews) {
        currentPage++;
        outputSessionAttributes["CurrentReviewPage"] = currentPage;
      }
      // API call for fetching menu item reviews for restaurant based on offset

      return event.sessionState.intent.confirmationState === "Confirmed"
        ? close(
            event.sessionState,
            "Fulfilled",
            outputSessionAttributes,
            {
              contentType: "PlainText",
              content: `Delight Dine's has following reviews for ${menuItem}.`,
            },
            event.requestAttributes
          )
        : confirm(
            event.sessionState,
            outputSessionAttributes,
            {
              contentType: "PlainText",
              content: `Shall I continue getting some reviews for ${menuItem} served in your restaurant?`,
            },
            event.requestAttributes
          );
    }
  } else if (event.sessionState.intent.name === "GetRestaurantRatings") {
    // API call for fetching overall ratings for restaurant

    return event.sessionState.intent.confirmationState === "Confirmed"
      ? close(
          event.sessionState,
          "Fulfilled",
          outputSessionAttributes,
          {
            contentType: "PlainText",
            content: `Delight Dine's has following reviews for ${menuItem}.`,
          },
          event.requestAttributes
        )
      : confirm(
          event.sessionState,
          outputSessionAttributes,
          {
            contentType: "PlainText",
            content: `Shall I continue getting some reviews for ${menuItem} served in your restaurant?`,
          },
          event.requestAttributes
        );
  }

  return delegate(
    event.sessionState,
    outputSessionAttributes,
    event.requestAttributes
  );
};
