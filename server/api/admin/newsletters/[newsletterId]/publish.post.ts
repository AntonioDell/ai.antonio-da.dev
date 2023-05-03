import { PrismaClient, SubscriptionState } from "@prisma/client";
import mail, { type MailDataRequired } from "@sendgrid/mail";
import { type H3Event } from "h3";
import { createPersonalization } from "~/server/sendGridTemplates";

const prisma = new PrismaClient();

const getNewslettersWithActiveReceivers = async (
  event: H3Event,
  id: string
) => {
  try {
    const foundNewsletter = await prisma.newsletter.findUnique({
      where: { id },
    });
    if (!foundNewsletter) {
      setResponseStatus(event, 400);
      return { message: "No newsletter with matching id found" };
    }
    const receiverIds = await prisma.subscription.findMany({
      select: { id: true },
      where: { state: SubscriptionState.ACTIVE },
    });

    const newsletter = await prisma.newsletter.update({
      where: { id },
      data: { receivers: { connect: receiverIds } },
      include: { receivers: true },
    });

    if (newsletter.receivers.length === 0) {
      setResponseStatus(event, 400);
      return { message: "No receivers found" };
    }

    newsletter.receivers = newsletter.receivers.filter(
      (reciever) => reciever.state === SubscriptionState.ACTIVE
    );
    if (newsletter.receivers.length === 0) {
      setResponseStatus(event, 400);
      return { message: "No active receivers found" };
    }

    return newsletter;
  } catch (error: any) {
    setResponseStatus(event, 500);
    return { message: "Database error" };
  }
};

export default defineEventHandler(async (event) => {
  const id = event.context.params?.newsletterId;
  if (!id || typeof id !== "string") {
    setResponseStatus(event, 400);
    return { message: "Parameter id missing" };
  }

  const newsletter = await getNewslettersWithActiveReceivers(event, id);
  if ("message" in newsletter) {
    return newsletter;
  }
  const personalizations = newsletter.receivers.map((receiver) => {
    return createPersonalization(receiver.id, receiver.email);
  });
  const mailData: MailDataRequired = {
    from: "newsletter@antonio-da.dev",
    templateId: newsletter.templateId,
    personalizations,
  };

  const { sendgridApiKey } = useRuntimeConfig();
  mail.setApiKey(sendgridApiKey);
  const [result] = await mail.sendMultiple(mailData);
  if (result.statusCode >= 200 && result.statusCode <= 299) {
    return { status: "Ok" };
  } else {
    setResponseStatus(event, 500);
    return { message: "Publishing the newsletter failed." };
  }
});
