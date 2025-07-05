// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  // devtools: { enabled: true },
  modules: ["@nuxt/ui", "@pinia/nuxt"],
  ui: {
    theme: {
      colors: {
        primary: "emerald",
        gray: "zinc",
      },
    },
    toast: {
      position: "top-right",
    },
  },
});
