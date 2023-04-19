import { Frequency, PrismaClient, SubscriptionState } from "@prisma/client";
import { object, string } from "yup";

export default defineEventHandler(async (event) => {
  if (!event.context?.params?.id) {
    setResponseStatus(event, 400);
    return { message: "Missing id parameter" };
  }
  const id = event.context.params.id;

  const schema = object({
    id: string().uuid().required(),
    state: string<SubscriptionState>().required().defined(),
    email: string().email().required(),
    frequency: string<Frequency>().optional(),
  });
  const prisma = new PrismaClient();
  try {
    const subscription = await schema.validate(await readBody(event));
    await prisma.$connect();
    await prisma.subscription.update({ where: { id }, data: subscription });

    return { status: "Ok" };
  } catch (error: any) {
    if (error.name === "ValidationError") {
      sendNoContent(event, 400);
    } else {
      sendNoContent(event, 500);
    }
  } finally {
    await prisma.$disconnect();
  }
});
