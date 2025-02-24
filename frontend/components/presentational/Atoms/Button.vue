<template>
  <button :class="computedClass" :disabled="disabled" @click="handleClick">
    <slot />
  </button>
</template>

<script setup lang="ts">
import "@/assets/scss/main.scss";
import { computed } from "vue";

const props = defineProps({
  variant: {
    type: String,
    default: "primary",
    validator: (value: string) =>
      [
        "primary",
        "primary_orange",
        "secondary",
        "text_underline",
        "primary_poker",
        "secondary_poker",
      ].includes(value),
  },
  size: {
    type: String,
    default: "medium",
    validator: (value: string) => ["small", "medium", "large"].includes(value),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["click"]);

const computedClass = computed(() => {
  return [
    "button",
    `button--${props.variant}`,
    `button--${props.size}`,
    { "button--disabled": props.disabled },
  ];
});

const handleClick = (event: MouseEvent) => {
  if (!props.disabled) {
    emit("click", event);
  }
};
</script>

<style lang="scss" scoped>
.button {
  border: none;
  border-radius: 4px;
  transition: background-color 0.2s ease, color 0.2s ease;
  cursor: pointer;

  &--primary {
    background-color: $skyblue-40;
    color: $gray-20;
    &:hover {
      background-color: $skyblue-50;
    }
  }
  &--primary_orange {
    background-color: $orange-40;
    color: $gray-90;
    &:hover {
      background-color: $orange-50;
    }
  }
  &--secondary {
    background-color: transparent;
    border: 2px solid $skyblue-40;
    color: $skyblue-40;
    &:hover {
      background-color: $skyblue-40;
      color: $gray-20;
    }
  }
  &--primary_poker {
    background: linear-gradient(45deg, #ffcc00, #ff6600);
    color: $gray-10;
    border: none;
    &:hover {
      background: linear-gradient(45deg, #ff6600, #ff3300);
    }
  }
  &--secondary_poker {
    background-color: transparent;
    border: 2px solid #ff3300;
    color: $gray-70;
    &:hover {
      background-color: #ff6600;
      color: $gray-20;
    }
  }
  &--text_underline {
    background-color: transparent;
    border: none;
    color: $gray-80;
    text-decoration: underline;
    &:hover {
      color: $gray-60;
    }
  }

  &--small {
    font-size: 1.2rem;
    padding: 0.6rem 1.2rem;
  }

  &--medium {
    font-size: 1.6rem;
    padding: 0.8rem 1.6rem;
  }

  &--large {
    font-size: 2rem;
    padding: 1rem 2rem;
  }

  &--disabled {
    background-color: $gray-30;
    color: $gray-60;
    cursor: not-allowed;
  }
}
</style>
