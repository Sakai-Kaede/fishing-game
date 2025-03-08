<template>
  <div v-if="fish && fish.fish">
    <div class="fish-container">
      <PhosphorIconHandPointing
        v-if="showClickHint"
        class="click-hint"
        size="7rem"
      />
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
import type { FishDetails } from "@/types/type";
import { FishImages } from "@/constants/FishImages";
import type { FishImageKeys } from "@/constants/FishImages";
import { FishImageWidths } from "@/constants/FishImageWidths";
import type { FishImageWidthKeys } from "@/constants/FishImageWidths";

const props = defineProps({
  depth: Number,
});
const emit = defineEmits([
  "catchFishComplete",
  "fishEscape",
  "updateProgress",
  "fishSpawned",
]);

const userStore = useUserStore();

const fish = ref<FishDetails | null>(null);
const fishRepository = RepositoryFactory.get("fish");

const imagePath = ref("");
const altText = ref("魚の画像");
const imageWidth = ref(0);

// ボタン表示フラグとアニメーション制御フラグ
const isButtonVisible = ref(true);
const isRotatingAndMovingUp = ref(false);
const isMovingRight = ref(false);
const isFadeIn = ref(false);
const disabled = ref(false);
const showClickHint = ref(false);

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
    if (clickCount.value > 50) {
      disabled.value = true;
      emit("fishEscape");
      isFadeIn.value = false;
      isMovingRight.value = true;
    } else if (clickCount.value >= fish.value.fish.requiredInteractions) {
      disabled.value = true;
      emit("catchFishComplete");
      isFadeIn.value = false;
      isRotatingAndMovingUp.value = true;
      await fishRepository.catchFish(userStore.userId, fish.value.randomId);
      await userStore.getUserData();
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
    }

    if (FishImageWidths[fishName]) {
      imageWidth.value = FishImageWidths[fishName];
    } else {
      imageWidth.value = 50;
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
watch(fish, (newFish) => {
  if (newFish && newFish.fish) {
    showClickHint.value = false;

    clickHintTimer = setTimeout(() => {
      if (clickCount.value === 0) {
        showClickHint.value = true;
      }
    }, 10000);
  }
});
watch(clickCount, (newCount) => {
  if (newCount > 0) {
    showClickHint.value = false; // クリックされたら非表示
  }
});
let intervalId: NodeJS.Timeout | null = null;
let moveRightTimer: NodeJS.Timeout | null = null; // 右移動のタイマー
let gameLoopTimer: NodeJS.Timeout | null = null; // fishingGameLoopのタイマー
let clickHintTimer: NodeJS.Timeout | null = null;

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
      emit("fishEscape");
      isFadeIn.value = false;
      isMovingRight.value = true;
      showClickHint.value = false;
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
  if (clickHintTimer) {
    clearTimeout(clickHintTimer);
    clickHintTimer = null;
  }

  stopGameLoop = true;
});
</script>

<style scoped lang="scss">
.fish-container {
  position: relative;
}

.click-hint {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: clickPulse 1.5s infinite alternate;
  pointer-events: none;
  z-index: 10;
}
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
