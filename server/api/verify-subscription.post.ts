import { PrismaClient, SubscriptionState } from "@prisma/client";
import { verifyJWT } from "~/server/jwt";


export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const result = verifyJWT(query.token as string);
  if (!result.isValid) {
    setResponseStatus(event, 401);
    return;
  }

  const prisma = new PrismaClient();
  try {
    await prisma.$connect();
    const { email, id } = result;
    await prisma.subscription.update({
      where: { id },
      data: { state: SubscriptionState.ACTIVE },
    });
    return { email };
  } catch (error) {
    setResponseStatus(event, 500);
  } finally {
    await prisma.$disconnect();
  }
});
