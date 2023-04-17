import { H3Event } from "h3";
import { CaptchaValidationResult } from "./types";

const validateCaptchaResponse = async (
  event: H3Event
): Promise<CaptchaValidationResult> => {
  const body = await readBody(event);

  // hCaptcha Verification
  if (!body.hcaptchaResponse) {
    setResponseStatus(event, 400);
    return { isValid: false, message: "No hCaptcha response set." };
  }
  try {
    const { hcaptchaResponse } = body;
    const { hcaptchaSecret } = useRuntimeConfig();
    const result: any = await $fetch("https://hcaptcha.com/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: Object.entries({
        secret: hcaptchaSecret,
        response: hcaptchaResponse,
      })
        .map(
          ([key, value]) =>
            encodeURIComponent(key) + "=" + encodeURIComponent(value)
        )
        .join("&"),
    });

    if (!result.success) {
      throw new Error("hCaptcha verification failed.");
    } else {
      return { isValid: true };
    }
  } catch (error: Error | any) {
    console.error(error);
    if (error.message === "hCaptcha verification failed.") {
      setResponseStatus(event, 400);
      return { isValid: false, message: error.message };
    } else {
      setResponseStatus(event, 500);
      return {
        isValid: false,
        message: "An error occurred. Please try again later.",
      };
    }
  }
};

export { validateCaptchaResponse };
