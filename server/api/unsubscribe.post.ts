import { PrismaClient, SubscriptionState } from "@prisma/client";
import { verifyJWT } from "~/server/jwt";

const prisma = new PrismaClient();
export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const result = verifyJWT(query.token as string);
  if (!result.isValid) {
    setResponseStatus(event, 401);
    return { message: "Invalid token" };
  }

  const { id } = result;
  try {
    await prisma.subscription.update({
      where: { id },
      data: { state: SubscriptionState.CANCELLED },
    });
    return { status: "Ok" };
  } catch (error: any) {
    setResponseStatus(event, 500);
    return { message: "Database error" };
  }
});
