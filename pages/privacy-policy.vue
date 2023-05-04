<template>
  <div v-html="privacyNoticeHtml" class="container"></div>
</template>
<script setup lang="ts">
const { locale } = useI18n();

/** Cannot use useFetch because of https://github.com/nuxt/nuxt/issues/13857. */
const privacyNoticeHtml = await $fetch(
  `${useRuntimeConfig().public.baseUrl}/privacy-policies/${locale.value}.html`
);
</script>
