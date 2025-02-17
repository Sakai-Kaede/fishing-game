export default {
  async fetchPreFish(userId: string, depth: number) {
    const apiBase = useNuxtApp().$apiBase;
    return await $fetch(`${apiBase}/get-fish/${userId}`, {
      method: "POST",
      body: {
        depth,
      },
    });
  },

  async catchFish(userId: string, randomId: string) {
    const apiBase = useNuxtApp().$apiBase;
    return await $fetch(`${apiBase}/catch-fish/${userId}`, {
      method: "POST",
      body: {
        randomId,
      },
    });
  },
};
