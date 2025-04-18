import { defineStore } from "pinia";
import { RepositoryFactory } from "@/repositories/index";
import { useUserStore } from "@/store/user";
import type {
  PokerResponse,
  PokerResultResponse,
  DoubleUpFalseResponse,
  DoubleUpTrueResponse,
  DoubleUpResultResponse,
  CardWithId,
  Card,
} from "@/types/type";

export const usePokerStore = defineStore(
  "poker",
  () => {
    const userStore = useUserStore();

    const hand = ref<Card[]>([]);
    const swapIndices = ref<number[]>([]);
    const bet = ref(0);
    const score = ref(0);
    const doubleUpHand = ref<CardWithId[]>([]);
    const guessCorrect = ref();
    const isShowDoubleUpUI = ref(false);
    const isNotStartPoker = ref(true);
    const isDoubleUp = ref(false);
    const isChange = ref(true);
    const isDoubleUpRequested = ref(false);
    const doubleUpSuccessCount = ref(0);
    const message = ref("ベッドする金額を決めて下さい");

    const init = () => {
      hand.value = [];
      swapIndices.value = [];
      bet.value = 0;
      score.value = 0;
      doubleUpHand.value = [];
      guessCorrect.value = null;
      isDoubleUp.value = false;
      isDoubleUpRequested.value = false;
      isShowDoubleUpUI.value = false;
      isChange.value = true;
      doubleUpSuccessCount.value = 0;
      message.value = "ベッドする金額を決めて下さい";
    };

    // 進行不可能でないか、条件をチェックする
    watchEffect(() => {
      if (
        !isChange.value &&
        !isDoubleUpRequested.value &&
        !isNotStartPoker.value &&
        !isDoubleUp.value
      ) {
        isNotStartPoker.value = true;
      }
    });

    const pokerDeal = async () => {
      try {
        const pokerRepository = RepositoryFactory.get("poker");
        const response = (await pokerRepository.dealPoler(
          userStore.userId,
          bet.value
        )) as PokerResponse;
        init();
        hand.value = response.POKER_DEAL.hand;
        userStore.sumScore = response.POKER_DEAL.updateSumScore;
        isNotStartPoker.value = false;
        message.value = "交換するカードを決めて下さい";
        return { success: true, message: "手札を取得しました。" };
      } catch (error: unknown) {
        throw error;
      }
    };

    const toggleCardSelection = (index: number) => {
      if (swapIndices.value.includes(index)) {
        swapIndices.value = swapIndices.value.filter((i) => i !== index);
      } else {
        swapIndices.value.push(index);
      }
    };

    const changeAndCalculateHand = async (changeCard: number[]) => {
      try {
        const pokerRepository = RepositoryFactory.get("poker");
        const response = (await pokerRepository.changeAndCalculateHand(
          userStore.userId,
          changeCard
        )) as PokerResultResponse;
        hand.value = response.POKER_RESULT.hand;
        score.value = response.POKER_RESULT.score;
        if (score.value !== 0) {
          message.value = "役ができました！\nダブルアップに挑戦しますか？";
          return { success: true, message: "役ができました！" };
        } else {
          isNotStartPoker.value = true;
          isChange.value = false;
          message.value = "役ができませんでした";
          return { success: true, message: "役ができませんでした..." };
        }
      } catch (error: unknown) {
        throw error;
      }
    };

    const dealDoubleUpCard = async (isDoubleUp: boolean) => {
      if (isDoubleUp) {
        try {
          const pokerRepository = RepositoryFactory.get("poker");
          const response = (await pokerRepository.dealDoubleUpCard(
            userStore.userId,
            true
          )) as DoubleUpTrueResponse;
          isShowDoubleUpUI.value = true;
          doubleUpHand.value = [];
          doubleUpHand.value.push(response.DOUBLEUP_DEAL.card);
          message.value = "予想しましょう";
          return {
            success: true,
            message: "ダブルアップのカードを配りました。",
          };
        } catch (error: unknown) {
          throw error;
        }
      } else {
        try {
          const pokerRepository = RepositoryFactory.get("poker");
          const response = (await pokerRepository.dealDoubleUpCard(
            userStore.userId,
            false
          )) as DoubleUpFalseResponse;

          userStore.sumScore = response.DOUBLEUP_DEAL.updateSumScore;
          isShowDoubleUpUI.value = false;
          isNotStartPoker.value = true;
          message.value = `おめでとうございます!${score.value}円獲得しました`;
          await userStore.getUserData();
          return { success: true, message: "得点を加算しました。" };
        } catch (error: unknown) {
          throw error;
        }
      }
    };

    const judgeDoubleUp = async (guess: "higher" | "lower") => {
      try {
        const pokerRepository = RepositoryFactory.get("poker");
        const response = (await pokerRepository.judgeDoubleUp(
          userStore.userId,
          guess
        )) as DoubleUpResultResponse;
        guessCorrect.value = response.DOUBLEUP_RESULT.guessCorrect;
        doubleUpHand.value.push(response.DOUBLEUP_RESULT.drawnCard);
        score.value = response.DOUBLEUP_RESULT.newScore;
        const lastDrawnCard = doubleUpHand.value[doubleUpHand.value.length - 2];
        if (guessCorrect.value && doubleUpSuccessCount.value + 1 === 10) {
          message.value = `おめでとうございます!\n10回ダブルアップに成功して ${score.value}円獲得しました`;
          isNotStartPoker.value = true;
          isShowDoubleUpUI.value = false;
          userStore.sumScore += response.DOUBLEUP_RESULT.newScore;
          await userStore.getUserData();
        } else if (!guessCorrect.value) {
          message.value = `ダブルアップに失敗しました`;
          isNotStartPoker.value = true;
          isShowDoubleUpUI.value = false;
        } else if (
          response.DOUBLEUP_RESULT.drawnCard.rank !== lastDrawnCard.rank
        ) {
          message.value = `ダブルアップに${
            doubleUpSuccessCount.value + 1
          }回成功しました`;
          doubleUpSuccessCount.value++;
        }

        return {
          success: true,
          message: "ダブルアップの結果を得ました。",
        };
      } catch (error: unknown) {
        throw error;
      }
    };

    return {
      hand,
      swapIndices,
      bet,
      pokerDeal,
      score,
      doubleUpHand,
      message,
      isNotStartPoker,
      isShowDoubleUpUI,
      isDoubleUp,
      isChange,
      init,
      toggleCardSelection,
      changeAndCalculateHand,
      dealDoubleUpCard,
      judgeDoubleUp,
      isDoubleUpRequested,
      doubleUpSuccessCount,
    };
  },
  {
    persist: {
      storage: piniaPluginPersistedstate.localStorage(),
    },
  }
);
