const {
  public: { apiBase },
} = useRuntimeConfig();

export default {
  async fetchPreFish(userId: string, depth: number) {
    const response = await $fetch(`${apiBase}/get-fish/${userId}`, {
      method: "POST",
      body: {
        depth,
      },
    });
    return response;
  },

  async catchFish(userId: string, randomId: string) {
    const response = await $fetch(`${apiBase}/catch-fish/${userId}`, {
      method: "POST",
      body: {
        randomId,
      },
    });
    return response;
  },
};
