<template>
  <div>
    <newsletter-row
      v-for="newsletter in newsletters"
      :newsletter="newsletter"
      :receivers="subscriptionsPerNewsletter.get(newsletter.id) || []"
    />
    <Form
      @submit="onDraftSubmit"
      class="flex flex-col gap-2 items-center"
      :validation-schema="schema"
      v-slot="{ isSubmitting, meta }"
    >
      <Field type="text" name="templateId" class="accent-field" />
      <button
        class="accent-button"
        :disabled="isSubmitting || !meta.valid || !meta.touched"
      >
        Create Draft
      </button>
    </Form>
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

const schema = object({
  templateId: string().required(),
});

const onDraftSubmit = async (values: any) => {
  const formValues = values as InferType<typeof schema>;
};
</script>
