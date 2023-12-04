import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { addReview, addRating } from "./services/reviews.mjs";
import {
  getRestaurantDetails,
  createReservation,
} from "./services/restaurants.mjs";
import {
  hasMenuType,
  hasMenuItem,
  filterAvailableMenuItems,
  formatDateTime,
  formatDateTimeWithOneHourAdded,
} from "./utils/helper.mjs";

/**
 * send response to lex
 * @param {*} sessionState
 * @param {*} fulfillmentState
 * @param {*} message
 * @param {*} requestAttributes
 * @returns
 */
function close(
  sessionState,
  fulfillmentState,
  savedAttributes,
  message,
  requestAttributes
) {
  sessionState.intent.state = fulfillmentState;
  sessionState.dialogAction = {
    slotElicitationStyle: "Default",
    slotToElicit: "string",
    type: "Close",
  };
  sessionState.sessionAttributes = savedAttributes;

  return {
    sessionState: sessionState,
    messages: [message],
    requestAttributes: requestAttributes,
  };
}

function delegate(sessionState, savedAttributes, requestAttributes) {
  sessionState.dialogAction = {
    type: "Delegate",
  };

  sessionState.sessionAttributes = savedAttributes;
  return {
    sessionState: sessionState,
    requestAttributes: requestAttributes,
  };
}

function confirm(sessionState, savedAttributes, message, requestAttributes) {
  sessionState.intent.state = "InProgress";
  sessionState.dialogAction = {
    type: "ConfirmIntent",
  };
  sessionState.sessionAttributes = savedAttributes;
  return {
    sessionState: sessionState,
    messages: [message],
    requestAttributes: requestAttributes,
  };
}

function elicitSlot(
  sessionAttributes,
  intentName,
  slots,
  slotToElicit,
  message
) {
  return {
    sessionAttributes,
    dialogAction: {
      type: "ElicitSlot",
      intentName,
      slots,
      slotToElicit,
      message,
    },
  };
}

function validateConfirmation(
  sessionState,
  closingMessage,
  confirmationMessage,
  outputSessionAttributes,
  requestAttributes
) {
  return sessionState.intent.confirmationState === "Confirmed"
    ? close(
        sessionState,
        "Fulfilled",
        outputSessionAttributes,
        closingMessage,
        requestAttributes
      )
    : sessionState.intent.confirmationState === "Denied"
    ? delegate(sessionState, {}, requestAttributes)
    : confirm(
        sessionState,
        outputSessionAttributes,
        confirmationMessage,
        requestAttributes
      );
}

