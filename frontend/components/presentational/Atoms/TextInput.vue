<template>
  <div class="text-input">
    <label v-if="label" :for="id" class="text-input__label">
      {{ label }}
    </label>
    <input
      :id="id"
      :value="modelValue"
      @input="handleInput"
      @focus="handleFocus"
      :type="type"
      :name="name"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      class="text-input__input"
      :aria-invalid="!!errorMessage"
      :style="{
        fontSize: computedFontSize,
        padding: computedPadding,
        width: computedWidth,
      }"
    />
    <div v-if="errorMessage" class="text-input__error">
      <PhosphorIconWarning size="20" />
      <p>{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import "@/assets/scss/main.scss";

const emit = defineEmits<{
  (event: "update:modelValue", value: string): void;
  (event: "focus"): void;
}>();

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  label: {
    type: String,
    default: "",
  },
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: "text",
  },
  placeholder: {
    type: String,
    default: "",
  },
  required: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  errorMessage: {
    type: String,
    default: "",
  },
  size: {
    type: String,
    default: "medium",
  },
});

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement | null;
  if (target) {
    emit("update:modelValue", target.value);
  }
};

const handleFocus = () => {
  emit("focus");
};

const computedFontSize = computed(() => {
  switch (props.size) {
    case "small":
      return "1.2rem";
    case "large":
      return "1.6rem";
    default:
      return "1.4rem";
  }
});

const computedPadding = computed(() => {
  switch (props.size) {
    case "small":
      return "0.6rem";
    case "large":
      return "1rem";
    default:
      return "0.8rem";
  }
});

const computedWidth = computed(() => {
  switch (props.size) {
    case "small":
      return "15rem";
    case "large":
      return "30rem";
    default:
      return "20rem";
  }
});
</script>

<style scoped lang="scss">
.text-input {
  display: flex;
  flex-direction: column;
  position: relative;

  &__label {
    margin-bottom: 2px;
    font-size: 1.5rem;
    color: $gray-70;
  }

  &__input {
    border: 1px solid $gray-50;
    border-radius: 4px;
    transition: border-color 0.3s;

    &:disabled {
      background-color: $gray-10;
      cursor: not-allowed;
    }
  }

  &__error {
    display: flex;
    align-items: center;
    margin-top: 8px;
    color: $gray-70;
    p {
      margin-left: 8px;
    }

    .AtomsIcon {
      flex-shrink: 0;
    }
  }
}
</style>
