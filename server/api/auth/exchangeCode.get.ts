import fetch from "node-fetch";
import { URLSearchParams } from "url";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  if (!query.code) {
    sendRedirect(event, "/");
    return;
  }
  const { googleClientSecret } = useRuntimeConfig();
  const googleClientId = useRuntimeConfig().public.googleClientId;

  const redirectUri = event.node.req.headers.referer?.split("?")[0] || "";
  const params = new URLSearchParams();
  params.append("client_id", googleClientId);
  params.append("client_secret", googleClientSecret);
  params.append("redirect_uri", redirectUri);
  params.append("grant_type", "authorization_code");
  params.append("code", query.code as string);

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });

  const json = await response.json();
  return json;
});
