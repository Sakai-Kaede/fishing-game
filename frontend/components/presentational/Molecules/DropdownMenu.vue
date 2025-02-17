<template>
  <div class="dropdown">
    <AtomsButton
      size="medium"
      type="button"
      variant="secondary"
      @click="toggleMenu"
      :disabled="disabled"
      :aria-expanded="isOpen"
      :aria-invalid="!!errorMessage"
    >
      {{ selectedLabel }}
      <PhosphorIconCaretDown size="20" />
    </AtomsButton>
    <ul v-if="isOpen" class="dropdown__menu">
      <li
        v-for="(item, index) in items"
        :key="index"
        class="dropdown__item"
        @click="selectItem(item)"
      >
        {{ item }}
      </li>
    </ul>
    <div v-if="errorMessage" class="dropdown__error">
      <PhosphorIconWarning size="20" />
      <p>{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import "@/assets/scss/main.scss";

interface Props {
  label: string;
  items: string[];
  errorMessage?: string;
  disabled?: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "select", value: string): void;
}>();

const isOpen = ref(false);
const selectedLabel = ref(props.label);

const toggleMenu = () => {
  if (!props.disabled) {
    isOpen.value = !isOpen.value;
  }
};

const selectItem = (item: string) => {
  selectedLabel.value = item;
  emit("select", item);
  isOpen.value = false;
};
</script>

<style lang="scss" scoped>
.dropdown {
  position: relative;
  display: inline-block;

  &__menu {
    position: absolute;
    font-size: 2rem;
    width: 20rem;
    background: $gray-10;
    border: 1px solid $gray-20;
    border-radius: 0.5rem;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    list-style: none;
    z-index: 10;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    max-height: 25rem;
    overflow-y: auto;
  }

  &__item {
    padding: 1rem 1rem;
    cursor: pointer;
    transition: background 0.2s ease-in-out;

    &:hover {
      background: $gray-20;
    }
  }

  &__error {
    display: flex;
    align-items: center;
    margin-top: 8px;
    color: $gray-70;
    font-size: 1.2rem;

    p {
      margin-left: 8px;
    }
  }
}
</style>
