<template>
  <div v-if="props.isOpen" class="lightbox-overlay" @click.self="close">
    <div class="lightbox-content">
      <p class="lightbox-text">{{ message }}</p>
      <div class="lightbox-buttons">
        <AtomsButton
          variant="secondary"
          :size="props.buttonSize"
          @click="close"
          >{{ props.cancelText }}</AtomsButton
        >
        <AtomsButton
          variant="primary"
          :size="props.buttonSize"
          @click="confirm"
          >{{ props.confirmText }}</AtomsButton
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  isOpen: Boolean,
  message: String,
  confirmText: {
    type: String,
    default: "はい",
  },
  cancelText: {
    type: String,
    default: "いいえ",
  },
  buttonSize: {
    type: String,
    default: "medium",
  },
});

const emit = defineEmits(["confirm", "close"]);

const confirm = () => {
  emit("confirm");
};

const close = () => {
  emit("close");
};
</script>

<style scoped>
.lightbox-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.lightbox-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

.lightbox-text {
  margin-bottom: 16px;
}

.lightbox-buttons {
  display: flex;
  gap: 10px;
  justify-content: center;
}
</style>
