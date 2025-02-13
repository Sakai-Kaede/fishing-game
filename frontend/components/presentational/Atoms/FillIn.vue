<template>
  <div :style="slotStyles" class="image-wrapper">
    <slot />
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  color: {
    type: String,
    default: "",
  },
});

// HEXカラーをCSSフィルタに変換
const hexToFilter = (hex: string) => {
  let r = parseInt(hex.substring(1, 3), 16) / 255;
  let g = parseInt(hex.substring(3, 5), 16) / 255;
  let b = parseInt(hex.substring(5, 7), 16) / 255;

  let brightness = (r + g + b) / 3;
  let invert = 1 - brightness;

  return `brightness(0) saturate(100%) invert(${invert}) sepia(1) saturate(500%) hue-rotate(0deg) brightness(1) contrast(1)`;
};

const slotStyles = computed(() => {
  const filterStyle =
    props.color && props.color.startsWith("#")
      ? hexToFilter(props.color)
      : "none";

  return {
    filter: filterStyle,
  };
});
</script>