export const handler = async (event, context) => {
  const slotName = Object.keys(event.sessionState.intent.slots);

  var area,
    menuType,
    menuItem,
    restaurantName,
    review,
    prefDate,
    prefTime,
    totalPeople;
  const outputSessionAttributes = event.sessionState.sessionAttributes || {};
  let hasError = false;
  let errorMessage;

  function handleAPIError(message) {
    hasError = true;
    errorMessage = message || "Oops! Something went wrong.";
  }

  area = event.sessionState.intent.slots.Area?.value?.interpretedValue;
  menuType = event.sessionState.intent.slots.MenuType?.value?.interpretedValue;
  menuItem = event.sessionState.intent.slots.MenuItem?.value?.interpretedValue;
  restaurantName =
    event.sessionState.intent.slots.RestaurantName?.value?.originalValue;
  review = event.sessionState.intent.slots.Review?.value?.interpretedValue;
  prefDate = event.sessionState.intent.slots.PrefDate?.value?.interpretedValue;
  prefTime = event.sessionState.intent.slots.PrefTime?.value?.interpretedValue;
  totalPeople =
    event.sessionState.intent.slots.TotalPeople?.value?.interpretedValue;
  if (area !== null) {
    outputSessionAttributes["Area"] = area;
  }

  if (menuType !== null) {
    outputSessionAttributes["MenuType"] = menuType;
  }

  if (menuItem !== null) {
    outputSessionAttributes["MenuItem"] = menuItem;
  }

  if (restaurantName !== null) {
    outputSessionAttributes["RestaurantName"] = restaurantName;
  }

  switch (event.sessionState.intent.name) {
    case "GetAvailableRestaurants":
      if (area && menuType && menuItem) {
        outputSessionAttributes["RestaurantName"] = "Delight Dine";
        if (event.sessionState.intent.confirmationState === "Confirmed") {
          try {
            // API call for fetching restaurants
            const restaurantDetails = await getRestaurantDetails({
              // restaurant_name: restaurantName,
              //add filter by menutype
              address_line: area,
            });

            if (!restaurantDetails || restaurantDetails?.error) {
              handleAPIError(
                restaurantDetails?.message ||
                  `No restaurants within ${area} that offers dish ${menuItem} from ${menuType} cuisine found!`
              );
              break;
            } else {
              const restaurants = restaurantDetails.filter((restaurant) => {
                // Check if the restaurant has the specified menuType
                if (restaurant.menu.hasOwnProperty(menuType.toLowerCase())) {
                  // Check if the menuType has the specified menuItem
                  const menuItems = restaurant.menu[menuType.toLowerCase()].map(
                    (item) => item.menu_name
                  );
                  return menuItems.includes(menuItem);
                }
                return false;
              });

              const responseString = restaurants
                .map(
                  (restaurant) =>
                    `Restaurant Name: ${restaurant.restaurant_name}\n\tAddress: ${restaurant.address_line}\n`
                )
                .join("\n");

              return close(
                event.sessionState,
                "Fulfilled",
                outputSessionAttributes,
                {
                  contentType: "PlainText",
                  content: `Here are few options for your requested cuisine:\n ${responseString}`,
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
              content: `Shall I continue finding ${menuType} restaurant in ${area}?`,
            },
            event.requestAttributes
          );
        }
      }
      break;
    case "GetOpeningTimings":
      if (area && restaurantName) {
        if (event.sessionState.intent.confirmationState === "Confirmed") {
          try {
            // API call for fetching operating hours for restaurant
            const restaurantDetails = await getRestaurantDetails({
              restaurant_name: restaurantName,
            });

            if (!restaurantDetails || restaurantDetails?.error) {
              handleAPIError(
                restaurantDetails?.message ||
                  `No restaurant with name "${restaurantName}" found!`
              );
              break;
            } else {
              return close(
                event.sessionState,
                "Fulfilled",
                outputSessionAttributes,
                {
                  contentType: "PlainText",
                  content: `${restaurantName} will be open from ${restaurantDetails[0].open_hours} to ${restaurantDetails[0].close_hours}.`,
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
              content: `Shall I continue finding operating hours for ${restaurantName} located in ${area}?`,
            },
            event.requestAttributes
          );
        }
      }
      break;

    case "GetLocationInformation":
      if (restaurantName) {
        if (event.sessionState.intent.confirmationState === "Confirmed") {
          try {
            // API call for fetching operating hours for restaurant
            const restaurantDetails = await getRestaurantDetails({
              restaurant_name: restaurantName,
            });

            if (!restaurantDetails || restaurantDetails?.error) {
              handleAPIError(
                restaurantDetails?.message ||
                  `No restaurant with name "${restaurantName}" found!`
              );
              break;
            } else {
              return close(
                event.sessionState,
                "Fulfilled",
                outputSessionAttributes,
                {
                  contentType: "PlainText",
                  content: `${restaurantName} is located in ${restaurantDetails[0].address_line}.`,
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
              content: `Shall I continue finding location for ${restaurantName}?`,
            },
            event.requestAttributes
          );
        }
      }
      break;
    case "MenuAvailability":
      if (restaurantName && area && menuType) {
        if (event.sessionState.intent.confirmationState === "Confirmed") {
          try {
            // API call for fetching restaurant details
            const restaurantDetails = await getRestaurantDetails({
              restaurant_name: restaurantName,
              address_line: area,
            });

            if (!restaurantDetails || restaurantDetails?.error) {
              handleAPIError(
                restaurantDetails?.message ||
                  `No restaurant with name "${restaurantName}" found!`
              );
              break;
            } else {
              // filter available menu here
              const availableMenuItems = filterAvailableMenuItems(
                restaurantDetails[0].menu,
                menuType
              );

              if (availableMenuItems.length > 0) {
                const responseString = availableMenuItems
                  .map((item) => `${item?.menu_name}`)
                  .join(", ");

                return close(
                  event.sessionState,
                  "Fulfilled",
                  outputSessionAttributes,
                  {
                    contentType: "PlainText",
                    content: `${restaurantName} is offering ${menuType} cuisine. Here are available items: ${responseString}`,
                  },
                  event.requestAttributes
                );
              } else {
                return close(
                  event.sessionState,
                  "Fulfilled",
                  outputSessionAttributes,
                  {
                    contentType: "PlainText",
                    content: `Unfortunately, there are no available items of ${menuType} cuisine at ${restaurantName}.`,
                  },
                  event.requestAttributes
                );
              }
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
              content: `Shall I continue finding menu for ${menuType} cuisine at ${restaurantName}?`,
            },
            event.requestAttributes
          );
        }
      }
      break;
    case "ReviewRestaurant":
      if (
        restaurantName &&
        // outputSessionAttributes["Area"] &&
        review
      ) {
        if (event.sessionState.intent.confirmationState === "Confirmed") {
          try {
            const restaurantDetails = await getRestaurantDetails({
              restaurant_name: restaurantName,
            });

            if (!restaurantDetails || restaurantDetails?.error) {
              handleAPIError(
                restaurantDetails?.message ||
                  `No restaurant with name "${restaurantName}" found!`
              );
              break;
            } else {
              const id = restaurantDetails[0].restaurant_id;

              try {
                const responseData = await addReview({
                  review_id: uuidv4(),
                  type: "RESTAURANT",
                  id: id,
                  customer_id: "john@gmail.com",
                  review: review,
                  restaurant_name: restaurantName,
                });

                return close(
                  event.sessionState,
                  "Fulfilled",
                  outputSessionAttributes,
                  {
                    contentType: "PlainText",
                    content: "Thank you for your valuable review",
                  },
                  event.requestAttributes
                );
              } catch (error) {
                handleAPIError(error);
              }
              // if (hasError) break;
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
              content: `Shall I continue posting review for ${restaurantName}?`,
            },
            event.requestAttributes
          );
        }
      }
      break;
    case "ReviewMenuItem":
      if (restaurantName && menuType && menuItem && review) {
        // API call for fetching menu for restaurant

        if (event.sessionState.intent.confirmationState === "Confirmed") {
          try {
            const restaurantDetails = await getRestaurantDetails({
              restaurant_name: restaurantName,
            });

            if (!restaurantDetails || restaurantDetails?.error) {
              handleAPIError(
                restaurantDetails?.message ||
                  `No restaurant with name "${restaurantName}" found!`
              );
              break;
            }
            if (
              !hasMenuType(menuType) &&
              !hasMenuItem(restaurantName, menuType, menuItem)
            ) {
              handleAPIError(
                `Restaurant ${restaurantName} do not have ${menuType} cuisine!`
              );
              break;
            } else {
              const id = restaurantDetails[0].restaurant_id;

              try {
                const responseData = await addReview({
                  review_id: uuidv4(),
                  type: "ITEM",
                  id: id,
                  customer_id: "john@gmail.com",
                  review: review,
                  restaurant_name: restaurantName,
                });

                return close(
                  event.sessionState,
                  "Fulfilled",
                  outputSessionAttributes,
                  {
                    contentType: "PlainText",
                    content: "Thank you for your valuable review",
                  },
                  event.requestAttributes
                );
              } catch (error) {
                handleAPIError(error);
              }
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
              content: `Shall I continue posting review for ${outputSessionAttributes["MenuItem"]} offered by ${outputSessionAttributes["RestaurantName"]}?`,
            },
            event.requestAttributes
          );
        }
      }
      break;
    case "RateRestaurant":
      const rating =
        event.sessionState.intent.slots.Ratings?.value?.interpretedValue;

      if (restaurantName && area && rating) {
        // API call for fetching restaurant details for restaurant_id
        if (event.sessionState.intent.confirmationState === "Confirmed") {
          try {
            const restaurantDetails = await getRestaurantDetails({
              restaurant_name: restaurantName,
            });

            if (!restaurantDetails || restaurantDetails?.error) {
              handleAPIError(
                restaurantDetails?.message ||
                  `No restaurant with name "${restaurantName}" found!`
              );
              break;
            }
            if (
              !hasMenuType(menuType) &&
              !hasMenuItem(restaurantName, menuType, menuItem)
            ) {
              handleAPIError(
                `Restaurant ${restaurantName} do not have ${menuType} cuisine!`
              );
              break;
            } else {
              const id = restaurantDetails[0].restaurant_id;

              try {
                const responseData = await addRating({
                  rating_id: uuidv4(),
                  customer_id: "john@gmail.com",
                  rating: rating,
                  restaurant_id: id,
                });

                return close(
                  event.sessionState,
                  "Fulfilled",
                  outputSessionAttributes,
                  {
                    contentType: "PlainText",
                    content: `Thank your for rating ${restaurantName}`,
                  },
                  event.requestAttributes
                );
              } catch (error) {
                handleAPIError(error);
              }
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
              content: `Shall I continue posting rating ${rating} for ${restaurantName}?`,
            },
            event.requestAttributes
          );
        }
      }

      break;
    case "BookReservation":
      if (
        restaurantName &&
        // area &&
        prefDate &&
        prefTime &&
        totalPeople
        // &&
        // menuType
      ) {
        if (event.sessionState.intent.confirmationState === "Confirmed") {
          try {
            const restaurantDetails = await getRestaurantDetails({
              restaurant_name: restaurantName,
            });

            if (!restaurantDetails || restaurantDetails?.error) {
              handleAPIError(
                restaurantDetails?.message ||
                  `No restaurant with name "${restaurantName}" found!`
              );
              break;
            } else {
              const id = restaurantDetails[0].restaurant_id;
              const formattedStartTime = formatDateTime(prefDate, prefTime);
              const formattedEndTime = formatDateTimeWithOneHourAdded(
                prefDate,
                prefTime
              );

              try {
                const responseData = await createReservation({
                  customer_id: "john@gmail.com",
                  restaurantId: id,
                  start_time: formattedStartTime,
                  end_time: formattedEndTime,
                  reservationDate: prefDate,
                  status: "PENDING",
                  total_no_people: totalPeople,
                  order: [],
                  table_number: 1,
                });

                return close(
                  event.sessionState,
                  "Fulfilled",
                  outputSessionAttributes,
                  {
                    contentType: "PlainText",
                    content: `Sounds like a plan! I have booked your reservation at ${restaurantName} on ${prefDate} for ${prefTime}. Hope you enjoy!`,
                  },
                  event.requestAttributes
                );
              } catch (error) {
                handleAPIError(error);
              }
              // if (hasError) break;
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
              content: `Shall I continue booking your reservation at ${outputSessionAttributes["RestaurantName"]} for ${outputSessionAttributes["TotalPeople"]}  on ${outputSessionAttributes["PrefData"]} and time ${outputSessionAttributes["PrefTime"]}?`,
            },
            event.requestAttributes
          );
        }
      }
      break;
    case "CheckAvailableReservation":
      if (restaurantName && area && prefDate && prefTime && totalPeople) {
        // API call for reservation details
        if (event.sessionState.intent.confirmationState === "Confirmed") {
          try {
            const response = await axios.post("api-here", {});
          } catch (err) {
            return close(
              event.sessionState,
              "Fulfilled",
              outputSessionAttributes,
              {
                contentType: "PlainText",
                content: "Oops! Something went wrong.",
              },
              event.requestAttributes
            );
          }
        }

        return event.sessionState.intent.confirmationState === "Confirmed"
          ? close(
              event.sessionState,
              "Fulfilled",
              outputSessionAttributes,
              {
                contentType: "PlainText",
                content: `Hope this was helpful! Let me know if you want to do anything else.`,
              },
              event.requestAttributes
            )
          : confirm(
              event.sessionState,
              outputSessionAttributes,
              {
                contentType: "PlainText",
                content: `Shall I continue looking your reservation at ${outputSessionAttributes["RestaurantName"]} for ${outputSessionAttributes["TotalPeople"]}  on ${outputSessionAttributes["PrefData"]} and time ${outputSessionAttributes["PrefTime"]}?`,
              },
              event.requestAttributes
            );
      }
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
