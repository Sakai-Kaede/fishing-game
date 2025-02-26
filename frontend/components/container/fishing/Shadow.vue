<template>
  <div
    v-if="fish && props.shadowFlag"
    :key="imagePath"
    class="fish-container fade-swim"
    :style="fishStyle"
  >
    <img
      :src="imagePath"
      :alt="altText"
      :width="imageWidth"
      :class="grayscaleClass"
      draggable="false"
    />
  </div>
</template>

<script setup lang="ts">
import "@/assets/scss/main.scss";
import { fishList } from "@/constants/FishData";
import { FishImages } from "@/constants/FishImages";
import {
  FishImageWidths,
  type FishImageWidthKeys,
} from "@/constants/FishImageWidths";

const props = defineProps<{
  depth: number;
  shadowSwitch: boolean;
  shadowFlag: boolean;
}>();
const fish = ref<(typeof fishList)[number] | null>(null);
const imagePath = ref("/images/default.png");
const altText = ref("魚の画像");
const imageWidth = ref(50);
const randomX = ref(0);
const randomY = ref(0);

const spawnFish = () => {
  const possibleFish = fishList.filter(
    (f) =>
      props.depth >= f.CatchableMinDepth && props.depth <= f.CatchableMaxDepth
  );

  if (possibleFish.length > 0) {
    // frequency の逆数を重みとした抽選を行う
    const weightedRandom = (items: typeof fishList) => {
      const weights = items.map((f) => 1 / f.frequency);
      const totalWeight = weights.reduce((acc, w) => acc + w, 0);
      const threshold = Math.random() * totalWeight;

      let cumulativeWeight = 0;
      for (let i = 0; i < items.length; i++) {
        cumulativeWeight += weights[i];
        if (threshold <= cumulativeWeight) return items[i];
      }
      return items[items.length - 1];
    };

    fish.value = weightedRandom(possibleFish);
    const fishName = fish.value.name as FishImageWidthKeys;
    imagePath.value = FishImages[fishName] || "/images/default.png";
    imageWidth.value = FishImageWidths[fishName] || 50;

    // 画面内のランダムな位置に設定
    randomX.value = Math.random() * 80 + 10; // 10% 〜 90% の範囲
    randomY.value = Math.random() * 80 + 10; // 10% 〜 90% の範囲
  } else {
    fish.value = null;
  }
};

onMounted(() => {
  spawnFish();
});

watch(() => props.shadowSwitch, spawnFish);

const fishStyle = computed(() => ({
  position: "absolute" as const,
  left: `${randomX.value}%`,
  bottom: `${randomY.value}%`,
}));

// depthに応じたクラスを決定するcomputedプロパティ
const grayscaleClass = computed(() => {
  return props.depth < 50 ? "grayscale-1" : "grayscale-2";
});
</script>

<style scoped>
.fade-swim {
  animation: swim 6s ease-out forwards;
}

.grayscale-1 {
  filter: grayscale(100%) brightness(0);
  opacity: 0.3;
}

.grayscale-2 {
  filter: grayscale(100%) brightness(0);
  opacity: 0.7;
}
</style>
