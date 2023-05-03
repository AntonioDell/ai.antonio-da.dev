import { PrismaClient } from "@prisma/client";
import { validateCaptchaResponse } from "~/server/captcha";
import { object, string } from "yup";
import { createJWT, EXPIRES_IN_2_HOURS } from "~/server/jwt";

const prisma = new PrismaClient();
export default defineEventHandler(async (event) => {
  if (useRuntimeConfig().nodeEnv === "production") {
    const { isValid } = await validateCaptchaResponse(event);
    if (!isValid) {
      sendNoContent(event, 401);
      return;
    }
  }

  const body = await readBody(event);

  const schema = object({
    username: string().required().max(100),
    password: string().required().max(100),
  });
  try {
    const { username, password } = await schema.validate(body);

    const admin = await prisma.admin.findUnique({
      where: { username: username.toLowerCase() },
    });
    if (!admin || admin.password !== password) throw { code: 401 };

    const token = createJWT(admin);
    setCookie(event, "jwt", token, {
      httpOnly: true,
      maxAge: EXPIRES_IN_2_HOURS,
      secure: useRuntimeConfig().nodeEnv === "production",
      sameSite: true,
    });
    return { message: "Login succeeded" };
  } catch (error: any) {
    if ("name" in error && error.name === "ValidationError") {
      sendNoContent(event, 401);
    } else if (error.code && typeof error.code === "number") {
      sendNoContent(event, error.code);
    } else {
      sendNoContent(event, 500);
    }
    return;
  }
});
