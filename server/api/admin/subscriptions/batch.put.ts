import { Frequency, PrismaClient, SubscriptionState } from "@prisma/client";
import { InferType, array, object, string } from "yup";

const prisma = new PrismaClient();
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

  try {
    const updateQueries = subscriptions!.map((subscription) =>
      prisma.subscription.update({
        where: { id: subscription.id },
        data: subscription,
      })
    );
    await prisma.$transaction(updateQueries);
    return { status: "Ok" };
  } catch (error: any) {
    sendNoContent(event, 500);
    return;
  }
});
