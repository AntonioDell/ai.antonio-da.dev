<template>
  <div class="container">
    <span v-if="errorMessage">
      {{ errorMessage }}
      <NuxtLink to="/unsubscribe">Go to unsubscribe page</NuxtLink>
    </span>
    <span v-else>You have been unsubscribed</span>
  </div>
</template>
<script setup lang="ts">
const errorMessage = ref("");

onMounted(async () => {
  const token = useRoute().query.token;
  if (!token) {
    errorMessage.value = "You need to unsubscribe first.";
    return;
  }

  const { error } = await useFetch("/api/unsubscribe", {
    query: { token },
    method: "POST",
  });
  if (error.value?.statusCode === 401) {
    errorMessage.value =
      "The unsubscribe link is not valid anymore, please try again";
  }
});
</script>
