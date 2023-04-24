<template>
  <div class="flex items-center gap-4">
    <div>Template ID: {{ newsletterData.templateId }}</div>
    <div>
      Drafted:
      {{
        newsletterData.draftedAt.toLocaleString("de", {
          timeZone: "Europe/Berlin",
        })
      }}
    </div>
    <div>
      Published:
      {{
        newsletterData.publishedAt?.toLocaleString("de", {
          timeZone: "Europe/Berlin",
        }) || "-"
      }}
    </div>
    <div>
      Receivers:
      <span v-for="receiver in receivers">{{ receiver.email }}</span>
    </div>
    <div v-if="!newsletterData.publishedAt" class="flex gap-1">
      <button
        class="error-button"
        @click="emit('newsletter-removed', newsletterData)"
      >
        Remove
      </button>
      <button
        class="accent-button"
        @click="emit('newsletter-published', newsletterData)"
      >
        Publish
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Newsletter, Subscription } from "@prisma/client";

const emit = defineEmits<{
  (events: "newsletter-removed", args: Newsletter): void;
  (events: "newsletter-published", args: Newsletter): void;
}>();

const { newsletter, receivers } = defineProps<{
  newsletter: Newsletter;
  receivers: Subscription[];
}>();
const newsletterData = ref(newsletter);
</script>
