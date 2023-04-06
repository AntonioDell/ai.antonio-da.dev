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
  <div class="login">
    <h1>Login with Google</h1>
    <button @click="redirectToGoogle">Login</button>
  </div>
</template>

<style scoped>
.login {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

button {
  padding: 10px 20px;
  background-color: #4285f4;
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #1a73e8;
}
</style>
