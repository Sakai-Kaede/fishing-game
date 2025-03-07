<template>
  <span class="tooltip" @click="toggleTooltip" @mouseleave="hideTooltip">
    <span class="tooltip-target">
      <slot name="target"></slot>
    </span>
    <span class="tooltip-text" :class="{ 'is-visible': isTooltipVisible }">
      <slot name="text"></slot>
    </span>
  </span>
</template>

<script setup lang="ts">
import "@/assets/scss/main.scss";

const isTooltipVisible = ref(false);

const toggleTooltip = () => {
  isTooltipVisible.value = !isTooltipVisible.value;
};

const hideTooltip = () => {
  isTooltipVisible.value = false;
};
</script>

<style scoped lang="scss">
.tooltip {
  position: relative;
  cursor: pointer;
  &:hover .tooltip-text {
    opacity: 1;
    visibility: visible;
  }
}

.tooltip-text {
  z-index: 10;
  opacity: 0;
  visibility: hidden;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: -2rem;
  display: inline-block;
  padding: 5px;
  white-space: nowrap;
  font-size: 2rem;
  line-height: 1.3;
  background: $gray-80;
  color: $gray-10;
  border-radius: 3px;
  transition: 0.3s ease-in;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  &:before {
    content: "";
    position: absolute;
    top: -11px;
    left: 50%;
    margin-left: -7px;
    border: 7px solid transparent;
    border-bottom: 7px solid $gray-80;
  }
}

.tooltip-text.is-visible {
  opacity: 1;
  visibility: visible;
}

.tooltip-target {
  display: inline-block;
}
</style>
