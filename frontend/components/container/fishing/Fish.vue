<template>
  <div v-if="fish && fish.fish">
    <div>
      <AtomsAnimatedImageButton
        v-if="isButtonVisible"
        :class="{
          rotatingAndMovingUp: isRotatingAndMovingUp,
          movingRight: isMovingRight,
          fadeIn: isFadeIn,
        }"
        :imageUrl="imagePath"
        :altText="altText"
        :width="imageWidth"
        :disabled="disabled"
        @button-clicked="handleCaughtFish"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import "@/assets/scss/main.scss";
import { RepositoryFactory } from "@/repositories";
import { useUserStore } from "@/store/user";
import { FishImages } from "@/constants/FishImages";
import type { FishImageKeys } from "@/constants/FishImages";
import { FishImageWidths } from "@/constants/FishImageWidths";
import type { FishImageWidthKeys } from "@/constants/FishImageWidths";

const props = defineProps({
  depth: Number,
});
const emit = defineEmits([
  "catchFishComplete",
  "updateProgress",
  "fishSpawned",
]);

const userStore = useUserStore();

interface Fish {
  name: string;
  score: number;
  requiredInteractions: number;
}

interface FishDetails {
  fish: Fish;
  userId: string;
  randomId: string;
  isInvalid: boolean;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const fish = ref<FishDetails | null>(null);
const fishRepository = RepositoryFactory.get("fish");

const imagePath = ref("");
const altText = ref("魚の画像");
const imageWidth = ref(0);

// ボタン表示フラグとアニメーション制御フラグ
const isButtonVisible = ref(true);
const isProgressContainerVisible = ref(false);
const isRotatingAndMovingUp = ref(false);
const isMovingRight = ref(false);
const isFadeIn = ref(false);
const disabled = ref(false);

// ボタン押下回数を管理
const clickCount = ref(0);

// 進行度（progress）を計算
const progress = computed(() => {
  if (fish.value && fish.value.fish.requiredInteractions > 0) {
    return Math.min(
      (clickCount.value / fish.value.fish.requiredInteractions) * 100,
      100
    );
  }
  return 0;
});

const userId = userStore.userId;

const preFish = async () => {
  isProgressContainerVisible.value = true;
  if (props.depth === undefined) {
    console.error("Depth is undefined.");
    return;
  }
  const response = await fishRepository.fetchPreFish(userId, props.depth);
  fish.value = response;
};

const handleCaughtFish = async () => {
  if (fish.value) {
    clickCount.value++;
    if (clickCount.value >= 50) {
      disabled.value = true;
      isProgressContainerVisible.value = false;
      isFadeIn.value = false;
      isMovingRight.value = true;
    } else if (clickCount.value >= fish.value.fish.requiredInteractions) {
      disabled.value = true;
      await fishRepository.catchFish(userStore.userId, fish.value.randomId);
      emit("catchFishComplete");
      isFadeIn.value = false;
      isRotatingAndMovingUp.value = true;
      setTimeout(() => {
        isRotatingAndMovingUp.value = false;
        isButtonVisible.value = false;
        fish.value = null;
      }, 3000);
    }
  }
};

watch(fish, (newFish) => {
  if (newFish && newFish.fish) {
    const fishName = newFish.fish.name as FishImageKeys & FishImageWidthKeys;

    if (FishImages[fishName]) {
      imagePath.value = FishImages[fishName];
    } else {
      imagePath.value = "/images/default.png";
    }

    if (FishImageWidths[fishName]) {
      imageWidth.value = FishImageWidths[fishName];
    } else {
      imageWidth.value = 50; // デフォルトの幅
    }
  }
});
watch(progress, (newProgress) => {
  emit("updateProgress", newProgress);
});
watch(fish, (newFish) => {
  if (newFish && newFish.fish) {
    emit("fishSpawned");
  }
});
let intervalId: NodeJS.Timeout | null = null;
let moveRightTimer: NodeJS.Timeout | null = null; // 右移動のタイマー
let gameLoopTimer: NodeJS.Timeout | null = null; // fishingGameLoopのタイマー

// ゲームループを停止するフラグ
let stopGameLoop = false;

const initialization = () => {
  fish.value = null;
  isMovingRight.value = false;
  isFadeIn.value = false;
  disabled.value = false;
  clickCount.value = 0;
  isButtonVisible.value = true;
};

const fishingGameLoop = async () => {
  if (stopGameLoop) return; // ループが停止されている場合は処理を中断

  const minWaitTime = 25000;
  const maxWaitTime = 35000;
  const radomWaitTime = Math.floor(
    Math.random() * (maxWaitTime - minWaitTime + 1) + minWaitTime
  );

  initialization();
  isFadeIn.value = true;
  await preFish();

  // 20秒経過後、進行を右に進める
  moveRightTimer = setTimeout(() => {
    if (clickCount.value < (fish.value?.fish.requiredInteractions ?? 0)) {
      disabled.value = true;
      isProgressContainerVisible.value = false;
      isFadeIn.value = false;
      isMovingRight.value = true;
    }
  }, 20000);

  gameLoopTimer = setTimeout(fishingGameLoop, radomWaitTime);
};

setTimeout(() => {
  fishingGameLoop();
}, 20000);

onBeforeUnmount(() => {
  // タイマーをクリア
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
  if (moveRightTimer) {
    clearTimeout(moveRightTimer);
    moveRightTimer = null;
  }
  if (gameLoopTimer) {
    clearTimeout(gameLoopTimer);
    gameLoopTimer = null;
  }

  stopGameLoop = true;
});
</script>

<style scoped lang="scss">
.rotatingAndMovingUp {
  position: relative;
  animation: rotateAndMoveUp 3s ease-in-out forwards;
}

.movingRight {
  position: relative;
  animation: moveToRight 3s ease-in-out forwards;
}

.fadeIn {
  animation: fadeIn 2.5s ease-in-out forwards;
}
</style>
