export default {
  async registerUser(username: string, password: string, favoriteFish: string) {
    const apiBase = useNuxtApp().$apiBase;
    return await $fetch(`${apiBase}/register`, {
      method: "POST",
      body: {
        username,
        password,
        favoriteFish,
      },
    });
  },

  async updateFishingRodLevel(userId: string, fishingRodLevel: number) {
    const apiBase = useNuxtApp().$apiBase;
    return await $fetch(`${apiBase}/update-rod/${userId}`, {
      method: "POST",
      body: {
        fishingRodLevel,
      },
    });
  },

  async getUserData(userId: string) {
    const apiBase = useNuxtApp().$apiBase;
    return await $fetch(`${apiBase}/user-data/${userId}`, {
      method: "GET",
    });
  },

  async login(username: string, password: string, favoriteFish: string) {
    const apiBase = useNuxtApp().$apiBase;
    return await $fetch(`${apiBase}/login`, {
      method: "POST",
      body: {
        username,
        password,
        favoriteFish,
      },
    });
  },

  async getRanking(userId?: string) {
    const apiBase = useNuxtApp().$apiBase;
    const endpoint = userId
      ? `${apiBase}/rank?userId=${userId}`
      : `${apiBase}/rank`;
    return await $fetch(endpoint, {
      method: "GET",
    });
  },
};
