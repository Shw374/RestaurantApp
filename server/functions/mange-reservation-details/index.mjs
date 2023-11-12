import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import {
  close,
  confirm,
  delegate,
  validateConfirmation,
} from "./utils.mjs";

export const handler = async (event, context) => {
  const slotName = Object.keys(event.sessionState.intent.slots);

  const outputSessionAttributes = event.sessionState.sessionAttributes || {};
  if (event.sessionState.intent.name === "CheckAvailableReservations") {
    var bookingDate =
      event.sessionState.intent.slots.BookingDate?.value?.interpretedValue;

    if (bookingDate) {
      console.log(
        "attribute exists",
        outputSessionAttributes["NewStreetName"],
        outputSessionAttributes["NewPostalCode"]
      );

      // API call for fetching booking info menu for restaurant
      // show only available slots here

      return event.sessionState.intent.confirmationState === "Confirmed"
        ? close(
            event.sessionState,
            "Fulfilled",
            outputSessionAttributes,
            {
              contentType: "PlainText",
              content: `Delight Dine's has following reservations slots available for ${bookingDate}`,
            },
            event.requestAttributes
          )
        : confirm(
            event.sessionState,
            outputSessionAttributes,
            {
              contentType: "PlainText",
              content: `Shall I continue checking slot availability of ${bookingDate} for your restaurant?`,
            },
            event.requestAttributes
          );
    }
  } else if (event.sessionState.intent.name === "EditReservation") {
  } else if (event.sessionState.intent.name === "CancelReservation") {
  }

  return delegate(
    event.sessionState,
    outputSessionAttributes,
    event.requestAttributes
  );
};
