import { PrismaClient, SubscriptionState } from "@prisma/client";
import sendGrid from "@sendgrid/mail";
import { joinURL, withQuery } from "ufo";
import { validateCaptchaResponse } from "~/server/captcha";
import { createJWT } from "~/server/jwt";

interface SubscriptionVerificationMailTemplateData {
  name?: string;
  magicLink: string;
}

function isValidEmail(email: string) {
  const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
  return emailRegex.test(email);
}

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

  const prisma = new PrismaClient();
  try {
    await prisma.$connect();
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
    sendGrid.setApiKey(sendGridKey);
    const token = createJWT({ id: subscription.id, email: subscription.email });
    const magicLink = withQuery(
      joinURL(useRuntimeConfig().public.apiUrl, "/verify"),
      { token }
    );
    const dynamicTemplateData: SubscriptionVerificationMailTemplateData = {
      name: "",
      magicLink,
    };
    // TODO: Use environment variables
    const [response] = await sendGrid.send({
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
  } finally {
    await prisma.$disconnect();
  }
});
