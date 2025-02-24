<template>
  <div class="achievement-container">
    <div class="achievements">
      <div
        class="achievement-group"
        v-for="group in achievementGroups"
        :key="group.level"
      >
        <div class="fish-icons">
          <div
            v-for="(achievement, index) in group.achievements"
            :key="index"
            class="achievement-item"
          >
            <MoleculesFishIconTooltip
              v-if="achievement.group === '1' || achievement.group === '2'"
              :tooltipText="achievement.name"
              :color="getAchievementColor(achievement.name)"
              :size="'15rem'"
            />
            <MoleculesCardIconTooltip
              v-if="achievement.group === '3'"
              :tooltipText="achievement.name"
              :color="getAchievementColor(achievement.name)"
              :size="'12rem'"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import "@/assets/scss/main.scss";
import { useUserStore } from "@/store/user";
const userStore = useUserStore();

const getAchievementColor = (achievementName: string) => {
  const allAchievements = getAchievements();

  for (const group of allAchievements) {
    const achievement = group.achievements.find(
      (achievement) => achievement.name === achievementName
    );
    if (achievement) {
      const userAchievement = userStore.achievements?.find(
        (userAch) => userAch.name === achievementName
      );

      if (userAchievement) {
        return achievement.color;
      } else {
        return "gray";
      }
    }
  }
  return "gray";
};

const getAchievements = () => {
  return [
    {
      level: 5,
      achievements: [
        { name: "魚を30種類捕まえた！", color: "gold", group: "1" },
        { name: "魚を1,000匹捕まえた！", color: "gold", group: "2" },
        {
          name: "ポーカーで100,000,000ポイント稼いだ！",
          color: "gold",
          group: "3",
        },
      ],
    },
    {
      level: 4,
      achievements: [
        { name: "魚を25種類捕まえた！", color: "silver", group: "1" },
        { name: "魚を500匹捕まえた！", color: "silver", group: "2" },
        {
          name: "ポーカーで10,000,000ポイント稼いだ！",
          color: "silver",
          group: "3",
        },
      ],
    },
    {
      level: 3,
      achievements: [
        { name: "魚を20種類捕まえた！", color: "bronze", group: "1" },
        { name: "魚を100匹捕まえた！", color: "bronze", group: "2" },
        {
          name: "ポーカーで2,500,000ポイント稼いだ！",
          color: "bronze",
          group: "3",
        },
      ],
    },
    {
      level: 2,
      achievements: [
        { name: "魚を15種類捕まえた！", color: "purple", group: "1" },
        { name: "魚を10匹捕まえた！", color: "purple", group: "2" },
        {
          name: "ポーカーで10,000ポイント稼いだ！",
          color: "purple",
          group: "3",
        },
      ],
    },
    {
      level: 1,
      achievements: [
        { name: "魚を1種類捕まえた！", color: "blue", group: "1" },
        { name: "魚を1匹捕まえた！", color: "blue", group: "2" },
        { name: "ポーカーで1000ポイント稼いだ！", color: "blue", group: "3" },
      ],
    },
  ];
};

const achievementGroups = getAchievements();
</script>

<style scoped lang="scss">
.achievement-container {
  text-align: center;
  min-height: 85vh;
  text-align: center;
  background: $yellow-30;
  border: 2px solid $yellow-70;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.2);
}

.achievement-group {
  margin-bottom: 20px;
}

.fish-icons {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.achievement-item {
  flex: 1 1 30%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
