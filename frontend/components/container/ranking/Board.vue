<template>
  <div class="ranking-board">
    <div class="board-header">
      <img
        src="@/assets/images/tools/trophy.png"
        alt="トロフィー"
        class="trophy-icon"
      />
      <h1>ランキング</h1>
    </div>
    <ul class="ranking-list">
      <li
        v-for="(ranking, index) in rankings"
        :key="index"
        class="ranking-item"
      >
        <span class="ranking-position">{{ index + 1 }}位</span>
        <span class="ranking-username">{{ ranking.username }}</span>
        <span class="ranking-score">スコア: {{ ranking.sumScore }}</span>

        <MoleculesFishIconTooltip
          :tooltipText="getAchievementName(ranking, 1)"
          :color="getAchievementColor(ranking, 1)"
        ></MoleculesFishIconTooltip>

        <MoleculesFishIconTooltip
          :tooltipText="getAchievementName(ranking, 2)"
          :color="getAchievementColor(ranking, 2)"
        ></MoleculesFishIconTooltip>

        <MoleculesCardIconTooltip
          :tooltipText="getAchievementName(ranking, 3)"
          :color="getAchievementColor(ranking, 3)"
        ></MoleculesCardIconTooltip>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { Ranking } from "@/types/type";
import { RepositoryFactory } from "@/repositories/index";
import { ref, onMounted } from "vue";

const rankings = ref<Ranking[]>([]);

const userRepository = RepositoryFactory.get("user");
const fetchRankings = async () => {
  try {
    const data = await userRepository.getRanking();

    if (Array.isArray(data)) {
      rankings.value = data;
    }
  } catch (error) {
    console.error("ランキングデータの取得に失敗しました:", error);
  }
};

// 指定した group の実績名を取得、ない場合は「実績なし」を返す
const getAchievementName = (ranking: Ranking, group: number) => {
  const achievement = ranking.achievements.find((ach) => ach.group === group);
  return achievement ? achievement.name : "実績なし";
};

// 指定した group の実績の level に応じた色を返す
const getAchievementColor = (ranking: Ranking, group: number) => {
  const achievement = ranking.achievements.find((ach) => ach.group === group);
  if (!achievement) return "gray";

  switch (achievement.level) {
    case 1:
      return "blue";
    case 2:
      return "purple";
    case 3:
      return "bronze";
    case 4:
      return "silver";
    case 5:
      return "gold";
    default:
      return "gray";
  }
};

onMounted(() => {
  fetchRankings();
});
</script>

<style scoped lang="scss">
/* ボード全体のスタイル */
.ranking-board {
  background: linear-gradient(
    135deg,
    #8b5a2b,
    #c19a6b
  ); /* 木目風のグラデーション */
  padding: 2rem;
  border-radius: 16px;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.5), 0 4px 8px rgba(0, 0, 0, 0.3);
  max-width: 100rem;
  width: 100%;
}

/* ヘッダー部分のスタイル */
.board-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1.5rem;
}

.trophy-icon {
  width: 6rem;
  height: 6rem;
  margin-bottom: 0.5rem;
}

h1 {
  font-size: 1.8rem;
  font-weight: bold;
  color: $gray-10;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
}

/* ランキングリストのスタイル */
.ranking-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.ranking-item {
  background: rgba(255, 255, 255, 0.9);
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 2rem;
  color: $gray-70;
  font-weight: bold;
}

.ranking-item:last-child {
  margin-bottom: 0;
}

/* ランキング順位 */
.ranking-position {
  font-size: 1.5rem;
  color: $gray-60;
}

/* ランキングユーザー名 */
.ranking-username {
  flex: 1;
  margin: 0 1rem;
  text-align: left;
}

/* ランキングスコア */
.ranking-score {
  margin-right: 3rem;
  font-size: 2rem;
  color: $gray-70;
}

@media (max-width: 768px) {
  h1 {
    font-size: 1.5rem;
  }

  .ranking-item {
    flex-direction: column;
    text-align: center;
  }

  .ranking-username {
    margin: 0.5rem 0;
  }
}
</style>
