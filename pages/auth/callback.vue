<script lang="ts" setup>
onMounted(async () => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const currentOrigin = window.location.origin;
  const redirectUri = `${currentOrigin}/auth/callback`;
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");

  if (code) {
    try {
      // Exchange the authorization code for an access token and ID token
      const tokenResponse = (await $fetch(
        "https://oauth2.googleapis.com/token",
        {
          method: "POST",
          params: {
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: redirectUri,
            grant_type: "authorization_code",
            code,
          },
        }
      )) as any;

      useRouter().push("/user/settings")
    } catch (error) {
      console.error("Error during token exchange:", error);
    }
  } else {
    console.error("No authorization code found in the URL");
  }
});
</script>

<template>
  <div>
    <h1>Auth Callback</h1>
  </div>
</template>
