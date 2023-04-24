<template>
  <div>
    <Form
      @submit="onNewDraftSubmit"
      class="flex flex-col gap-2 items-center"
      :validation-schema="schema"
      v-slot="{ isSubmitting, meta }"
    >
      <Field
        type="text"
        name="templateId"
        class="accent-field"
        placeholder="Template ID"
      />
      <button
        class="accent-button"
        :disabled="isSubmitting || !meta.valid || !meta.touched"
      >
        New Draft
      </button>
      <div v-if="message" class="flex items-center gap-4">
        <p>{{ message }}</p>
        <button class="error-button" @click="message = ''">X</button>
      </div>
    </Form>
    <newsletter-row
      class="py-1"
      v-for="newsletter in newsletters"
      :newsletter="newsletter"
      :receivers="subscriptionsPerNewsletter.get(newsletter.id) || []"
      @newsletter-removed="onNewsletterRemoved"
    />
  </div>
</template>
<script setup lang="ts">
import { Newsletter, Subscription } from "@prisma/client";
import { Field, Form } from "vee-validate";
import { InferType } from "yup";
import { object, string } from "yup";
import superjson from "superjson";

const {
  data: newsletters,
  pending: newslettersPending,
  refresh: refreshNewsletters,
} = useFetch("/api/admin/newsletters", {
  method: "GET",
  transform: (value) => {
    return superjson.parse<Newsletter[]>(value as unknown as string);
  },
});

const subscriptionsPerNewsletter = ref(new Map<string, Subscription[]>());
watchEffect(async () => {
  if (!newsletters.value) return;
  subscriptionsPerNewsletter.value.clear();
  for (const newsletter of newsletters.value) {
    const { data: subscriptions } = await useFetch(
      `/api/admin/newsletters/${newsletter.id}/subscriptions`,
      {
        transform: (value) => {
          return superjson.parse(value as unknown as string) as Subscription[];
        },
      }
    );

    subscriptionsPerNewsletter.value.set(
      newsletter.id,
      subscriptions.value || []
    );
  }
});

const message = ref("");
const schema = object({
  templateId: string().required(),
});

const onNewDraftSubmit = async (values: any) => {
  const formValues = values as InferType<typeof schema>;
  const { error, data } = await useFetch("/api/admin/newsletters", {
    method: "POST",
    body: formValues,
  });
  if (error.value) {
    message.value = error.value.data.message;
  } else {
    message.value = "New draft successfully created!";
  }
  await refreshNewsletters();
};

const onNewsletterRemoved = async (newsletter: Newsletter) => {
  const { error, data } = await useFetch(
    `/api/admin/newsletters/${newsletter.id}`,
    {
      method: "DELETE",
    }
  );
  if (error.value) {
    message.value = error.value.data.message;
  } else {
    message.value = data.value?.message!;
  }
  await refreshNewsletters();
};
</script>
