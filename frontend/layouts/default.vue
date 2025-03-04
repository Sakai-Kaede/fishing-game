<template>
  <div>
    <AtomsHamburgerMenu v-show="userStore.userId" class="hamburger-menu" />
    <AtomsUserProfile class="user-profile" />
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "@/store/user";
const userStore = useUserStore();
</script>

<style scoped lang="scss">
.hamburger-menu {
  position: fixed;
  top: 2.5rem;
  left: 2.5rem;
  z-index: 1000;
}
.user-profile {
  position: fixed;
  top: 2rem;
  right: 2rem;
  z-index: 900;
}
</style>
