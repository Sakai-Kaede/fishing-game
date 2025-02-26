<template>
  <div>
    <button
      class="image-button"
      :disabled="disabled"
      @mousedown="startShrink"
      @mouseup="endShrink"
      @mouseleave="endShrink"
      @click="handleClick"
    >
      <img
        :src="imageUrl"
        :alt="altText"
        :width="width"
        :class="{ shrink: isShrinking, disabled: disabled }"
      />
    </button>
  </div>
</template>

<script setup>
defineProps({
  imageUrl: {
    type: String,
    required: true,
  },
  altText: {
    type: String,
    default: "画像",
  },
  width: {
    type: [Number, String],
    default: "auto",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["button-clicked"]);

// クリック状態を管理
const isShrinking = ref(false);

// 縮小アニメーションを開始
const startShrink = () => {
  isShrinking.value = true;
};

const endShrink = () => {
  setTimeout(() => {
    isShrinking.value = false;
  }, 200);
};

const handleClick = () => {
  emit("button-clicked");
};
</script>

<style scoped lang="scss">
.image-button {
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;

  img {
    display: block;
    transition: transform 0.2s ease;
    transform: scale(1);
  }

  &:hover img {
    transform: scale(1.1);
  }

  img.shrink {
    transform: scale(0.9);
  }
}
</style>
