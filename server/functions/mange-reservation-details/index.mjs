import axios from "axios";
import { v4 as uuidv4 } from "uuid";
export const handler = async (event, context) => {
  const slotName = Object.keys(event.sessionState.intent.slots);

  const outputSessionAttributes = event.sessionState.sessionAttributes || {};

  return delegate(
    event.sessionState,
    outputSessionAttributes,
    event.requestAttributes
  );
};
