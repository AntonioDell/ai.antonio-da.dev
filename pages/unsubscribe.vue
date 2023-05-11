<template>
  <EmailForm
    :error-message="errorMessage"
    :success-message="successMessage"
    :submit-label="t('Unsubscribe')"
    @submit="onSubmit"
  />
</template>
<script setup lang="ts">
const errorMessage = ref("");
const successMessage = ref("");

const { t } = useI18n();

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
    successMessage.value = t("You received an email to unsubscribe.");
  }
};
</script>
