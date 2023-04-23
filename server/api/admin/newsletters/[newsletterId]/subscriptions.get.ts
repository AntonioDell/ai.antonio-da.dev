import { PrismaClient } from "@prisma/client";
import SuperJSON from "superjson";

const prisma = new PrismaClient();
export default defineEventHandler(async (event) => {
  if (!event.context?.params?.newsletterId) {
    setResponseStatus(event, 400);
    return { message: "Missing newsletter id parameter" };
  }
  const newsletterId = event.context.params.newsletterId;

  try {
    const newsletter = await prisma.newsletter.findUniqueOrThrow({
      where: {
        id: newsletterId,
      },
      include: {
        receivers: true,
      },
    });
    const ret = newsletter.receivers.map((subscription) => ({
      ...subscription,
      toJSON() {
        return this;
      },
    }));
    return SuperJSON.stringify(ret) as unknown as typeof ret;
  } catch (error: any) {
    sendNoContent(event, 500);
  }
});
