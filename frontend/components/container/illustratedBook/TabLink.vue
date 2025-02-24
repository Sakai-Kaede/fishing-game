<template>
  <button @click="$emit('click')" :class="{ active: isActive }">
    {{ tab.label }}
  </button>
</template>

<script setup lang="ts">
import type { Tab } from "@/types/type";
const props = defineProps<{
  currentTab: string;
  tab: Tab;
}>();

defineEmits<{
  click: [];
}>();

const isActive = computed(() => props.currentTab === props.tab.key);
</script>

<style scoped lang="scss">
button {
  font-size: 3rem;
  padding: 3rem;

  &.active {
    border-bottom-color: #3b82f6;
    color: #3b82f6;
  }

  &:focus {
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  }

  transition: all 0.3s ease;
}
</style>
