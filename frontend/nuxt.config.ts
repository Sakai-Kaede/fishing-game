export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      apiBase: "https://fishing-game-backend.vercel.app",
    },
  },
  components: [
    { path: "~/components/presentational/Atoms", prefix: "Atoms" },
    { path: "~/components/presentational/Molecules", prefix: "Molecules" },
    { path: "~/components/container/register", prefix: "Register" },
    { path: "~/components/container/login", prefix: "Login" },
    { path: "~/components/container/ranking", prefix: "Ranking" },
    { path: "~/components/container/shop", prefix: "Shop" },
    { path: "~/components/container/poker", prefix: "Poker" },
    {
      path: "~/components/container/illustratedBook",
      prefix: "illustratedBook",
    },
    {
      path: "~/components/container/fishing",
      prefix: "Fishing",
    },
  ],
  css: ["~/assets/scss/main.scss"],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use "@/assets/scss/variables.scss" as *;
            @use "@/assets/scss/base.scss" as *;
            @use "@/assets/scss/mixins.scss" as *;
            @use "@/assets/scss/animation.scss" as *;
          `,
        },
      },
    },
  },
  modules: [
    "@pinia/nuxt",
    "pinia-plugin-persistedstate/nuxt",
    "nuxt-phosphor-icons",
  ],
  plugins: ["~/plugins/runtimeConfig.ts"],
});
