<template>
  <div class="fishing-hook">
    <img
      src="@/assets/images/tools/tsuri_hari.png"
      alt="Fishing Hook"
      class="hook-img"
      :class="{ 'hook-move-up': isFishCaught }"
    />
  </div>
</template>

<script setup lang="ts">
import "@/assets/scss/main.scss";
defineProps({
  isFishCaught: Boolean,
});
</script>

<style scoped lang="scss">
.hook-img {
  width: 5rem;
  position: absolute;
  bottom: 10px;
  transition: transform 1s ease-in-out;

  &.hook-move-up {
    animation: moveUpAndDown 6s ease-in-out forwards;
  }
}
</style>
