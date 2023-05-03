<template>
  <Form
    class="flex flex-col gap-2 items-center"
    @submit="onSubmit"
    :validation-schema="schema"
    v-slot="{ isSubmitting, meta }"
  >
    <Field
      class="accent-field"
      name="email"
      type="email"
      placeholder="Your email address"
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
      :disabled="
        isSubmitting || !isCaptchaVerified || !meta.touched || !meta.valid
      "
    >
      {{ submitLabel }}
    </button>
    <p v-if="errorMessage">{{ errorMessage }}</p>
    <p v-if="successMessage">{{ successMessage }}</p>
  </Form>
</template>
<script setup lang="ts">
import { Form, Field, ErrorMessage } from "vee-validate";
import { InferType, object, string } from "yup";
import hcaptcha from "@hcaptcha/vue3-hcaptcha";

type EmailFormSubmit = { email: string; hcaptchaResponse: string };

const emit = defineEmits<{
  (events: "submit", args: EmailFormSubmit): void;
}>();
const { errorMessage, successMessage, submitLabel } = defineProps<{
  errorMessage: string;
  successMessage: string;
  submitLabel: string;
}>();

const token = useRoute().query.token;

const schema = object({
  email: string().required().email(),
});
const onSubmit = async (values: any) => {
  const formValues = values as InferType<typeof schema>;
  emit("submit", {
    email: formValues.email,
    hcaptchaResponse: hcaptchaResponse.value,
  });
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
