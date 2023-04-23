import dayjs from "dayjs";
import { PrismaClient } from "@prisma/client";
import superjson from "superjson";

const prisma = new PrismaClient();
export default defineEventHandler(async (event) => {
  try {
    const allNewsletters = await prisma.newsletter.findMany();
    const drafts = allNewsletters
      .filter((newsletter) => newsletter.publishedAt === null)
      .sort((a, b) => (dayjs(a.draftedAt).isBefore(b.draftedAt) ? -1 : 1));
    const published = allNewsletters
      .filter((newsLetter) => newsLetter.publishedAt !== null)
      .sort((a, b) => (dayjs(a.publishedAt).isBefore(b.publishedAt) ? -1 : 1));
    const ret = drafts.concat(published).map((newsletter) => {
      return {
        ...newsletter,
        toJSON() {
          return this;
        },
      };
    });
    return superjson.stringify(ret) as unknown as typeof ret
  } catch (error) {
    sendNoContent(event, 500);
    return;
  }
});
