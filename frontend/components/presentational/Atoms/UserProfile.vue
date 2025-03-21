<template>
  <div v-if="isDataLoaded && userStore.userId">
    <div class="display-user-data">
      <div v-if="isDataLoaded" class="user-info">
        <img
          v-if="highScoreFishImage"
          :src="highScoreFishImage"
          alt="ハイスコアの魚の画像"
          class="profile-image"
        />
        <div class="user-details">
          <p><strong>ユーザー名:</strong> {{ userStore.username }}</p>
          <p><strong>所持金:</strong> {{ userStore.sumScore }}</p>
          <p><strong>釣り竿レベル:</strong> {{ userStore.fishingRodLevel }}</p>
        </div>
      </div>
      <div v-else>
        <p>データを取得中...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import "@/assets/scss/main.scss";
import { useUserStore } from "@/store/user";
import { FishImages } from "@/constants/FishImages";
import type { FishImageKeys } from "@/constants/FishImages"; // FishImages と FishImageKeys をインポート

const userStore = useUserStore();
const isDataLoaded = ref(false);
const highScoreFish = ref<{ name: string; score: number } | null>(null);

// FishImages から画像マッピングを作成
const fishImages: Record<FishImageKeys, string> = FishImages;

onMounted(async () => {
  const result = await userStore.getUserData();

  if (!result.success) {
    console.error(result.message);
  } else {
    const highestScoringFish = userStore.highScoreFish;
    highScoreFish.value = highestScoringFish
      ? highestScoringFish
      : { name: "デフォルトの魚", score: 0 };
  }
  isDataLoaded.value = true;
});

// highScoreFishが更新されたときに画像を更新する
watch(
  () => userStore.highScoreFish,
  (newFish) => {
    highScoreFish.value = newFish || { name: "デフォルトの魚", score: 0 };
  }
);

// 魚の画像を取得
const highScoreFishImage = computed(() => {
  const fishName = highScoreFish.value?.name || "デフォルトの魚";
  // FishImages から画像を取得
  return fishImages[fishName as FishImageKeys] || fishImages["デフォルトの魚"];
});
</script>

<style scoped lang="scss">
.display-user-data {
  background-color: $gray-10;
  border: 1px solid $gray-30;
  border-radius: 10px;
  padding: 1rem;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 40rem;

  p {
    font-size: 2rem;
    color: $blue-40;
    margin: 5px 0;
  }

  strong {
    color: $blue-40;
  }

  .user-info {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }

  .profile-image {
    width: 14rem;
    height: 10rem;
    border-radius: 10px;
    object-fit: cover;
    margin-right: 1.5rem;
    border: 2px solid $blue-40;
    background-color: $yellow-30;
  }

  .user-details {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
