import { PrismaClient, Subscription, SubscriptionState } from "@prisma/client";
import sendGrid from "@sendgrid/mail";
import jwt from "jsonwebtoken";
import { joinURL, withQuery } from "ufo";

interface SubscriptionVerificationMailTemplateData {
  name?: string;
  magicLink: string;
}

function createJWT(payload: object, secret: string) {
  const expiresIn = 2 * 60 * 60; // 2 hours in seconds
  const token = jwt.sign(payload, secret, { expiresIn });
  return token;
}

function isValidEmail(email: string) {
  const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
  return emailRegex.test(email);
}

//TODO: Refactor please
export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  // hCaptcha Verification
  if (!body.hcaptchaResponse) {
    setResponseStatus(event, 400);
    return { message: "No hCaptcha response set." };
  }
  try {
    const { hcaptchaResponse } = body;
    const { hcaptchaSecret } = useRuntimeConfig();
    const result: any = await $fetch("https://hcaptcha.com/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: Object.entries({
        secret: hcaptchaSecret,
        response: hcaptchaResponse,
      })
        .map(
          ([key, value]) =>
            encodeURIComponent(key) + "=" + encodeURIComponent(value)
        )
        .join("&"),
    });

    if (!result.success) {
      throw new Error("hCaptcha verification failed.");
    }
  } catch (error: Error | any) {
    console.error(error);
    if (error.message === "hCaptcha verification failed.") {
      setResponseStatus(event, 400);
      return { message: error.message };
    } else {
      setResponseStatus(event, 500);
    }
    return;
  }

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

    const { sendgridApiKey, jwtSecret } = useRuntimeConfig();
    const sendGridKey = sendgridApiKey;
    if (!sendGridKey) {
      setResponseStatus(event, 500);
      return {
        message:
          "Subscribing is currently not possible. Please try again later.",
      };
    }
    sendGrid.setApiKey(sendGridKey);
    const token = createJWT(
      { id: subscription.id, email: subscription.email },
      jwtSecret
    );
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
