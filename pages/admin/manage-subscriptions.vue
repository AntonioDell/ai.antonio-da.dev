<template>
  <div>
    <p v-if="areSubscriptionsLoading">Loading...</p>
    <p v-else-if="error">Error during loading.</p>
    <div v-else v-for="subscription in subscriptions" :key="subscription.id">
      {{ subscription.email }}: {{ subscription.state }}
    </div>
  </div>
</template>
<script setup lang="ts">
const {
  data,
  pending: areSubscriptionsLoading,
  error,
} = await useFetch("/api/admin/subscriptions");
const subscriptions = computed(() => {
  return data.value?.results || null;
});
</script>
