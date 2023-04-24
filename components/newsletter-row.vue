<template>
  <div class="flex items-center gap-4">
    <div>Template ID: {{ newsletterData.templateId }}</div>
    <div>
      Drafted:
      {{ newsletterData.draftedAt.toLocaleString("de", { timeZone: "Europe/Berlin" }) }}
    </div>
    <div>
      Published:
      {{ newsletterData.publishedAt?.toLocaleString("de", {timeZone: "Europe/Berlin"}) || "-" }}
    </div>
    <div>
      Receivers:
      <span v-for="receiver in receivers">{{ receiver.email }}</span>
    </div>
    <button
      v-if="!newsletterData.publishedAt"
      class="error-button"
      @click="emit('newsletter-removed', newsletterData)"
    >
      Remove
    </button>
  </div>
</template>
<script setup lang="ts">
import { Newsletter, Subscription } from "@prisma/client";

const emit = defineEmits<{
  (events: "newsletter-removed", args: Newsletter): void;
}>();

const { newsletter, receivers } = defineProps<{
  newsletter: Newsletter;
  receivers: Subscription[];
}>();
const newsletterData = ref(newsletter);
</script>
