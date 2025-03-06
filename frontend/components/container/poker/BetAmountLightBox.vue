<template>
  <div v-if="props.isOpen" class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <p class="modal-text">ベットする金額を入力してください</p>
      <AtomsTextInput
        id="betAmount"
        name="betAmount"
        v-model="betAmountString"
        placeholder="金額を入力"
        :required="true"
        :errorMessage="betAmountError"
        size="large"
        class="modal-text-input"
      />
      <div class="modal-buttons">
        <AtomsButton @click="close" size="large" variant="secondary_poker"
          >キャンセル</AtomsButton
        >
        <AtomsButton @click="confirmBet" size="large" variant="primary_poker"
          >決定</AtomsButton
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import "@/assets/scss/main.scss";
import { usePokerStore } from "@/store/poker";
import { useUserStore } from "@/store/user";
const pokerStore = usePokerStore();
const userStore = useUserStore();
const props = defineProps({
  isOpen: Boolean,
});

const emit = defineEmits(["confirm", "close"]);

const betAmountString = ref("");

const betAmount = computed({
  get: () => Number(betAmountString.value),
  set: (value) => {
    betAmountString.value = String(value);
  },
});
const betAmountError = ref("");

const close = () => {
  emit("close");
};

const confirmBet = () => {
  pokerStore.init();
  if (isNaN(Number(betAmount.value)) || Number(betAmount.value) <= 0) {
    betAmountError.value = "有効な金額を入力してください。";
  } else if (Number(betAmount.value) > 10000) {
    betAmountError.value = "ベットできる最高額は10,000までです。";
  } else if (Number(betAmount.value) > userStore.sumScore) {
    betAmountError.value = "所持金を超えています";
  } else {
    betAmountError.value = "";
    emit("confirm", betAmount.value);
  }
};
</script>

<style scoped lang="scss">
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100;

  .modal-content {
    background: white;
    padding: 6rem;
    border-radius: 8px;
    text-align: center;
    width: 50rem;
  }

  .modal-text-input {
    padding-bottom: 3rem;
    display: inline-block;
  }

  .modal-text {
    margin-bottom: 16px;
    font-size: 3rem;
  }

  .modal-buttons {
    display: flex;
    gap: 5rem;
    justify-content: center;
  }
}
</style>
