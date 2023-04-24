<template>
  <div>
    <p v-if="areSubscriptionsLoading">Loading...</p>
    <p v-else-if="error">Error during loading.</p>
    <div v-else>
      <div class="flex mb-4 gap-4">
        <subscription-state-select
          allow-empty
          v-model="allSelectedState"
          :disabled="areSelectedActionsDisabled"
        />
        <button
          class="accent-button"
          :disabled="areSelectedActionsDisabled"
          @click="onApplyChanges"
        >
          Apply changes
        </button>
      </div>
      <subscription-row
        v-for="subscription in subscriptions"
        :key="subscription.email"
        :subscription="subscription"
        @subscription-changed="onSubscriptionChanged"
        @subscription-selected="onSubscriptionSelected(subscription, $event)"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { Subscription, SubscriptionState } from "@prisma/client";
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
  await useFetch(`/api/admin/subscriptions/${subscription.id}`, {
    method: "PUT",
    body: subscription,
  });
  await refresh();
};

const selectedSubscriptions = ref<Set<Subscription>>(new Set());
const onSubscriptionSelected = (
  subscription: Subscription,
  selected: boolean
) => {
  if (selected) selectedSubscriptions.value.add(subscription);
  else selectedSubscriptions.value.delete(subscription);

  if (selectedSubscriptions.value.size === 0) {
    allSelectedState.value = null;
  }
};

const allSelectedState = ref<SubscriptionState | null>(null);

const areSelectedActionsDisabled = computed(() => {
  return selectedSubscriptions.value.size === 0;
});
const onApplyChanges = async () => {
  if (!allSelectedState.value || selectedSubscriptions.value.size === 0) return;
  await useFetch(`/api/admin/subscriptions/batch`, {
    method: "PUT",
    body: Array.from(selectedSubscriptions.value).map((subscription) => ({
      ...subscription,
      state: allSelectedState,
    })),
  });
  await refresh();
};
</script>
