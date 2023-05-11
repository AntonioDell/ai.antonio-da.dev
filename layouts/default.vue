<template>
  <div class="app-container">
    <div class="app-header">
      <div class="positioned-center">
        <NuxtLink :to="localePath({ name: 'index' })">{{ t("Home") }}</NuxtLink>
        <NuxtLink :to="localePath({ name: 'faq' })">{{ t("FAQ") }}</NuxtLink>
      </div>

      <LangSwitcher class="positioned-right top-0" />
    </div>
    <div class="app-content"><slot /></div>
    <div class="app-footer">
      <div class="positioned-center">
        <NuxtLink
          href="https://github.com/AntonioDell/ai.antonio-da.dev"
          target="_blank"
          >Github</NuxtLink
        >
        <NuxtLink :to="localePath({ name: 'privacy-policy' })">{{
          t("Privacy Policy")
        }}</NuxtLink>
      </div>
      <NuxtLink
        href="/login"
        class="text-transparent positioned-right bottom-0"
      >
        Admin
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const localePath = useLocalePath();
const { t } = useI18n();
</script>

<style>
.app-header {
  width: 100vw;
  display: relative;
}
.app-container {
  display: flex;
  gap: 1rem;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100vh;
  padding: 1rem;
  box-sizing: border-box;
  align-items: center;
}
.app-content {
  flex-grow: 1;
}
.app-footer {
  width: 100vw;
  display: relative;
}
.positioned-center {
  display: flex;
  width: 100%;
  gap: 2rem;
  justify-content: center;
}
.positioned-right {
  position: absolute;
  right: 0;
  padding: 1rem;
}
</style>
