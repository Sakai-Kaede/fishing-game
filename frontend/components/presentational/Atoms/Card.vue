<template>
  <div :class="computedClass">
    <div class="card-image">
      <slot name="image" />
    </div>
    <div class="card-content">
      <slot name="title" />
      <div class="card-description">
        <slot name="description" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import "@/assets/scss/main.scss";

const props = defineProps({
  variant: {
    type: String,
    default: "default",
    validator: (value: string) =>
      [
        "default",
        "primary",
        "secondary",
        "gold",
        "silver",
        "bronze",
        "blue",
      ].includes(value),
  },
  size: {
    type: String,
    default: "medium",
    validator: (value: string) => ["small", "medium", "large"].includes(value),
  },
  hoverEffect: {
    type: Boolean,
    default: false,
  },
});

const computedClass = computed(() => {
  return [
    "card",
    `card--${props.variant}`,
    `card--${props.size}`,
    { "card--hover": props.hoverEffect },
  ];
});
</script>

<style lang="scss" scoped>
.card {
  border: 1px solid $gray-20;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;

  &--default {
    background-color: $gray-10;
  }
  &--primary {
    background-color: $skyblue-40;
  }
  &--secondary {
    background-color: $orange-40;
  }
  &--gold {
    background: linear-gradient(
      45deg,
      #b67b03 0%,
      #daaf08 45%,
      #fee9a0 70%,
      #daaf08 85%,
      #b67b03 90% 100%
    );
  }
  &--silver {
    background: linear-gradient(
      45deg,
      #757575 0%,
      #9e9e9e 45%,
      #e8e8e8 70%,
      #9e9e9e 85%,
      #757575 90% 100%
    );
  }
  &--bronze {
    background: linear-gradient(
      45deg,
      #b87333 0%,
      #d1885e 45%,
      #f0c07b 70%,
      #d1885e 85%,
      #b87333 90% 100%
    );
  }
  &--blue {
    background-color: $skyblue-20;
  }
}

.card--hover:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.card--small {
  width: 20rem;
}

.card--medium {
  width: 30rem;
}

.card--large {
  width: 40rem;
}

.card-image {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.card-content {
  font-size: 1.5rem;
  margin-top: 0.8rem;
  text-align: center;
}

.card-description {
  margin-top: 0.8rem;
}
</style>
