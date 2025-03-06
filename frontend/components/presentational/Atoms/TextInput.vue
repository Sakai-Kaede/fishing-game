<template>
  <div class="text-input">
    <label v-if="label" :for="id" class="text-input__label">
      {{ label }}
    </label>
    <div class="text-input__wrapper">
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
        :min="min"
        :max="max"
        :step="step"
        class="text-input__input"
        :aria-invalid="!!errorMessage"
        :style="{
          fontSize: computedFontSize,
          padding: computedPadding,
          width: computedWidth,
        }"
      />

      <button
        v-if="showButtons"
        type="button"
        @mousedown="startIncrement"
        @mouseup="stopIncrement"
        @mouseleave="stopIncrement"
        @touchstart="startIncrement"
        @touchend="stopIncrement"
        @touchcancel="stopIncrement"
        @click="handleIncrement"
        :disabled="disabled"
        :style="incrementButtonStyle"
      >
        ↑
      </button>
      <button
        v-if="showButtons"
        type="button"
        @mousedown="startDecrement"
        @mouseup="stopDecrement"
        @mouseleave="stopDecrement"
        @touchstart="startDecrement"
        @touchend="stopDecrement"
        @touchcancel="stopDecrement"
        @click="handleDecrement"
        :disabled="disabled"
        :style="decrementButtonStyle"
      >
        ↓
      </button>
    </div>

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
  min: {
    type: Number,
    default: undefined,
  },
  max: {
    type: Number,
    default: undefined,
  },
  step: {
    type: Number,
    default: 1,
  },
  showButtons: {
    type: Boolean,
    default: false,
  },
});

let incrementInterval: any = null;
let decrementInterval: any = null;

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement | null;
  if (target) {
    let value = target.value;
    emit("update:modelValue", value);
  }
};

const handleIncrement = () => {
  let currentValue = Number(props.modelValue) || 0;
  let newValue = currentValue + (props.step || 10);

  if (props.max !== undefined && newValue > props.max) {
    newValue = props.max;
  }

  emit("update:modelValue", String(newValue));
};

const handleDecrement = () => {
  let currentValue = Number(props.modelValue) || 0;
  let newValue = currentValue - (props.step || 10);

  if (props.min !== undefined && newValue < props.min) {
    newValue = props.min;
  }

  emit("update:modelValue", String(newValue));
};

// Long press start for increment
const startIncrement = () => {
  incrementInterval = setInterval(() => {
    handleIncrement();
  }, 150); // 100msごとに増加
};

// Stop the increment interval
const stopIncrement = () => {
  if (incrementInterval) {
    clearInterval(incrementInterval);
    incrementInterval = null;
  }
};

// Long press start for decrement
const startDecrement = () => {
  decrementInterval = setInterval(() => {
    handleDecrement();
  }, 150); // 100msごとに減少
};

// Stop the decrement interval
const stopDecrement = () => {
  if (decrementInterval) {
    clearInterval(decrementInterval);
    decrementInterval = null;
  }
};

const handleFocus = () => {
  emit("focus");
};

// ボタンのサイズを計算する
const buttonSize = computed(() => {
  switch (props.size) {
    case "small":
      return "1.5rem";
    case "large":
      return "4rem";
    default:
      return "2rem";
  }
});

// ボタンのスタイルを動的に設定
const incrementButtonStyle = computed(() => ({
  width: buttonSize.value,
  height: buttonSize.value,
  fontSize: `calc(${buttonSize.value} / 2)`,
}));

const decrementButtonStyle = computed(() => ({
  width: buttonSize.value,
  height: buttonSize.value,
  fontSize: `calc(${buttonSize.value} / 2)`,
}));

const computedFontSize = computed(() => {
  switch (props.size) {
    case "small":
      return "1.2rem";
    case "large":
      return "2rem";
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
    font-size: 2rem;
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
