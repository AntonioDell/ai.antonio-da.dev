<template>
  <div class="container text-center">
    <h1>Admin Login</h1>
    <p>
      You are probably wrong, go back <NuxtLink href="/">home</NuxtLink> friend.
    </p>
    <Form
      class="flex flex-col gap-4"
      @submit="onSubmit"
      :validation-schema="schema"
      v-slot="{ isSubmitting }"
    >
      <Field class="accent-field" name="username" placeholder="Username" />
      <Field class="accent-field" name="password" placeholder="Password" />
      <hcaptcha
        :sitekey="useRuntimeConfig().public.hcaptchaSiteKey"
        @verify="onCaptchaVerify"
        @expired="onCaptchaExpired"
      ></hcaptcha>
      <button
        class="accent-button"
        :disabled="isSubmitting || !isCaptchaVerified"
      >
        Submit
      </button>
      <p v-if="errorMessage">{{ errorMessage }}</p>
      <p v-else-if="success">Welcome!</p>
    </Form>
  </div>
</template>
<script lang="ts" setup>
import { Form, Field } from "vee-validate";
import { object, string } from "yup";
import hcaptcha from "@hcaptcha/vue3-hcaptcha";

const errorMessage = ref("");
const success = ref(false);
const schema = object({
  username: string().required(),
  password: string().required(),
});
const onSubmit = async (values: any) => {
  errorMessage.value = "";
  const { error } = await useFetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({
      ...values,
      hcaptchaResponse: hcaptchaResponse.value,
    }),
  });
  if (error.value) {
    errorMessage.value = "Login failed";
    success.value = false;
  } else {
    success.value = true;
  }
};

const isCaptchaVerified = ref(false);
const hcaptchaResponse = ref("");
const onCaptchaVerify = (token: string) => {
  isCaptchaVerified.value = true;
  hcaptchaResponse.value = token;
};
const onCaptchaExpired = () => {
  isCaptchaVerified.value = false;
};
</script>
