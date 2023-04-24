import { Newsletter, PrismaClient, SubscriptionState } from "@prisma/client";
import sendGridMail from "@sendgrid/mail";

const prisma = new PrismaClient();
export default defineEventHandler(async (event) => {
  const id = event.context.params?.newsletterId;
  if (!id || typeof id !== "string") {
    setResponseStatus(event, 400);
    return { message: "Parameter id missing" };
  }

  let newsletter;
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

    newsletter = await prisma.newsletter.update({
      where: { id },
      data: { receivers: { connect: receiverIds } },
      include: { receivers: true },
    });
  } catch (error: any) {
    setResponseStatus(event, 500);
    return { message: "Database error" };
  }
  const { sendgridApiKey } = useRuntimeConfig();
  try {
    /* TODO: Use newsletter.receivers to create personalizations
    sendGridMail.setApiKey(sendgridApiKey);
    await sendGridMail.sendMultiple({
      from: "newsletter@antonio-da.dev",
      templateId: newsletter.templateId,
    });
    */
  } catch (error: any) {}
});
