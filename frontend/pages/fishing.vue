<template>
  <div :style="backgroundStyle" class="no-scroll">
    <div class="wrap">
      <p class="depth-text">現在の深さ： {{ depth * 10 }}m</p>
    </div>

    <FishingProgressBar
      v-if="isProgressVisible"
      :progress="progress"
      :isVisible="isProgressVisible"
      class="progress-bar"
    />
    <FishingAdjustDepth
      v-model="depth"
      class="adjust-depth"
    ></FishingAdjustDepth>
    <div class="container">
      <div class="hook-container">
        <FishingFish
          class="fish"
          :depth="depth"
          @catchFishComplete="handleCatchComplete"
          @updateProgress="handleUpdateProgress"
          @fishSpawned="handleFishSpawned"
        ></FishingFish>
        <FishingHook :isFishCaught="isFishCaught"></FishingHook>
      </div>
    </div>
    <FishingShadow
      :depth="currentDepth"
      :shadowSwitch="shadowSwitch"
      :shadowFlag="shadowFlag"
    ></FishingShadow>
  </div>
</template>

<script setup lang="ts">
const depth = ref<number>(0);
const isFishCaught = ref<boolean>(false);
const progress = ref<number>(0);
const isProgressVisible = ref<boolean>(false);
const currentDepth = ref<number>(0);
const shadowSwitch = ref<boolean>(false);
const shadowFlag = ref<boolean>(false);

// 魚を釣った際の処理
const handleCatchComplete = () => {
  console.log("Fish catch completed!");
  isFishCaught.value = true;
  isProgressVisible.value = false;
  setTimeout(() => {
    isFishCaught.value = false;
  }, 6000);
};

// 魚が新しくスポーン（出現）したときの処理
const handleFishSpawned = () => {
  progress.value = 0;
  isProgressVisible.value = true;
};

// 進行度更新処理
const handleUpdateProgress = (newProgress: number) => {
  progress.value = newProgress;
};

// 背景色を動的に変更
const backgroundStyle = computed(() => {
  const lightness = Math.max(15, Math.min(65 - depth.value * 0.5, 65));
  return {
    background: `linear-gradient(to bottom, hsl(216, 90%, ${lightness}%) 20%, hsl(216, 100%, ${
      lightness - 30
    }%) 100%)`,
    transition: "background 0.5s ease",
  };
});

onMounted(() => {
  setTimeout(() => {
    setInterval(() => {
      currentDepth.value = depth.value;
      shadowSwitch.value = !shadowSwitch.value;
      shadowFlag.value = true;
    }, 12000);
  }, 5000);
});
</script>

<style scoped lang="scss">
.no-scroll {
  overflow: hidden;
  height: 100vh;
  position: relative;
}

.wrap {
  position: absolute;
  top: 20rem;
  right: 2rem;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  z-index: 5;

  .depth-text {
    margin-top: 12px;
    font-size: 3rem;
    font-weight: bold;
    color: $gray-10;
    text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.6);
  }
}

// 泡のスタイル
.bubble {
  position: absolute;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  bottom: -20px;
  animation-name: bubbles;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
}

.progress-bar {
  position: absolute;
  top: 30rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
}

// 釣りのUIの配置
.container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

// フックと魚の配置
.hook-container {
  position: relative;
}

.hook-container > .fish {
  position: absolute;
  top: calc(50% - 3rem);
  left: 50%;
  transform: translate(-50%, -50%);
  margin-top: -100%;
  z-index: 3;
}

.adjust-depth {
  position: absolute;
  bottom: 7rem;
  left: 50%;
  transform: translateX(-50%);
}
</style>
