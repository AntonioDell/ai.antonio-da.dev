import { PrismaClient, SubscriptionState } from "@prisma/client";
import jwt, { type JwtPayload } from "jsonwebtoken";

type ValidationResult =
  | { isValid: true; email: string; id: string }
  | { isValid: false };

function verifyToken(token: string, secret: string): ValidationResult {
  try {
    const { id, email } = jwt.verify(token, secret) as JwtPayload;
    return { isValid: true, id, email };
  } catch (error: any) {
    console.error("Error verifying JWT:", error);
    return { isValid: false };
  }
}

export default defineEventHandler(async (event) => {
  const { jwtSecret } = useRuntimeConfig();
  const query = getQuery(event);
  const result = verifyToken(query.token as string, jwtSecret);
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
