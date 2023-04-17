<template>
  <div class="app-container">
    <div class="app-header">
      <NuxtLink href="/">Home</NuxtLink>
    </div>
    <div class="app-content"><slot /></div>
    <div class="app-footer">
      <NuxtLink
        href="https://github.com/AntonioDell/ai.antonio-da.dev"
        target="_blank"
        >Github</NuxtLink
      >
      <NuxtLink href="/login" class="text-transparent">Admin</NuxtLink>
    </div>
  </div>
</template>
<style>
.app-header {
  display: flex;
  justify-content: flex-start;
  gap: 2rem;
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
  display: flex;
  justify-content: flex-start;
  gap: 2rem;
}
</style>
