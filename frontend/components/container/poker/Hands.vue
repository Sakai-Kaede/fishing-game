<template>
  <div
    v-show="pokerStore.hand.length === 5 && !pokerStore.isDoubleUp"
    class="poker-hands"
  >
    <div class="hand">
      <img
        v-for="(card, index) in pokerStore.hand"
        :key="index"
        :src="getCardImage(card)"
        :alt="`${card.suit} ${card.rank}`"
        class="card"
        :class="{
          selected:
            pokerStore.isChange && pokerStore.swapIndices.includes(index),
        }"
        @click="pokerStore.toggleCardSelection(index)"
      />
    </div>
    <div
      class="exchange-options"
      v-show="pokerStore.isChange && !pokerStore.isNotStartPoker"
    >
      <AtomsButton
        class="change-button"
        v-show="pokerStore.swapIndices.length === 0"
        @click="changeCards"
        variant="primary_poker"
      >
        カードを交換しない
      </AtomsButton>
      <AtomsButton
        class="change-button"
        v-show="pokerStore.swapIndices.length !== 0"
        @click="changeCards"
        variant="primary_poker"
      >
        カードを交換する
      </AtomsButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePokerStore } from "@/store/poker";
import * as CardImages from "@/constants/CardImages";

type CardImageKeys = keyof typeof CardImages.CardImages;
const pokerStore = usePokerStore();

const getCardImage = (card: { suit: string; rank: string }): string => {
  const key = `${card.suit}_${card.rank}` as CardImageKeys;
  return CardImages.CardImages[key] || "";
};

const changeCards = async () => {
  const result = await pokerStore.changeAndCalculateHand(
    pokerStore.swapIndices
  );
  if (result.message === "役ができました！") {
    pokerStore.isDoubleUpRequested = true;
  }
  pokerStore.swapIndices = [];
};
</script>

<style scoped>
.change-button {
  padding: 2rem;
  font-size: 2rem;
}
.hand {
  display: flex;
  gap: 15px;
  justify-content: center;
  align-items: center;
  padding: 10px;
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

.selected {
  border: 4px solid gold;
  box-shadow: 0 0 15px gold;
  transform: scale(1.1);
}

.exchange-options {
  display: flex;
  justify-content: center;
  gap: 10px;
}
</style>
