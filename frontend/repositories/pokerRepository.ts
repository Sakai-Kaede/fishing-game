export default {
  async dealPoler(userId: string, bet: number) {
    const apiBase = useNuxtApp().$apiBase;
    return await $fetch(`${apiBase}/poker/deal/${userId}`, {
      method: "POST",
      body: {
        bet,
      },
    });
  },

  async changeAndCalculateHand(userId: string, swapIndices: number[]) {
    const apiBase = useNuxtApp().$apiBase;
    return await $fetch(`${apiBase}/poker/change-calculate/${userId}`, {
      method: "POST",
      body: {
        swapIndices,
      },
    });
  },

  async dealDoubleUpCard(userId: string, isDoubleUp: boolean) {
    const apiBase = useNuxtApp().$apiBase;
    return await $fetch(`${apiBase}/double-up/deal/${userId}`, {
      method: "POST",
      body: {
        isDoubleUp,
      },
    });
  },

  async judgeDoubleUp(userId: string, guess: "higher" | "lower") {
    const apiBase = useNuxtApp().$apiBase;
    return await $fetch(`${apiBase}/double-up/judge/${userId}`, {
      method: "POST",
      body: {
        guess,
      },
    });
  },
};
