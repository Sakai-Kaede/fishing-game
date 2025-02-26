<template>
  <AtomsTooltip>
    <template #target>
      <AtomsCardIcon :color="color" :size="size"></AtomsCardIcon>
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
      type: String as () => AchievementColor,
      required: true,
    },
    size: {
      type: String,
      default: "5rem",
    },
  },
});
</script>

<style scoped lang="scss"></style>
