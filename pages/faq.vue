<template>
  <div class="container">
    <h1>FAQ</h1>
    <section>
      <h2>Wo kann ich den Newsletter abonnieren?</h2>
      <p class="text-center">
        <NuxtLink :to="localePath({ name: 'subscribe' })">HIER</NuxtLink>
      </p>
    </section>
    <section>
      <h2>Wo kann ich den Newsletter abbestellen?</h2>
      <p class="text-center">
        <NuxtLink :to="localePath({ name: 'unsubscribe' })">HIER</NuxtLink>
      </p>
    </section>
    <section>
      <h2>Was passiert mit meinen Daten?</h2>
      <p>
        Alle Daten die für den Betrieb des Newsletters erhoben werden, werden
        sicher in einer verschlüsselten Datenbank gespeichert und nicht an
        Dritte zu irgendwelchen Zwecken weitergegeben. Sie werden ausschließlich
        zum Zweck des Sendens von Newsletter-Emails mittels des Email-Services
        <a href="https://sendgrid.com/">SendGrid</a> genutzt.
        <br />
        Für weitere Informationen zum SendGrid Anbieter Twilio, klicke
        <a
          href="https://www.twilio.com/en-us/legal/privacy#data-about-our-customers-end-users"
          >HIER</a
        >.
        <br />
        Siehe auch:
        <NuxtLink :to="localePath({ name: 'privacy-notice' })">Datenschutzerklärung</NuxtLink>.
      </p>
    </section>
  </div>
</template>
<script setup lang="ts">
const localePath = useLocalePath();
</script>