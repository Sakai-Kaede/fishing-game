<template>
  <div class="fish-book">
    <div class="filter-range">
      <div class="filter-input-wrapper">
        <div class="filter-input-container">
          <AtomsTextInput
            :id="'depth'"
            :modelValue="displayDepth"
            @update:modelValue="updateDepth"
            label="捕獲範囲でフィルタリング："
            placeholder="深度を入力"
            :min="0"
            :max="1000"
            :name="'depth'"
            :size="'large'"
            :step="10"
            :showButtons="true"
            @input="filterFishByDepth"
          />
        </div>

        <button
          :class="{ 'is-visible': depthString }"
          @click="clearFilter"
          class="filter-clear-button"
        >
          フィルタリングをオフ
        </button>
      </div>
    </div>

    <!-- ソートボタン -->
    <div class="sort-buttons">
      <button @click="sortByDepth">捕獲範囲でソート</button>
      <button @click="sortByScore">スコアでソート</button>
    </div>

    <div class="fish-list">
      <AtomsCard
        v-for="fish in filteredFishList"
        :key="fish.name"
        :variant="getVariant(fish.score)"
        size="small"
        hoverEffect
      >
        <template #image>
          <img
            :src="getFishImage(fish.name)"
            :alt="clientReady && isCaught(fish.name) ? fish.name : '???'"
            :class="{
              img: true,
              silhouette: !clientReady || !isCaught(fish.name),
            }"
          />
        </template>
        <template #title>
          <h3>
            {{
              clientReady && (isCaught(fish.name) || fish.score < 250)
                ? fish.name
                : "???"
            }}
          </h3>
        </template>
        <template #description>
          <p>
            スコア: <span class="highlight">{{ fish.score }}</span>
          </p>
          <p>
            捕獲範囲:
            <span class="highlight"
              >{{ fish.CatchableMinDepth * 10 }}m 〜
              {{ fish.CatchableMaxDepth * 10 }}m</span
            >
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
const clientReady = ref(false);
const caughtFishNames = ref<string[]>([]);

onMounted(() => {
  caughtFishNames.value = userStore.getCaughtFishNames();
  clientReady.value = true;
  sortByScore();
});

// 捕獲範囲のフィルタ条件
const depthString = ref<string>("");

// 表示用の値（10倍）
const displayDepth = computed(() => {
  const depth = parseInt(depthString.value, 10);
  return isNaN(depth) ? "" : String(depth * 10); // `string` に変換
});

// 入力値の更新処理（10分の1にして格納）
const updateDepth = (value: string) => {
  const parsedValue = parseInt(value, 10);
  if (!isNaN(parsedValue)) {
    depthString.value = String(parsedValue / 10); // `string` 型で格納
    filterFishByDepth();
  }
};

// フィルタリング後の魚リスト
const filteredFishList = ref(fishList);

// 捕まえた魚がいるかどうかの判定
const isCaught = (fishName: string): boolean => {
  return caughtFishNames.value.includes(fishName);
};

const fishImages = FishImages as Record<string, string>;

const getFishImage = (fishName: string): string => {
  return clientReady.value && isCaught(fishName)
    ? fishImages[fishName]
    : fishImages["デフォルトの魚"];
};

// スコアに応じたカードのバリアントを決定
const getVariant = (score: number): string => {
  if (score >= 1000) return "gold";
  if (score >= 450) return "silver";
  if (score >= 350) return "bronze";
  return "blue";
};

// 捕獲範囲でソート
const sortByDepth = () => {
  filteredFishList.value = [...fishList].sort((a, b) => {
    if (a.CatchableMinDepth !== b.CatchableMinDepth) {
      return a.CatchableMinDepth - b.CatchableMinDepth;
    }
    return a.CatchableMaxDepth - b.CatchableMaxDepth;
  });
};

const sortByScore = () => {
  filteredFishList.value = [...fishList].sort((a, b) => a.score - b.score);
};

const filterFishByDepth = () => {
  const depth = parseInt(depthString.value, 10);

  if (!isNaN(depth)) {
    filteredFishList.value = fishList.filter((fish) => {
      return fish.CatchableMinDepth <= depth && fish.CatchableMaxDepth >= depth;
    });
  } else {
    filteredFishList.value = fishList;
  }
};

const clearFilter = () => {
  depthString.value = "";
  filteredFishList.value = fishList;
};
</script>

<style lang="scss" scoped>
.filter-range {
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;
}

.filter-input-wrapper {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.filter-input-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.filter-clear-button {
  padding: 10px 15px;
  font-size: 14px;
  background-color: $red-40;
  border: 1px solid $gray-30;
  border-radius: 5px;
  color: $gray-10;
  cursor: pointer;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;
  position: absolute;
  left: 100%;
  margin-left: 10px;
  width: 20rem;
  bottom: 0;
}

.filter-clear-button.is-visible {
  opacity: 1;
  visibility: visible;
}

.sort-buttons {
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;
}

.sort-buttons button {
  margin-right: 10px;
  padding: 10px 15px;
  font-size: 14px;
  cursor: pointer;
  background-color: $gray-20;
  border: 1px solid $gray-30;
  border-radius: 5px;
}

.sort-buttons button:hover {
  background-color: $gray-40;
}

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
  grid-template-columns: repeat(auto-fill, minmax(22rem, 1fr));
  gap: 1rem;
  padding: 1rem;
}

.img {
  height: 8rem;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
}

.silhouette {
  filter: grayscale(100%) brightness(0);
  opacity: 0.6;
}

.highlight {
  font-weight: bold;
  font-size: 1.8rem;
}
</style>
