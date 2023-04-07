<script lang="ts" setup>
onMounted(async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");
  if (code) {
    try {
      // Exchange the authorization code for an access token and ID token
      await useFetch(`/api/exchangeCode?code=${code}`);
      window.location.href = "/user/settings"
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
    <h1>You are being redirected ...</h1>
  </div>
</template>
