import { PrismaClient } from "@prisma/client";
import sendGrid from "@sendgrid/mail";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!body.email) return;
  const prisma = new PrismaClient();
  const email: string = body.email;
  // FIXME: Validate email
  try {
    await prisma.$connect();
    const existingSubscription = await prisma.subscription.findUnique({
      where: { email },
    });
    if (existingSubscription) {
      // FIXME: Handle subscription already exists
      return;
    }
    const newSubscription = await prisma.subscription.create({
      data: { email },
    });

    const sendGridKey = import.meta.env.SENDGRID_API_KEY as string;
    if (!sendGridKey) {
      // FIXME: Handle key missing -> 500
      return;
    }
    sendGrid.setApiKey(sendGridKey);
    const msg = {
      to: "contact@antonio-da.dev", // Change to your recipient
      from: "contact@antonio-da.dev", // Change to your verified sender
      subject: "Sending with SendGrid is Fun",
      text: "and easy to do anywhere, even with Node.js",
      html: "<strong>and easy to do anywhere, even with Node.js</strong>",
    };
    const [response] = await sendGrid.send(msg);
    if (response.statusCode >= 200 && response.statusCode <= 299) {
      return { status: "Ok" };
    } else {
      throw response;
    }
  } catch (error: any) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
});
