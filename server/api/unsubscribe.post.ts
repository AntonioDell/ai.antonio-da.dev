import { PrismaClient, SubscriptionState } from "@prisma/client";
import { verifyJWT } from "~/server/jwt";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const result = verifyJWT(query.token as string);
  if (!result.isValid) {
    setResponseStatus(event, 401);
    return;
  }

  const { id } = result;
  const prisma = new PrismaClient();
  try {
    await prisma.$connect();
    await prisma.subscription.update({
      where: { id },
      data: { state: SubscriptionState.CANCELLED },
    });
    return { status: "Ok" };
  } catch (error: any) {
  } finally {
    await prisma.$disconnect();
  }
});
