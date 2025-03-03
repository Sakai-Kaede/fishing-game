<template>
  <div>
    <AtomsCircleButton
      shape="circle"
      size="large"
      color="#5DADE2"
      textColor="#FFFFFF"
      @mousedown="startRising"
      @touchstart="startRising"
      @click="clickRising"
      @mouseup="stopAdjustingDepth"
      @mouseleave="stopAdjustingDepth"
      @touchend="stopAdjustingDepth"
    >
      <PhosphorIconArrowFatLineUp :size="32" color="#fafafa" weight="fill" />
    </AtomsCircleButton>
    <AtomsCircleButton
      shape="circle"
      size="large"
      color="#5DADE2"
      textColor="#FFFFFF"
      @mousedown="startDiving"
      @touchstart="startDiving"
      @click="clickDiving"
      @mouseup="stopAdjustingDepth"
      @mouseleave="stopAdjustingDepth"
      @touchend="stopAdjustingDepth"
    >
      <PhosphorIconArrowFatLineDown :size="32" color="#fafafa" weight="fill" />
    </AtomsCircleButton>
  </div>
</template>

<script setup lang="ts">
import "@/assets/scss/main.scss";
const props = defineProps<{
  modelValue: number;
}>();

const emit = defineEmits<{
  (event: "update:modelValue", value: number): void;
}>();

// 子コンポーネントの深さ状態
const depth = ref<number>(props.modelValue);

// `props.modelValue`が変更された場合、`depth`を同期
watch(
  () => props.modelValue,
  (newValue) => {
    depth.value = newValue;
  }
);

// 潜るボタンの処理
const startDiving = () => {
  const increaseDepth = () => {
    if (depth.value < 100) {
      depth.value += 1;
      emit("update:modelValue", depth.value); // 親に通知
    }
  };
  intervalId = setInterval(increaseDepth, 100);
};

// 上がるボタンの処理
const startRising = () => {
  const decreaseDepth = () => {
    if (depth.value > 0) {
      depth.value -= 1;
      emit("update:modelValue", depth.value);
    }
  };
  intervalId = setInterval(decreaseDepth, 100);
};

// その他の関数はそのまま
const clickDiving = () => {
  if (depth.value < 100) {
    depth.value += 1;
    emit("update:modelValue", depth.value);
  }
};

const clickRising = () => {
  if (depth.value > 0) {
    depth.value -= 1;
    emit("update:modelValue", depth.value);
  }
};

const stopAdjustingDepth = () => {
  if (intervalId) {
    clearInterval(intervalId);
  }
};

let intervalId: NodeJS.Timeout | null = null;
</script>

<style lang="scss" scoped>
$primary-color: rgba(93, 173, 226, 0.9);
$hover-color: rgba(52, 152, 219, 0.9);
$active-color: rgba(46, 134, 193, 0.9);

button {
  width: 6rem;
  height: 6rem;
  border-radius: 50%;
  background-color: $primary-color;
  color: $gray-10;
  border: none;
  box-shadow: inset 0px 0px 10px rgba(255, 255, 255, 0.4);
  transition: background-color 0.3s ease, transform 0.1s ease;
  z-index: 10;

  &:hover {
    background-color: $gray-10;
  }

  &:active {
    background-color: $gray-10;
    transform: scale(0.95);
  }
}
</style>
