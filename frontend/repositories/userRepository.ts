const {
  public: { apiBase },
} = useRuntimeConfig();

export default {
  async registerUser(username: string, password: string, favoriteFish: string) {
    const response = await $fetch(`${apiBase}/register`, {
      method: "POST",
      body: {
        username,
        password,
        favoriteFish,
      },
    });
    return response;
  },

  async updateFishingRodLevel(userId: string, fishingRodLevel: number) {
    const response = await $fetch(`${apiBase}/update-rod/${userId}`, {
      method: "POST",
      body: {
        fishingRodLevel,
      },
    });
    return response;
  },

  async getUserData(userId: string) {
    const response = await $fetch(`${apiBase}/user-data/${userId}`, {
      method: "GET",
    });
    return response;
  },

  async login(username: string, password: string, favoriteFish: string) {
    const response = await $fetch(`${apiBase}/login`, {
      method: "POST",
      body: {
        username,
        password,
        favoriteFish,
      },
    });
    return response;
  },
};
