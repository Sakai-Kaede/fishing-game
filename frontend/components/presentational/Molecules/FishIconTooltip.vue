<template>
  <AtomsTooltip>
    <template #target>
      <AtomsFishIcon :color="color" :size="size"></AtomsFishIcon>
    </template>
    <template #text>{{ tooltipText }}</template>
  </AtomsTooltip>
</template>

<script lang="ts">
import type { AchievementColor } from "@/types/type";
export default defineComponent({
  props: {
    tooltipText: {
      type: String,
      required: true,
    },
    color: {
      type: String as PropType<AchievementColor>,
      required: true,
    },
    size: {
      type: String,
      default: "7rem",
    },
  },
});
</script>
