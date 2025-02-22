<template>
  <AtomsButton
    @click="updateFishingRodLevel(props.level)"
    class="updateButton"
    variant="primary_orange"
    size="medium"
  >
    釣竿レベルを {{ props.level }} にアップ
  </AtomsButton>
</template>

<script setup lang="ts">
import "@/assets/scss/main.scss";
import { useUserStore } from "@/store/user";

const props = defineProps({
  level: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits<{
  (event: "updateFishingRodLevel", success: boolean): void;
}>();

const userStore = useUserStore();

const updateFishingRodLevel = (level: number) => {
  try {
    userStore.updateFishingRodLevel(level);
    emit("updateFishingRodLevel", true);
  } catch (error: unknown) {
    emit("updateFishingRodLevel", false);
    throw new Error("釣竿レベルの更新に失敗しました");
  }
};
</script>
