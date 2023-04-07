// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxtjs/tailwindcss"],
  runtimeConfig: {
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
  vite: {
    define: {
      "process.env.GOOGLE_CLIENT_ID": JSON.stringify(
        process.env.GOOGLE_CLIENT_ID
      ),
      "process.env.GOOGLE_CLIENT_SECRET": JSON.stringify(
        process.env.GOOGLE_CLIENT_SECRET
      ),
    },
  },
});
