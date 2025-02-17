<template>
  <p :class="computedClass">
    <template v-if="error">
      <PhosphorIconWarningCircle size="30" class="text__icon" color="#ff5252" />
    </template>
    <slot />
  </p>
</template>

<script setup lang="ts">
import "@/assets/scss/main.scss";
import { computed } from "vue";

const props = defineProps({
  error: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String,
    default: "medium",
    validator: (value: string) => ["small", "medium", "large"].includes(value),
  },
});

const computedClass = computed(() => {
  return ["text", `text--${props.size}`, { "text--error": props.error }];
});
</script>

<style lang="scss" scoped>
.text {
  font-size: 1.6rem;
  color: $gray-80;
  display: flex;
  align-items: center;

  &--small {
    font-size: 1.2rem;
  }

  &--medium {
    font-size: 1.6rem;
  }

  &--large {
    font-size: 2rem;
  }

  &--error {
    border-radius: 10px;
    border: 1.5px solid $red-40;
    background-color: $red-10;
    color: black;
    padding: 0.4rem 0.8rem;
  }

  .text__icon {
    margin-right: 0.4rem;
  }
}
</style>
