<template>
  <div class="container">
    <span v-if="errorMessage">
      {{ errorMessage }}
      <NuxtLink to="/unsubscribe">{{ t("Go to unsubscribe page") }}</NuxtLink>
    </span>
    <span v-else>{{ t("You have been unsubscribed") }}</span>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();
const errorMessage = ref("");

onMounted(async () => {
  const token = useRoute().query.token;
  if (!token) {
    errorMessage.value = t("You need to unsubscribe first.");
    return;
  }

  const { error } = await useFetch("/api/unsubscribe", {
    query: { token },
    method: "POST",
  });
  if (error.value?.statusCode === 401) {
    errorMessage.value = t(
      "The unsubscribe link is not valid anymore, please try again"
    );
  }
});
</script>
