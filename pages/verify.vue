<template>
  <div>
    <p v-if="isVerifying">Verifying...</p>
    <p v-else-if="error">
      {{ error }}
    </p>
    <p v-else>
      Thank you for subscribing with {{ verifiedEmail }}!<br />You can safely
      navigate away now and enjoy the newsletter.
    </p>
  </div>
</template>
<script setup lang="ts">
const isVerifying = ref(true);
const verifiedEmail = ref("");
const error = ref("");

onMounted(async () => {
  isVerifying.value = true;
  const token = useRoute().query.token;
  const response = await useFetch("/api/verify", {
    method: "POST",
    query: { token },
  });
  if (response.data.value?.email) {
    verifiedEmail.value = response.data.value.email;
  } else {
    // TODO: Add retry button (f.e. send user to subscribe page again)
    // TODO: Handle token validation failed (f.e. token expired or token was tempered with)
    // TODO: Handle already verified subscription (f.e. user navigates to page with browser back button)
    error.value = "Verifying the subscription failed. Please try again.";
  }

  isVerifying.value = false;
});
</script>
