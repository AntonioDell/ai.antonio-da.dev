// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxtjs/tailwindcss", "@nuxtjs/i18n-edge"],
  plugins: [{ src: "~/plugins/vercel.ts", mode: "client" }],
  runtimeConfig: {
    googleClientSecret: "",
    sendgridApiKey: "",
    jwtSecret: "",
    nodeEnv: "",
    hcaptchaSecret: "",
    public: {
      baseUrl: "",
      googleClientId: "",
      hcaptchaSiteKey: "",
    },
    db: {
      host: process.env.DB_HOST || "localhost",
      port: process.env.DB_PORT || "5432",
      user: process.env.DB_USER || "myuser",
      password: process.env.DB_PASSWORD || "mypassword",
      database: process.env.DB_NAME || "mydb",
    },
  },
  app: {
    pageTransition: { name: "page", mode: "out-in" },
  },
  i18n: {
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      redirectOn: "root",
      fallbackLocale: "de",
    },
    locales: [
      {
        code: "de",
        name: "🇩🇪",
      },
      {
        code: "en",
        name: "🇬🇧",
      },
    ],
    defaultLocale: "de",
    strategy: "prefix_and_default",
    customRoutes: "config",
    pages: {
      index: {
        en: "/",
        de: "/",
      },
      faq: {
        en: "/faq",
        de: "/faq",
      },
      "privacy-policy": {
        en: "/privacy-policy",
        de: "/datenschutz",
      },
      subscribe: {
        en: "/subscribe",
        de: "/abonnieren",
      },
      unsubscribe: {
        en: "/unsubscribe",
        de: "/abmelden",
      },
      "verify-unsubscribe": {
        en: "/verify-unsubscribe",
        de: "/abmeldung-verifizieren",
      },
    },
  },
});
