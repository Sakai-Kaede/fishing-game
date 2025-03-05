import { defineStore } from "pinia";
import type { User } from "@/types/type";
import { fishList } from "@/constants/FishData";
import { RepositoryFactory } from "@/repositories/index";
import { usePokerStore } from "@/store/poker";

export const useUserStore = defineStore(
  "user",
  () => {
    const username = ref("");
    const userId = ref("");
    const sumScore = ref<number>(0);
    const fishingRodLevel = ref<number>(1);
    const caughtFish = ref<Array<any> | null>(null);
    const achievements = ref<Array<any> | null>(null);
    const highScoreFish = ref<{ name: string; score: number } | null>(null);
    const pokerStore = usePokerStore();

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

        // ユーザー情報を初期化
        username.value = user.username;
        userId.value = user.userId;
        sumScore.value = 0;
        fishingRodLevel.value = 1;
        highScoreFish.value = { name: "デフォルトの魚", score: 0 };
        caughtFish.value = [];
        achievements.value = [];

        pokerStore.init();

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
        highScoreFish.value = getHighestScoringFish();

        pokerStore.init();

        return { success: true, message: "ログインに成功しました。" };
      } catch (error: unknown) {
        let errorMessage = "ログインに失敗しました。";
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        return { success: false, message: errorMessage };
      }
    }

    // 釣竿レベルの更新
    const updateFishingRodLevel = async (inputFishingRodLevel: number) => {
      try {
        if (!userId.value) {
          throw new Error("ユーザーIDが見つかりません。ログインしてください。");
        }
        const userRepository = RepositoryFactory.get("user");
        await userRepository.updateFishingRodLevel(
          userId.value,
          inputFishingRodLevel
        );
        fishingRodLevel.value = inputFishingRodLevel;
      } catch (error: unknown) {
        throw error;
      }
    };

    // ユーザー情報の取得
    const getUserData = async () => {
      if (!userId.value) {
        return { success: false, message: "ユーザーIDが設定されていません。" };
      }
      try {
        const userRepository = RepositoryFactory.get("user");
        const user = (await userRepository.getUserData(userId.value)) as User;

        username.value = user.username;
        sumScore.value = user.sumScore;
        caughtFish.value = user.caughtFish;
        fishingRodLevel.value = user.fishingRodLevel;
        highScoreFish.value = getHighestScoringFish();

        return { success: true, message: "ユーザー情報を取得しました。" };
      } catch (error: unknown) {
        let errorMessage = "ユーザー情報の取得に失敗しました。";
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        return { success: false, message: errorMessage };
      }
    };

    // 最もスコアが高い魚を更新
    const updateHighScoreFish = (fish: { name: string; score: number }) => {
      if (!highScoreFish.value || fish.score > highScoreFish.value.score) {
        highScoreFish.value = fish;
      }
    };

    // 最もスコアが高い魚を求める
    const getHighestScoringFish = () => {
      if (!caughtFish.value || caughtFish.value.length === 0) return null;

      // caughtFishの中で最もスコアが高い魚を取得
      const highestScoringFish = caughtFish.value.reduce(
        (maxFish, currentFish) => {
          // fishListからcurrentFish.nameのスコアを取得
          const fishData = fishList.find(
            (fish) => fish.name === currentFish.name
          );
          if (fishData && fishData.score > (maxFish?.score || 0)) {
            return fishData; // スコアが高い魚を選ぶ
          }
          return maxFish;
        },
        null as { name: string; score: number } | null
      );

      return highestScoringFish
        ? { name: highestScoringFish.name, score: highestScoringFish.score }
        : null;
    };

    // 捕まえた魚の名前を抽出する関数
    const getCaughtFishNames = () => {
      if (!caughtFish.value || caughtFish.value.length === 0) return [];

      // 捕まえた魚の名前だけを抽出
      return caughtFish.value.map((fish) => fish.name);
    };

    return {
      username,
      userId,
      sumScore,
      fishingRodLevel,
      caughtFish,
      achievements,
      highScoreFish,
      register,
      login,
      updateFishingRodLevel,
      getUserData,
      updateHighScoreFish,
      getCaughtFishNames,
    };
  },
  {
    persist: {
      storage: piniaPluginPersistedstate.localStorage(),
    },
  }
);
