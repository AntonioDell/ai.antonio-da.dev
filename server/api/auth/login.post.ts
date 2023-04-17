import { PrismaClient } from "@prisma/client";
import { validateCaptchaResponse } from "~/server/captcha";
import { object, string } from "yup";
import { createJWT, expiresIn } from "~/server/jwt";

export default defineEventHandler(async (event) => {
  const { isValid } = await validateCaptchaResponse(event);
  if (!isValid) {
    sendNoContent(event, 401);
    return;
  }

  const body = await readBody(event);

  const schema = object({
    username: string().required().max(100),
    password: string().required().max(100),
  });
  const prisma = new PrismaClient();
  try {
    const { username, password } = await schema.validate(body);

    await prisma.$connect();
    const admin = await prisma.admin.findUnique({ where: { username } });
    if (!admin || admin.password !== password) throw { code: 401 };

    const token = createJWT(admin);
    setCookie(event, "jwt", token, {
      httpOnly: true,
      maxAge: expiresIn,
      secure: useRuntimeConfig().nodeEnv === "production",
      sameSite: true,
    });
    return { message: "Login successful" };
  } catch (error: any) {
    if ("name" in error && error.name === "ValidationError") {
      sendNoContent(event, 401);
    } else if (error.code && typeof error.code === "number") {
      sendNoContent(event, error.code);
    } else {
      sendNoContent(event, 500);
    }
    return;
  } finally {
    await prisma.$disconnect();
  }
});
