<template>
  <div class="poker-container">
    <PokerHands v-show="!pokerStore.isDoubleUp" />
    <PokerDoubleUp v-show="pokerStore.isDoubleUp" />

    <div class="bet-section">
      <AtomsButton
        v-show="pokerStore.isNotStartPoker"
        @click="openBetAmountModal"
        variant="primary_poker"
        size="large"
      >
        ベット
      </AtomsButton>

      <PokerBetAmountLightBox
        v-model:isOpen="isModalOpen"
        @confirm="handleBetConfirmation"
        @close="closeModal"
      />
    </div>

    <div class="double-up-section" v-show="pokerStore.isDoubleUpRequested">
      <span class="double-up-text">ダブルアップに挑戦しますか？</span>
      <AtomsButton
        @click="handleDecline"
        variant="primary_poker"
        class="decline-button"
        size="large"
        >いいえ</AtomsButton
      >
      <AtomsButton
        @click="handleAccept"
        variant="primary_poker"
        class="accept-button"
        size="large"
        >はい</AtomsButton
      >
    </div>

    <AtomsButton
      v-show="pokerStore.isShowDoubleUpUI"
      class="double-up-button"
      @click="finishDoubleUp"
    >
      ダブルアップを終了する
    </AtomsButton>

    <span class="score">スコア： {{ pokerStore.score }}</span>

    <!-- 役の一覧を表示するボタン -->
    <div class="role-toggle" v-show="!pokerStore.isShowDoubleUpUI">
      <AtomsButton
        @click="showRoles = !showRoles"
        variant="primary_poker"
        size="large"
      >
        {{ showRoles ? "役を隠す" : "役を表示" }}
      </AtomsButton>
    </div>

    <PokerRole v-show="showRoles" />
  </div>
</template>

<script setup lang="ts">
import { usePokerStore } from "@/store/poker";
// モーダルの開閉状態を管理する変数
const isModalOpen = ref(false);
const pokerStore = usePokerStore();

const showRoles = ref(false);

// モーダルを開く
const openBetAmountModal = () => {
  isModalOpen.value = true;
};

// モーダルが確定された時の処理
const handleBetConfirmation = async (betAmount: number) => {
  pokerStore.bet = betAmount;
  await pokerStore.pokerDeal();
  isModalOpen.value = false;
};

// モーダルが閉じられた時の処理
const closeModal = () => {
  console.log("モーダルが閉じられました");
  isModalOpen.value = false; // モーダルを閉じる
};

const handleAccept = async () => {
  pokerStore.isDoubleUp = true;
  pokerStore.isDoubleUpRequested = false;
  await pokerStore.dealDoubleUpCard(true);
};
const handleDecline = () => {
  pokerStore.dealDoubleUpCard(false);
  pokerStore.isDoubleUpRequested = false;
};
const finishDoubleUp = async () => {
  await pokerStore.dealDoubleUpCard(false);
  pokerStore.isNotStartPoker = true;
  pokerStore.isShowDoubleUpUI = false;
};
</script>

<style scoped lang="scss">
.poker-container {
  background: radial-gradient(circle, #145214, #0a290a);

  box-shadow: 0 0 20px rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

.role-toggle {
  text-align: center;
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.double-up-text {
  color: $gray-20;
  font-size: 2rem;
}

.decline-button {
  margin: 0 1rem;
}

.double-up-button {
  margin-top: 2rem;
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

.score {
  font-size: 28px;
  font-weight: bold;
  color: gold;
  text-shadow: 2px 2px 5px rgba(255, 215, 0, 0.8);
  margin-top: 15px;
}
</style>
