const {
  public: { apiBase },
} = useRuntimeConfig();

export default {
  async dealPoler(userId: string, bet: number) {
    const response = await $fetch(`${apiBase}/poker/deal/${userId}`, {
      method: "POST",
      body: {
        bet,
      },
    });
    return response;
  },

  async changeAndCalculateHand(userId: string, swapIndices: number[]) {
    const response = await $fetch(
      `${apiBase}/poker/change-calculate/${userId}`,
      {
        method: "POST",
        body: {
          swapIndices,
        },
      }
    );
    return response;
  },

  async dealDoubleUpCard(userId: string, isDoubleUp: boolean) {
    const response = await $fetch(`${apiBase}/double-up/deal/${userId}`, {
      method: "POST",
      body: {
        isDoubleUp,
      },
    });
    return response;
  },

  async judgeDoubleUp(userId: string, guess: "higher" | "lower") {
    const response = await $fetch(`${apiBase}/double-up/judge/${userId}`, {
      method: "POST",
      body: {
        guess,
      },
    });
    return response;
  },
};
