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

    const caughtFish = ref([
      {
        name: "イワシ",
        count: 0,
      },
      {
        name: "タイ",
        count: 0,
      },
      {
        name: "ヒラメ",
        count: 0,
      },
      {
        name: "サンマ",
        count: 0,
      },
      {
        name: "ブリ",
        count: 0,
      },
      {
        name: "イカ",
        count: 0,
      },
      {
        name: "タコ",
        count: 0,
      },
      {
        name: "ウナギ",
        count: 0,
      },
      {
        name: "サケ",
        count: 0,
      },
      {
        name: "アジ",
        count: 0,
      },
      {
        name: "クラゲ",
        count: 0,
      },
      {
        name: "トビウオ",
        count: 0,
      },
      {
        name: "クリオネ",
        count: 0,
      },
      {
        name: "スズキ",
        count: 0,
      },
      {
        name: "フグ",
        count: 0,
      },
      {
        name: "カツオ",
        count: 0,
      },
      {
        name: "ウミガメ",
        count: 0,
      },
      {
        name: "ダイオウグソクムシ",
        count: 0,
      },
      {
        name: "メンダコ",
        count: 0,
      },
      {
        name: "マグロ",
        count: 0,
      },
      {
        name: "キンメダイ",
        count: 0,
      },
      {
        name: "サメ",
        count: 0,
      },
      {
        name: "ウツボ",
        count: 0,
      },
      {
        name: "海草",
        count: 0,
      },
      {
        name: "伊勢海老",
        count: 0,
      },
      {
        name: "マンボウ",
        count: 0,
      },
      {
        name: "カジキ",
        count: 0,
      },
      {
        name: "ザトウクジラ",
        count: 0,
      },
      {
        name: "リュウグウノツカイ",
        count: 0,
      },
      {
        name: "ダンクルオステウス",
        count: 0,
      },
    ]);

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

    return {
      username,
      userId,
      sumScore,
      fishingRodLevel,
      caughtFish,
      highestScoringFish,
      register,
    };
  },
  {
    persist: {
      storage: piniaPluginPersistedstate.localStorage(),
    },
  }
);
