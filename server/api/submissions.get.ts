import { PrismaClient } from '@prisma/client';

export default defineEventHandler(async () => {
  const prisma = new PrismaClient();
  try {
    await prisma.$connect();
    console.log("GET /submissions", await prisma.submission.findMany())

  } catch(error){
    console.error(error)
  } finally{
    await prisma.$disconnect()
  }
});
