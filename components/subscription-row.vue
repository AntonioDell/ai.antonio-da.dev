<template>
  <div class="flex gap-4">
    <div>{{ subscriptionData.email }}</div>
    <select v-model="subscriptionData.state">
      <option
        v-for="state in subscriptionStates"
        :key="state"
        :value="state"
        :selected="subscriptionData.state === state"
      >
        {{ state }}
      </option>
    </select>
  </div>
</template>
<script setup lang="ts">
import { Subscription } from "@prisma/client";
import { SubscriptionState } from "@prisma/client";

const { subscription } = defineProps<{
  subscription: Subscription;
}>();

const emit = defineEmits<{
  (event: "subscription-changed", args: Subscription): void;
}>();

const subscriptionData = ref(subscription);
watch(
  subscriptionData,
  (newValue) => {
    emit("subscription-changed", newValue);
  },
  { deep: true }
);

const subscriptionStates = SubscriptionState;
</script>
