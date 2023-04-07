<script lang="ts" setup>
const redirectToGoogle = () => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const scope = "email";
  const currentOrigin = window.location.origin;
  const redirectUri = `${currentOrigin}/auth/callback`;
  const authEndpoint = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=${encodeURIComponent(scope)}`;
  window.location.href = authEndpoint;
};
</script>

<template>
  <div class="flex gap-4 flex-col justify-center">
    <h1>Login Providers</h1>
    <button class="accent-button" @click="redirectToGoogle">Login with Google</button>
  </div>
</template>