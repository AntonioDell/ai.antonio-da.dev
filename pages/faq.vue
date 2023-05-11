<template>
  <div v-html="faqHtml" class="container"></div>
</template>
<script setup lang="ts">
const { locale } = useI18n();

/** Cannot use useFetch because of https://github.com/nuxt/nuxt/issues/13857. */
const faqHtml = await $fetch(
  `${useRuntimeConfig().public.baseUrl}/faqs/${locale.value}.html`
);
</script>
