import { defineStore } from "pinia";
import type { User } from "@/types/type";

import { RepositoryFactory } from "@/repositories/index";

export const useUserStore = defineStore(
  "user",
  () => {
    const username = ref("");
    const userId = ref("");
    const sumScore = ref(0);
    const fishingRodLevel = ref(1);
    const highestScoringFish = ref<string | null>(null);
    const caughtFish = ref([{}]);
    const achievements = ref([{}]);

    // ユーザー登録
    async function register(
      inputUsername: string,
      inputPassword: string,
      inputFavoriteFish: string
    ) {
      try {
        const userRepository = RepositoryFactory.get("user");
        const user = (await userRepository.registerUser(
          inputUsername,
          inputPassword,
          inputFavoriteFish
        )) as User;

        // ユーザー情報をストアに保存
        username.value = user.username;
        userId.value = user.userId;
        sumScore.value = user.sumScore;
        fishingRodLevel.value = user.fishingRodLevel;

        return { success: true, message: "ユーザー登録に成功しました。" };
      } catch (error: unknown) {
        if (error instanceof Error && (error as any).response?.status === 409) {
          return { success: false, message: "その名前は既に使用されています" };
        } else {
          return { success: false, message: "ユーザー登録に失敗しました" };
        }
      }
    }

    // ログイン
    async function login(
      inputUsername: string,
      inputPassword: string,
      inputFavoriteFish: string
    ) {
      try {
        const userRepository = RepositoryFactory.get("user");
        const user = (await userRepository.login(
          inputUsername,
          inputPassword,
          inputFavoriteFish
        )) as User;

        // ユーザーデータを更新
        username.value = user.username;
        userId.value = user.userId;
        sumScore.value = user.sumScore;
        fishingRodLevel.value = user.fishingRodLevel;
        caughtFish.value = [...user.caughtFish];
        achievements.value = [...user.achievements];

        return { success: true, message: "ログインに成功しました。" };
      } catch (error: unknown) {
        let errorMessage = "ログインに失敗しました。";
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        return { success: false, message: errorMessage };
      }
    }

    return {
      username,
      userId,
      sumScore,
      fishingRodLevel,
      caughtFish,
      achievements,
      highestScoringFish,
      register,
      login,
    };
  },
  {
    persist: {
      storage: piniaPluginPersistedstate.localStorage(),
    },
  }
);
