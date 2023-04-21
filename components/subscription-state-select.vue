<template>
  <select v-model="stateData">
    <option v-if="allowEmpty" :value="null"></option>
    <option
      v-for="state in subscriptionStates"
      :key="state"
      :value="state"
      :selected="stateData === state"
    >
      {{ state }}
    </option>
  </select>
</template>
<script setup lang="ts">
import { SubscriptionState } from "@prisma/client";

const emit = defineEmits<{
  (event: "update:modelValue", args: SubscriptionState): void;
}>();

const props = defineProps<{
  modelValue: SubscriptionState | null;
  allowEmpty?: boolean;
}>();
watch(
  () => props.modelValue,
  (newValue) => {
    stateData.value = newValue;
  }
);

const stateData = ref(props.modelValue);
watch(stateData, (newValue, oldValue) => {
  if (newValue === oldValue || !newValue) return;
  emit("update:modelValue", newValue);
});

const subscriptionStates = SubscriptionState;
</script>
