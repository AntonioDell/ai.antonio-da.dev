<script lang="ts" setup>
const redirectToGoogle = async () => {
  window.location.href = "/api/auth/login"
};
</script>

<template>
  <div class="container">
    <h1>Login Providers</h1>
    <button class="accent-button" @click="redirectToGoogle">Login with Google</button>
  </div>
</template>