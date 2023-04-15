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
  if (!body.email || typeof body.email !== "string") return;
  const prisma = new PrismaClient();
  const email: string = body.email.toLowerCase();
  if (!isValidEmail(email)) {
    setResponseStatus(event, 400);
    return;
  }
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
      return { message: "Email already registered" };
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
      throw {
        message:
          "Subscribing currently is not possible. Please try again later.",
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
      throw response;
    }
  } catch (error: any) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
});
