<template>
  <div class="fish" :style="fishStyle"></div>
</template>

<script setup lang="ts">
import type { AchievementColor } from "@/types/type";

const props = defineProps<{
  color: AchievementColor;
  size: string;
}>();

const fishStyle = computed(() => {
  let background;
  switch (props.color) {
    case "gold":
      background =
        "linear-gradient(45deg, #b67b03 0%, #daaf08 45%, #fee9a0 70%, #daaf08 85%, #b67b03 90% 100%)";
      break;
    case "silver":
      background =
        "linear-gradient(45deg, #757575 0%, #9e9e9e 45%, #e8e8e8 70%, #9e9e9e 85%, #757575 90% 100%)";
      break;
    case "bronze":
      background =
        "linear-gradient(45deg, #b87333 0%, #d1885e 45%, #f0c07b 70%, #d1885e 85%, #b87333 90% 100%)";
      break;
    case "purple":
      background = "#b656b6";
      break;
    case "blue":
      background = "#587fb9";
      break;
    case "gray":
      background = "#cbcbcb";
      break;
    default:
      background = "#cbcbcb";
      break;
  }
  return {
    background,
    width: props.size,
    height: props.size,
  };
});
</script>

<style lang="scss" scoped>
.fish {
  -webkit-mask-image: url("@/assets/images/tools/suzuki.png");
  -webkit-mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;

  mask-image: url("@/assets/images/tools/suzuki.png");
  mask-size: contain;
  mask-repeat: no-repeat;
  mask-position: center;
}
</style>
