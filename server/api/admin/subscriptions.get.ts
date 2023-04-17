import { PrismaClient } from "@prisma/client";

export default defineEventHandler(async (event) => {
  const prisma = new PrismaClient();
  try {
    await prisma.$connect();
    const subscriptions = await prisma.subscription.findMany({
      orderBy: { email: "asc" },
    });
    return { count: subscriptions.length, results: subscriptions };
  } catch {
  } finally {
    await prisma.$disconnect();
  }
});
