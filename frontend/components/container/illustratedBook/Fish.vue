<template>
  <div class="fish-book">
    <div class="fish-list">
      <AtomsCard
        v-for="fish in fishList"
        :key="fish.name"
        :variant="getVariant(fish.score)"
        size="small"
        hoverEffect
      >
        <template #image>
          <img
            :src="getFishImage(fish.name)"
            :alt="isCaught(fish.name) ? fish.name : '???'"
            :class="{ img: true, silhouette: !isCaught(fish.name) }"
          />
        </template>
        <template #title>
          <h3>
            {{ isCaught(fish.name) || fish.score < 250 ? fish.name : "???" }}
          </h3>
        </template>
        <template #description>
          <p>スコア: {{ fish.score }}</p>
          <p>
            捕獲可能範囲: {{ fish.CatchableMinDepth }}m 〜
            {{ fish.CatchableMaxDepth }}m
          </p>
        </template>
      </AtomsCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import "@/assets/scss/main.scss";
import { useUserStore } from "@/store/user";
import { fishList } from "@/constants/FishData";
import { FishImages } from "@/constants/FishImages";

const userStore = useUserStore();

// 捕まえた魚の名前リストを取得
const caughtFishNames = computed(() => {
  return userStore.getCaughtFishNames();
});

// 指定した魚が捕まえられたか判定
const isCaught = (fishName: string): boolean => {
  return caughtFishNames.value.includes(fishName);
};

// fishImages の型を Record<string, string> に設定
const fishImages = FishImages as Record<string, string>;

// 魚の画像を取得する関数
const getFishImage = (fishName: string): string => {
  return isCaught(fishName)
    ? fishImages[fishName]
    : fishImages["デフォルトの魚"];
};

const getVariant = (score: number): string => {
  if (score >= 800) return "gold";
  if (score >= 450) return "silver";
  if (score >= 250) return "bronze";
  return "blue";
};
</script>

<style lang="scss" scoped>
.fish-book {
  text-align: center;
  background: $yellow-30;
  border: 2px solid $yellow-70;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.2);
}

.fish-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  padding: 1rem;
}

.img {
  height: 6rem;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
}

.silhouette {
  filter: grayscale(100%) brightness(0);
  opacity: 0.6;
}
</style>
