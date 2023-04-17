import { verifyJWT } from "~/server/jwt";

// FIXME: This is vulnerable against CSRF attacks.
export default defineEventHandler((event) => {
  if (event.path?.includes("admin")) {
    const jwtCookie = getCookie(event, "jwt");
    if (!jwtCookie) {
      sendNoContent(event, 401);
      return;
    }
    const result = verifyJWT(jwtCookie);
    if (!result.isValid) {
      sendNoContent(event, 401);
      return;
    }
  }
});
