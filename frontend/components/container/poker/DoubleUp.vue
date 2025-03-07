<template>
  <div v-show="pokerStore.isDoubleUp" class="double-up-container">
    <div class="hand">
      <div
        v-for="(card, index) in pokerStore.doubleUpHand"
        :key="card._id"
        :style="{ marginLeft: index === 0 ? '0' : '-5rem' }"
      >
        <img
          class="card"
          :src="getCardImage(card)"
          :alt="`${card.suit} ${card.rank}`"
        />
      </div>
    </div>

    <div v-show="pokerStore.isShowDoubleUpUI" class="double-up-ui">
      <span class="double-up-text">次のカードの数字は？</span>
      <AtomsButton
        @click="handleJudgeDoubleUp('higher')"
        class="double-up-button"
        >大きい</AtomsButton
      >
      <AtomsButton
        @click="handleJudgeDoubleUp('lower')"
        class="double-up-button"
        >小さい</AtomsButton
      >
    </div>

    <p v-show="doubleUpResult" class="result">{{ doubleUpResult }}</p>
  </div>
</template>

<script setup lang="ts">
import "@/assets/scss/main.scss";
import { usePokerStore } from "@/store/poker";
import * as CardImages from "@/constants/CardImages";

type CardImageKeys = keyof typeof CardImages.CardImages;
const pokerStore = usePokerStore();
const doubleUpResult = ref<string | null>(null);

// カード画像を取得する関数
const getCardImage = (card: { suit: string; rank: string }): string => {
  const key = `${card.suit}_${card.rank}` as CardImageKeys;
  return CardImages.CardImages[key] || "";
};

const handleJudgeDoubleUp = async (guess: "higher" | "lower") => {
  await pokerStore.judgeDoubleUp(guess);
};
</script>

<style scoped lang="scss">
.hand {
  display: flex;
  justify-content: center;
  align-items: center;
}
.double-up-ui {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.double-up-text {
  color: $gray-20;
  font-size: 2rem;
}

.card {
  margin-bottom: 3rem;
  width: 12rem;
  height: auto;
  box-shadow: 3px 3px 15px rgba(0, 0, 0, 0.6);
  transition: transform 0.2s ease-in-out;
  &:hover {
    transform: scale(1.1);
  }
}

.double-up-button {
  margin-left: 1rem;
  background: radial-gradient(circle, #d40000, #880000);
  border: 3px solid gold;
  color: white;
  padding: 15px;
  border-radius: 50%;
  font-size: 20px;
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.6);
  &:hover {
    box-shadow: 0 0 20px rgba(255, 215, 0, 1);
  }
}
</style>
