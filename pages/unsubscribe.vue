<template>
  <EmailForm
    :error-message="errorMessage"
    :success-message="successMessage"
    submit-label="Unsubscribe"
    @submit="onSubmit"
  />
</template>
<script setup lang="ts">
const errorMessage = ref("");
const successMessage = ref("");

const onSubmit = async ({
  email,
  hcaptchaResponse,
}: {
  email: string;
  hcaptchaResponse: string;
}) => {
  errorMessage.value = "";
  successMessage.value = "";
  const { error } = await useFetch("/api/request-unsubscribe", {
    method: "POST",
    body: {
      email,
      hcaptchaResponse: hcaptchaResponse,
    },
  });
  if (error.value) {
    errorMessage.value = error.value.data?.message || "";
  } else {
    successMessage.value = "You received an email to unsubscribe.";
  }
};
</script>
