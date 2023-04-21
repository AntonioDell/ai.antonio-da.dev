import { Frequency, PrismaClient, SubscriptionState } from "@prisma/client";
import { InferType, Schema, array, number, object, string } from "yup";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const schema = array().of(
    object({
      id: string().uuid().required(),
      state: string<SubscriptionState>().required().defined(),
      email: string().email().required(),
      frequency: string<Frequency>().optional(),
    })
  );
  let subscriptions: InferType<typeof schema>;
  try {
    subscriptions = await schema.validate(body);
    if (subscriptions?.length === 0) {
      throw new Error();
    }
  } catch (error: any) {
    sendNoContent(event, 400);
    return;
  }

  const prisma = new PrismaClient();
  try {
    const updateQueries = subscriptions!.map((subscription) =>
      prisma.subscription.update({
        where: { id: subscription.id },
        data: subscription,
      })
    );
    await prisma.$connect();
    await prisma.$transaction(updateQueries);
    return { status: "Ok" };
  } catch (error: any) {
    sendNoContent(event, 500);
    return;
  } finally {
    await prisma.$disconnect();
  }
});
