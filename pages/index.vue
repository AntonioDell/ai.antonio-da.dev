<script lang="ts" setup></script>

<template>
  <div class="container">
    <h1>{{ $t("Welcome to ai.antonio-da.dev!") }}</h1>
    <div>
      <p>{{ $t("This site is currently under construction.") }}</p>
      <p>
        {{$t("In the meantime checkout the")}}
        <NuxtLink
          href="https://github.com/AntonioDell/ai.antonio-da.dev"
          target="_blank"
          rel="noopener noreferrer"
          >{{$t("source code")}}</NuxtLink
        >!
      </p>
    </div>
    <button class="accent-button" @click="useRouter().push('/subscribe')">
      {{$t("Subscribe to the Newsletter")}}
    </button>
  </div>
</template>
