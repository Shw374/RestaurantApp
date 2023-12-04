import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import {
  close,
  confirm,
  elicitSlot,
  delegate,
  validateConfirmation,
} from "./utils.mjs";
import { getReview, getOverallRating } from "./services/reviews.mjs";
import { getRestaurantDetails, editReservation, cancelReservation } from "./services/restaurants.mjs";

export const handler = async (event, context) => {
  const slotName = Object.keys(event.sessionState.intent.slots);
  let hasError = false;
  let errorMessage;

  function handleAPIError(message) {
    hasError = true;
    errorMessage = message || "Oops! Something went wrong.";
  }
  console.log("slotName", slotName);
  const outputSessionAttributes = event.sessionState.sessionAttributes || {};

  switch (event.sessionState.intent.name) {
    case "GetBookingInfo":
      var bookingDate =
        event.sessionState.intent.slots.BookingDate?.value?.interpretedValue;

      if (bookingDate !== null) {
        console.log("attribute exists");

        if (event.sessionState.intent.confirmationState === "Confirmed") {
          try {
            // API call for fetching restaurants
            const reservationDetails = await getRestaurantDetails({
              // restaurant_name: restaurantName,
              //add filter by menutype
              address_line: area,
            });

            if (!reservationDetails || reservationDetails.length == 0) {
              handleAPIError(
                restaurantDetails?.message ||
                  `No reservations found for ${bookingDate}`
              );
              break;
            } else {
              return close(
                event.sessionState,
                "Fulfilled",
                outputSessionAttributes,
                {
                  contentType: "PlainText",
                  content: `Here are reservation details for ${bookingDate} \n ${responseString}`,
                },
                event.requestAttributes
              );
            }
          } catch (error) {
            handleAPIError(error);
          }
        } else {
          return confirm(
            event.sessionState,
            outputSessionAttributes,
            {
              contentType: "PlainText",
              content: `Shall I continue finding reservation details for ${bookingDate}?`,
            },
            event.requestAttributes
          );
        }
      }
      break;
    case "GetOpeningTimes":
      console.log("inside GetOpeningTimes");

      // API call for fetching operating hours for restaurant
      try {
        const restaurantDetails = await getRestaurantDetails({});

        if (!restaurantDetails || restaurantDetails.length == 0) {
          handleAPIError(restaurantDetails?.message);
          break;
        } else {
          return close(
            event.sessionState,
            "Fulfilled",
            outputSessionAttributes,
            {
              contentType: "PlainText",
              content: `${restaurantName} will be open ${startTime} to ${endTime}.`,
            },
            event.requestAttributes
          );
        }
      } catch (error) {
        handleAPIError(error);
      }
      break;

    case "EditOpeningTimes":
      console.log("inside EditOpeningTimes");
      var newOpeningTime =
          event.sessionState.intent.slots.NewOpeningTime?.value
            ?.interpretedValue,
        newClosingTime =
          event.sessionState.intent.slots.NewClosingTime?.value
            ?.interpretedValue;
      if (newOpeningTime && newClosingTime) {
        console.log(
          "attribute exists",
          outputSessionAttributes["NewOpeningTime"],
          outputSessionAttributes["NewClosingTime"]
        );

        if (event.sessionState.intent.confirmationState === "Confirmed") {
          try {
            // API call for fetching restaurants
            const restaurantDetails = await getRestaurantDetails({});

            if (!restaurantDetails || restaurantDetails.length == 0) {
              handleAPIError(restaurantDetails?.message);
              break;
            } else {
              return close(
                event.sessionState,
                "Fulfilled",
                outputSessionAttributes,
                {
                  contentType: "PlainText",
                  content: `${restaurantName} will be now open ${startTime} to ${endTime}.`,
                },
                event.requestAttributes
              );
            }
          } catch (error) {
            handleAPIError(error);
          }
        } else {
          return confirm(
            event.sessionState,
            outputSessionAttributes,
            {
              contentType: "PlainText",
              content: `Shall I continue updating times to ${newOpeningTime} - ${newClosingTime}?`,
            },
            event.requestAttributes
          );
        }
      }
      break;
    case "GetLocationInfo":
      console.log("inside GetLocationInfo");
      try {
        // API call for fetching restaurants
        const restaurantDetails = await getRestaurantDetails({});

        if (!restaurantDetails || restaurantDetails.length == 0) {
          handleAPIError(restaurantDetails?.message);
          break;
        } else {
          return close(
            event.sessionState,
            "Fulfilled",
            outputSessionAttributes,
            {
              contentType: "PlainText",
              content: `${restaurantName} is located at ${reservationDetails?.address_line}.`,
            },
            event.requestAttributes
          );
        }
      } catch (error) {
        handleAPIError(error);
      }
      break;
    case "EditLocationInfo":
      console.log("inside EditLocationInfo");
      var newStreetName =
          event.sessionState.intent.slots.NewStreetName?.value
            ?.interpretedValue,
        newPostalCode =
          event.sessionState.intent.slots.NewPostalCode?.value
            ?.interpretedValue;
      if (newStreetName && newPostalCode) {
        console.log(
          "attribute exists",
          outputSessionAttributes["NewStreetName"],
          outputSessionAttributes["NewPostalCode"]
        );

        if (event.sessionState.intent.confirmationState === "Confirmed") {
          try {
            // API call for fetching restaurants
            const restaurantDetails = await getRestaurantDetails({});

            if (!restaurantDetails || restaurantDetails.length == 0) {
              handleAPIError(restaurantDetails?.message);
              break;
            } else {
              return close(
                event.sessionState,
                "Fulfilled",
                outputSessionAttributes,
                {
                  contentType: "PlainText",
                  content: `${restaurantName}'s address now is updated to ${newStreetName}, ${newPostalCode}`,
                },
                event.requestAttributes
              );
            }
          } catch (error) {
            handleAPIError(error);
          }
        } else {
          return confirm(
            event.sessionState,
            outputSessionAttributes,
            {
              contentType: "PlainText",
              content: `Shall I continue updating location for your restaurant?`,
            },
            event.requestAttributes
          );
        }
      }
      break;
    case "CheckAvailableMenu":
      console.log("inside CheckAvailableMenu");
      var menuType =
          event.sessionState.intent.slots.MenuType?.value?.interpretedValue,
        menuName =
          event.sessionState.intent.slots.MenuName?.value?.interpretedValue;
      if (menuType && menuName) {
        console.log(
          "attribute exists",
          outputSessionAttributes["NewStreetName"],
          outputSessionAttributes["NewPostalCode"]
        );

        if (event.sessionState.intent.confirmationState === "Confirmed") {
          try {
            // API call for fetching restaurants
            const restaurantDetails = await getRestaurantDetails({});

            if (!restaurantDetails || restaurantDetails.length == 0) {
              handleAPIError(restaurantDetails?.message);
              break;
            } else {
              return close(
                event.sessionState,
                "Fulfilled",
                outputSessionAttributes,
                {
                  contentType: "PlainText",
                  content: `${restaurantName} has ${restaurantDetails?.quantity} quantity available for ${menuName}`,
                },
                event.requestAttributes
              );
            }
          } catch (error) {
            handleAPIError(error);
          }
        } else {
          return confirm(
            event.sessionState,
            outputSessionAttributes,
            {
              contentType: "PlainText",
              content: `Shall I continue checking availability of ${menuName} in ${menuType} cuisine for your restaurant?`,
            },
            event.requestAttributes
          );
        }
      }
      break;
    case "CheckAvailableReservations":
      var bookingDate =
        event.sessionState.intent.slots.BookingDate?.value?.interpretedValue;

      if (bookingDate) {
        console.log(
          "attribute exists",
          outputSessionAttributes["NewStreetName"],
          outputSessionAttributes["NewPostalCode"]
        );

        if (event.sessionState.intent.confirmationState === "Confirmed") {
          try {
            // API call for fetching restaurants
            const reservationDetails = await getRestaurantDetails({
            });

            if (!reservationDetails || reservationDetails.length == 0) {
              handleAPIError(
                restaurantDetails?.message ||
                  `No reservations found for ${bookingDate}`
              );
              break;
            } else {
              return close(
                event.sessionState,
                "Fulfilled",
                outputSessionAttributes,
                {
                  contentType: "PlainText",
                  content: `${restaurantName} has following reservations slots available for ${bookingDate}`,
                },
                event.requestAttributes
              );
            }
          } catch (error) {
            handleAPIError(error);
          }
        } else {
          return confirm(
            event.sessionState,
            outputSessionAttributes,
            {
              contentType: "PlainText",
              content: `Shall I continue checking reservation availability of ${bookingDate} for your restaurant?`,
            },
            event.requestAttributes
          );
        }
      }
      break;

    case "GetRestaurantReviews":
      console.log("Slot: GetRestaurantReviews");
      var showMoreReviews =
        event.sessionState.intent.slots.ShowMoreReviews?.value
          ?.interpretedValue;
      var currentPage =
        (event.sessionState.sessionAttributes &&
          event.sessionState.sessionAttributes.CurrentReviewPage) ||
        1;

      if (showMoreReviews) {
        currentPage++;
        outputSessionAttributes["CurrentReviewPage"] = currentPage;
      }
      // API call for fetching reviews for restaurant based on offset
      const response = await getReview(currentPage, {
        id: "1",
      });

      const { reviews, totalReviews } = response;

      if (reviews.length > 0) {
        // Display reviews to the user

        const moreReviews = totalReviews > currentPage * 10;

        if (moreReviews) {
          // Elicit the showMoreReviews slot
          return elicitSlot(
            event.sessionState,
            "GetRestaurantReviews",
            "",
            "ShowMoreReviews",
            outputSessionAttributes,
            {
              contentType: "PlainText",
              content: "Do you want to see more reviews?",
            },
            event.requestAttributes
          );
        } else {
          // No more reviews, provide closing message
          return event.sessionState.intent.confirmationState === "Confirmed"
            ? close(
                event.sessionState,
                "Fulfilled",
                outputSessionAttributes,
                {
                  contentType: "PlainText",
                  content: `${restaurantName} had ${totalReviews} reviews.`,
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
        }
      } else {
        close(
          event.sessionState,
          "Fulfilled",
          outputSessionAttributes,
          {
            contentType: "PlainText",
            content: `${restaurantName} had no reviews yet.`,
          },
          event.requestAttributes
        );
      }
      break;
    case "GetMenuItemReviews":
      var showMoreReviews = event.currentIntent.slots.ShowMoreReviews;
      var currentPage =
        (event.sessionAttributes &&
          event.sessionAttributes.CurrentReviewPage) ||
        1;
      var menuItem =
        event.sessionState.intent.slots.MenuItem?.value?.interpretedValue;

      if (menuItem) {
        if (showMoreReviews) {
          currentPage++;
          outputSessionAttributes["CurrentReviewPage"] = currentPage;
        }
        // API call for fetching menu item reviews for restaurant based on offset
        const response = await getReview(currentPage, {
          id: "1",
        });

        const { reviews, totalReviews } = response;

        if (reviews.length > 0) {
          // Display reviews to the user

          const moreReviews = totalReviews > currentPage * 10;

          if (moreReviews) {
            // Elicit the showMoreReviews slot
            return elicitSlot(
              event.sessionState,
              "GetRestaurantReviews",
              "",
              "ShowMoreReviews",
              outputSessionAttributes,
              {
                contentType: "PlainText",
                content: "Do you want to see more reviews?",
              },
              event.requestAttributes
            );
          } else {
            // No more reviews, provide closing message
            return event.sessionState.intent.confirmationState === "Confirmed"
              ? close(
                  event.sessionState,
                  "Fulfilled",
                  outputSessionAttributes,
                  {
                    contentType: "PlainText",
                    content: `${restaurantName} had ${totalReviews} reviews for ${menuItem}.`,
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
        } else {
          close(
            event.sessionState,
            "Fulfilled",
            outputSessionAttributes,
            {
              contentType: "PlainText",
              content: `${restaurantName} had no reviews yet for ${menuItem}.`,
            },
            event.requestAttributes
          );
        }
      }
      break;
    case "GetRestaurantRatings":
      try {
        // API call for fetching overall ratings for restaurant
        const ratings = await getOverallRating({});

        if (!ratings) {
          handleAPIError(`No ratings yet for ${restaurantName}`);
          break;
        } else {
          return close(
            event.sessionState,
            "Fulfilled",
            outputSessionAttributes,
            {
              contentType: "PlainText",
              content: `${restaurantName} has overall ${ratings}-star rating.`,
            },
            event.requestAttributes
          );
        }
      } catch (error) {
        handleAPIError(error);
      }
      break;
    case "EditReservation":
      break;
    case "CancelReservation":
      break;
  }

  if (hasError)
    return close(
      event.sessionState,
      "Fulfilled",
      outputSessionAttributes,
      {
        contentType: "PlainText",
        content: errorMessage,
      },
      event.requestAttributes
    );
  return delegate(
    event.sessionState,
    outputSessionAttributes,
    event.requestAttributes
  );
};
