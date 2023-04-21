<template>
  <div class="flex gap-4">
    <input type="checkbox" @change="onCheckboxChange" />
    <div>{{ subscriptionData.email }}</div>
    <subscription-state-select v-model="subscriptionData.state" />
  </div>
</template>
<script setup lang="ts">
import { Subscription } from "@prisma/client";

const { subscription } = defineProps<{
  subscription: Subscription;
}>();

const emit = defineEmits<{
  (event: "subscription-changed", args: Subscription): void;
  (event: "subscription-selected", args: boolean): void;
}>();

const subscriptionData = ref(subscription);
watch(
  subscriptionData,
  (newValue) => {
    emit("subscription-changed", newValue);
  },
  { deep: true }
);

const onCheckboxChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit("subscription-selected", target.checked);
};
</script>
