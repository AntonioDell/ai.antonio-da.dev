export default defineEventHandler((event) => {
  if (!event.node.req.headers.referer) {
    setResponseStatus(event, 400);
    return;
  }
  const referrerUrl = new URL(event.node.req.headers.referer);
  const redirectUri = `${referrerUrl.protocol}//${referrerUrl.host}/auth/callback`;
  const clientId = import.meta.env.GOOGLE_CLIENT_ID;
  const scope = "email";
  const authEndpoint = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=${encodeURIComponent(scope)}`;
  sendRedirect(event, authEndpoint);

  return "Ok"
});
