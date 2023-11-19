import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import {
  close,
  confirm,
  elicitSlot,
  delegate,
  validateConfirmation,
} from "./utils.mjs";
import { getReview } from "./services/reviews.mjs";

export const handler = async (event, context) => {
  const slotName = Object.keys(event.sessionState.intent.slots);

  console.log("slotName", slotName);
  const outputSessionAttributes = event.sessionState.sessionAttributes || {};

  console.log("outputSessionAttributes", outputSessionAttributes);

  if (event.sessionState.intent.name === "GetRestaurantReviews") {
    console.log("Slot: GetRestaurantReviews");
    var showMoreReviews =
      event.sessionState.intent.slots.ShowMoreReviews?.value?.interpretedValue;
    var currentPage =
      (event.sessionState.sessionAttributes && event.sessionState.sessionAttributes.CurrentReviewPage) ||
      1;

    if (showMoreReviews) {
      currentPage++;
      outputSessionAttributes["CurrentReviewPage"] = currentPage;
    }
    // API call for fetching reviews for restaurant based on offset
    const response = await getReview(currentPage, {
      id: "1",
    });
    
    const reviews = ["It was an amazing experience", "Dining experience was nice", "Italian, especially, pasta is nice",  "Indian pavbhaji was never I've had before", "Just wow!!"]
    for (let index = 0; index < 5; index++) {
      close(
        event.sessionState,
        "Fulfilled",
        outputSessionAttributes,
        {
          contentType: "PlainText",
          content: `${reviews[index]}`,
        },
        event.requestAttributes
      )
    }
    return event.sessionState.intent.confirmationState === "Confirmed"
      ? close(
          event.sessionState,
          "Fulfilled",
          outputSessionAttributes,
          {
            contentType: "PlainText",
            content: `Delight Dine's had following reviews.`,
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
