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
      v-slot="{ isSubmitting, meta }"
    >
      <Field
        class="accent-field"
        name="username"
        placeholder="Username"
        type="username"
      />
      <Field
        class="accent-field"
        name="password"
        placeholder="Password"
        type="password"
      />
      <hcaptcha
        v-if="showCaptcha"
        ref="captcha"
        :sitekey="useRuntimeConfig().public.hcaptchaSiteKey"
        @verify="onCaptchaVerify"
        @expired="onCaptchaExpired"
      ></hcaptcha>
      <button
        class="accent-button"
        :disabled="
          isSubmitting || !isCaptchaVerified || !meta.valid || !meta.touched
        "
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

const captcha = ref(null);

const errorMessage = ref("");
const success = ref(false);
const schema = object({
  username: string().required().default(""),
  password: string().required().default(""),
});
const onSubmit = async (values: any) => {
  errorMessage.value = "";
  const { error } = await useFetch("/api/auth/login", {
    method: "POST",
    body: {
      ...values,
      hcaptchaResponse: hcaptchaResponse.value,
    },
  });
  if (error.value) {
    errorMessage.value = "Login failed";
    success.value = false;
  } else {
    success.value = true;
    useRouter().push("/admin/manage-subscriptions");
  }
  if (captcha.value) {
    (captcha.value as any).reset();
  }
};

const showCaptcha = import.meta.env.VITE_SHOW_CAPTCHA === "true";
const isCaptchaVerified = ref(false || !showCaptcha);
const hcaptchaResponse = ref("");
const onCaptchaVerify = (token: string) => {
  isCaptchaVerified.value = true;
  hcaptchaResponse.value = token;
};
const onCaptchaExpired = () => {
  isCaptchaVerified.value = false;
};
</script>
