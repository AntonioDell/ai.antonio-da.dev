import { PrismaClient, Subscription } from "@prisma/client";
import { isValidEmail } from "@/server/utils";
import { createJWT } from "@/server/jwt";
import mail from "@sendgrid/mail";
import { joinURL, withQuery } from "ufo";
import { validateCaptchaResponse } from "../captcha";

const prisma = new PrismaClient();
export default defineEventHandler(async (event) => {
  if (useRuntimeConfig().nodeEnv === "production") {
    const captchaValidationResult = await validateCaptchaResponse(event);
    if (!captchaValidationResult.isValid) {
      return captchaValidationResult;
    }
  }

  const body = await readBody(event);
  const email = body.email as string;
  if (!body.email || !isValidEmail(email)) {
    setResponseStatus(event, 400);
    return { message: "No valid email given" };
  }

  let subscription: Subscription | null;
  try {
    subscription = await prisma.subscription.findUnique({
      where: { email: email.toLowerCase() },
    });
  } catch (error: any) {
    setResponseStatus(event, 500);
    return { message: "Database error" };
  }
  if (!subscription) {
    // No subscription for the email found -> Don't tell user
    return { status: "ok" };
  }

  const token = createJWT({ id: subscription.id, email: subscription.email });
  const {
    sendgridApiKey,
    public: { baseUrl },
  } = useRuntimeConfig();
  try {
    mail.setApiKey(sendgridApiKey);

    const magicLink = withQuery(joinURL(baseUrl, "/verify-unsubscribe"), {
      token,
    });
    const [response] = await mail.send({
      from: "newsletter@antonio-da.dev",
      to: subscription.email,
      templateId: "d-26f54610ac1d488abdca529a7858d149",
      dynamicTemplateData: {
        magicLink,
      },
    });
    if (response.statusCode >= 200 && response.statusCode <= 299) {
      return { status: "ok" };
    } else {
      setResponseStatus(event, 500);
      return {
        message:
          "Sending unsubscribe email is currently not possible. Please try again later or contact me directly for assistance.",
      };
    }
  } catch (error) {
    setResponseStatus(event, 500);
    return {
      message:
        "Sending unsubscribe email is currently not possible. Please try again later or contact me directly for assistance.",
    };
  }
});
