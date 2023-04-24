<template>
  <div class="flex gap-4">
    <div>Template ID: {{ newsletterData.templateId }}</div>
    <div>Drafted: {{ newsletterData.draftedAt.toLocaleString("de") }}</div>
    <div>
      Published: {{ newsletterData.publishedAt?.toLocaleString("de") || "-" }}
    </div>
    <div>
      Receivers:
      <span v-for="receiver in receivers">{{ receiver.email }}</span>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Newsletter, Subscription } from "@prisma/client";

const { newsletter, receivers } = defineProps<{
  newsletter: Newsletter;
  receivers: Subscription[];
}>();
const newsletterData = ref(newsletter);
</script>
