<template>
  <component
    :is="iconComponent"
    :style="{ fontSize: size, color: color }"
    class="icon"
  />
</template>

<script setup lang="ts">
import {
  PhArrowBendRightUp,
  PhArrowLeft,
  PhArrowRight,
  PhArrowBendDownLeft,
  PhWarning,
} from "@phosphor-icons/vue";

const props = defineProps({
  icon: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    default: "24px",
  },
  color: {
    type: String,
    default: "black",
  },
});

// アイコンコンポーネントを選択するcomputedプロパティ
const iconComponent = computed(() => {
  const iconName = props.icon;

  // アイコン名をもとに条件分岐
  switch (iconName) {
    case "PhArrowBendRightUp":
      return PhArrowBendRightUp;
    case "PhArrowLeft":
      return PhArrowLeft;
    case "PhArrowRight":
      return PhArrowRight;
    case "PhArrowBendDownLeft":
      return PhArrowBendDownLeft;
    case "PhWarning":
      return PhWarning;
    default:
      console.error(`Icon ${iconName} not found`);
      return null;
  }
});
</script>

<style scoped>
.icon {
  display: inline-block;
}
</style>
