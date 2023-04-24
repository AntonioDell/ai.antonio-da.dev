import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export default defineEventHandler(async (event) => {
  const id = event.context.params?.newsletterId;
  if (!id || typeof id !== "string") {
    setResponseStatus(event, 400);
    return { message: "Parameter id missing" };
  }
  console.log("Delete " + id);
  try {
    const newsletter = await prisma.newsletter.findFirst({ where: { id } });
    if (!newsletter) {
      setResponseStatus(event, 400);
      return { message: "No newsletter with given id exists" };
    } else if (newsletter.publishedAt) {
      setResponseStatus(event, 400);
      return { message: "Cannot delete published newsletter" };
    }
    await prisma.newsletter.delete({ where: { id } });
    return { message: "Newsletter draft successfully deleted" };
  } catch (error: any) {
    setResponseStatus(event, 500);
    return { message: "Database error" };
  }
});
