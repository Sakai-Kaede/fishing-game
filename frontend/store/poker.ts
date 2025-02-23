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
} from "@/types/type";

export const usePokerStore = defineStore(
  "poker",
  () => {
    const userStore = useUserStore();

    const hand = ref();
    const bet = ref(0);
    const score = ref(0);
    const doubleUpHand = ref<CardWithId[]>([]);
    const guessCorrect = ref();

    const pokerDeal = async (bet: number) => {
      try {
        const pokerRepository = RepositoryFactory.get("poker");
        const response = (await pokerRepository.dealPoler(
          userStore.userId,
          bet
        )) as PokerResponse;
        hand.value = response.POKER_DEAL.hand;
        userStore.sumScore = response.POKER_DEAL.updateSumScore;
        return { success: true, message: "手札を取得しました。" };
      } catch (error: unknown) {
        throw error;
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
        return { success: true, message: "手札を計算しました。" };
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
            isDoubleUp
          )) as DoubleUpTrueResponse;
          doubleUpHand.value.push(response.DOUBLEUP_DEAL.card);

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
            isDoubleUp
          )) as DoubleUpFalseResponse;

          userStore.sumScore = response.DOUBLEUP_DEAL.updateSumScore;
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
      bet,
      pokerDeal,
      changeAndCalculateHand,
      dealDoubleUpCard,
      judgeDoubleUp,
    };
  },
  {
    persist: {
      storage: piniaPluginPersistedstate.localStorage(),
    },
  }
);
