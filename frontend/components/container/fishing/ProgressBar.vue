<template>
  <div class="progress-container">
    <div
      class="progress-bar"
      :style="{
        width: progress + '%',
        backgroundColor: '#76c7c0',
      }"
    ></div>
  </div>
</template>

<script setup lang="ts">
import "@/assets/scss/main.scss";
defineProps<{
  progress: number;
}>();
</script>

<style scoped lang="scss">
.progress-container {
  width: 40%;
  height: 3rem;
  background-color: $gray-20;
  border-radius: 5px;
  overflow: hidden;
}

.progress-bar {
  height: 3rem;
  border-radius: 10px;
  transition: width 0.2s ease-in-out, background-color 0.2s ease-in-out;
}
</style>
