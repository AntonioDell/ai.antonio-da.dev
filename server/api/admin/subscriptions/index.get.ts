import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export default defineEventHandler(async (event) => {
  try {
    const subscriptions = await prisma.subscription.findMany({
      orderBy: { email: "asc" },
    });
    return { count: subscriptions.length, results: subscriptions };
  } catch {
  } 
});
