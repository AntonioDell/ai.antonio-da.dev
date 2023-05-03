import { joinURL, withQuery } from "ufo";
import { createJWT } from "../jwt";
import { Personalization } from "./types";

const createPersonalization = (
  subscriptionId: string,
  email: string
): Personalization => {
  const token = createJWT(
    {
      id: subscriptionId,
      email,
    },
    60 * 60 * 24 * 7
  );

  const unsubscribeLink = withQuery(
    joinURL(useRuntimeConfig().public.baseUrl, "unsubscribe"),
    { token }
  );
  const personalization: Personalization = {
    to: email,
    dynamicTemplateData: {
      unsubscribeLink,
    },
  };
  return personalization;
};

export * from "./types";
export { createPersonalization };
