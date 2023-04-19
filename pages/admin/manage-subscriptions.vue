<template>
  <div>
    <p v-if="areSubscriptionsLoading">Loading...</p>
    <p v-else-if="error">Error during loading.</p>
    <subscription-row
      v-else
      v-for="subscription in subscriptions"
      :key="subscription.email"
      :subscription="subscription"
      @subscription-changed="onSubscriptionChanged"
    />
  </div>
</template>
<script setup lang="ts">
import { Subscription } from "@prisma/client";
const {
  data,
  pending: areSubscriptionsLoading,
  error,
  refresh,
} = await useFetch("/api/admin/subscriptions");
const subscriptions = computed(() => {
  return data.value?.results || null;
});

const onSubscriptionChanged = async (subscription: Subscription) => {
  try {
    await useFetch(`/api/admin/subscriptions/${subscription.id}`, {
      method: "PUT",
      body: subscription,
    });
    await refresh();
  } catch (error: any) {
    console.log(error);
  }
};
</script>
