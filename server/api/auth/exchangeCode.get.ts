import { IncomingMessage, ServerResponse } from "http";
import { URLSearchParams } from "url";
import fetch from "node-fetch";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  if (!query.code) {
    sendRedirect(event, "/");
    return;
  }
  const redirectUri = event.node.req.headers.referer?.split("?")[0] || "";
  const params = new URLSearchParams();
  params.append("client_id", import.meta.env.GOOGLE_CLIENT_ID as string);
  params.append(
    "client_secret",
    import.meta.env.GOOGLE_CLIENT_SECRET as string
  );
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
