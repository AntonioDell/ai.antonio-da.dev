<template>
  <Form
    @submit="onSubmit"
    class="flex flex-col gap-2 items-center"
    :validation-schema="schema"
    v-slot="{ isSubmitting }"
  >
    <p>
      Disclaimer: This feature doesn't work yet. It is in active development.
    </p>
    <Field
      name="email"
      type="email"
      placeholder="Your email address"
      class="max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder-gray-400 bg-white hover:border-blue-400 transition-colors duration-200 ease-in"
    />
    <ErrorMessage name="email" class="text-red-500" />
    <hcaptcha
      :sitekey="useRuntimeConfig().public.hcaptchaSiteKey"
      @verify="onCaptchaVerify"
      @expired="onCaptchaExpired"
    ></hcaptcha>
    <button
      type="submit"
      class="accent-button"
      :disabled="isSubmitting || !isCaptchaVerified"
    >
      Subscribe
    </button>
    <p v-if="errorMessage">{{ errorMessage }}</p>
    <p v-if="successMessage">{{ successMessage }}</p>
  </Form>
</template>
<script lang="ts" setup>
import hcaptcha from "@hcaptcha/vue3-hcaptcha";
import { Field, Form, ErrorMessage } from "vee-validate";
import { object, string } from "yup";

const successMessage = ref("");
const errorMessage = ref("");

const schema = object({
  email: string().required().email(),
});
const onSubmit = async (values: any) => {
  errorMessage.value = "";
  successMessage.value = "";
  const { error } = await useFetch("/api/subscribe", {
    method: "POST",
    body: JSON.stringify({
      ...values,
      hcaptchaResponse: hcaptchaResponse.value,
    }),
  });
  if (error.value) {
    errorMessage.value = error.value.data?.message || "";
  } else {
    successMessage.value = "You received a confirmation email";
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
