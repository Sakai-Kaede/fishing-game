<template>
  <button
    :class="['button-atom', shapeClass, sizeClass]"
    :style="styleObject"
    @click="onClick"
  >
    <slot>Button</slot>
  </button>
</template>

<script setup lang="ts">
const props = defineProps({
  shape: {
    type: String as PropType<"circle" | "square">,
    default: "square",
  },
  size: {
    type: String as PropType<"small" | "medium" | "large">,
    default: "medium",
  },
  color: {
    type: String,
    default: "#007BFF", // デフォルトの背景色
  },
  textColor: {
    type: String,
    default: "#FFFFFF", // デフォルトの文字色
  },
  onClick: {
    type: Function as PropType<(event: MouseEvent) => void>,
    default: () => {}, // デフォルトは空の関数
  },
});

const shapeClass = computed(() =>
  props.shape === "circle" ? "button-circle" : "button-square"
);
const sizeClass = computed(() => `button-${props.size}`);
const styleObject = computed(() => ({
  backgroundColor: props.color,
  color: props.textColor,
}));
</script>

<style scoped>
.button-atom {
  border: none;
  cursor: pointer;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  transition: all 0.2s ease-in-out;
}

.button-atom:hover {
  opacity: 0.9;
}

.button-circle {
  border-radius: 50%;
}

.button-square {
  border-radius: 4px;
}

.button-small {
  padding: 8px 16px;
  font-size: 12px;
}

.button-medium {
  padding: 12px 24px;
  font-size: 14px;
}

.button-large {
  padding: 16px 32px;
  font-size: 16px;
}
</style>
