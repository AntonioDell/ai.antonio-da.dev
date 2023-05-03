import { PrismaClient, SubscriptionState } from "@prisma/client";
import mail from "@sendgrid/mail";
import { joinURL, withQuery } from "ufo";
import { validateCaptchaResponse } from "~/server/captcha";
import { createJWT } from "~/server/jwt";
import { isValidEmail } from "../utils";

interface SubscriptionVerificationMailTemplateData {
  name?: string;
  magicLink: string;
}

const prisma = new PrismaClient();
//TODO: Refactor please
export default defineEventHandler(async (event) => {
  if (useRuntimeConfig().nodeEnv === "production") {
    const captchaValidationResult = await validateCaptchaResponse(event);
    if (!captchaValidationResult.isValid) {
      return captchaValidationResult;
    }
  }

  const body = await readBody(event);

  // Email address verification
  if (!body.email || typeof body.email !== "string") {
    setResponseStatus(event, 400);
    return { message: "No email address set." };
  }
  const email: string = body.email.toLowerCase();
  if (!isValidEmail(email)) {
    setResponseStatus(event, 400);
    return { message: "Invalid email address." };
  }

  try {
    const existingSubscription = await prisma.subscription.findUnique({
      where: { email },
    });
    if (
      existingSubscription &&
      existingSubscription.state === SubscriptionState.ACTIVE
    ) {
      setResponseStatus(event, 400);
      return { message: "Email address already in use." };
    }
    let subscription = existingSubscription;
    if (!subscription) {
      subscription = await prisma.subscription.create({
        data: { email },
      });
    }

    const { sendgridApiKey } = useRuntimeConfig();
    const sendGridKey = sendgridApiKey;
    if (!sendGridKey) {
      setResponseStatus(event, 500);
      return {
        message:
          "Subscribing is currently not possible. Please try again later.",
      };
    }
    mail.setApiKey(sendGridKey);
    const token = createJWT({ id: subscription.id, email: subscription.email });
    const magicLink = withQuery(
      joinURL(useRuntimeConfig().public.baseUrl, "/verify-subscription"),
      { token }
    );
    const dynamicTemplateData: SubscriptionVerificationMailTemplateData = {
      name: "",
      magicLink,
    };
    const [response] = await mail.send({
      from: "newsletter@antonio-da.dev",
      to: email,
      templateId: "d-4531a47c23684b5a925f940c04bb0c66",
      dynamicTemplateData,
    });
    if (response.statusCode >= 200 && response.statusCode <= 299) {
      return { status: "Ok" };
    } else {
      setResponseStatus(event, 500);
      return {
        message:
          "Subscribing is currently not possible. Please try again later.",
      };
    }
  } catch (error: any) {
    setResponseStatus(event, 500);
    return {
      message: "Subscribing is currently not possible. Please try again later.",
    };
  }
});
