// plugins/runtimeConfig.ts

export default defineNuxtPlugin((nuxtApp) => {
  const {
    public: { apiBase },
  } = useRuntimeConfig();
  nuxtApp.provide("apiBase", apiBase); // apiBaseをinject
});
