<template>
  <div>
    <AtomsHamburgerMenu
      v-show="userStore.userId"
      class="hamburger-menu"
      :class="{ 'hamburger-menu--highlight': isHighlightedRoute }"
    />
    <AtomsUserProfile class="user-profile" />
    <NuxtPage />
    <MoleculesNotificationList />
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "@/store/user";

const userStore = useUserStore();
const route = useRoute();

const highlightedRoutes = ["/poker"];
const isHighlightedRoute = computed(() =>
  highlightedRoutes.includes(route.path)
);
</script>

<style scoped lang="scss">
.hamburger-menu {
  position: fixed;
  top: 2.5rem;
  left: 2.5rem;
  z-index: 1000;
}

.hamburger-menu--highlight {
  color: $gray-30;
}

.user-profile {
  position: fixed;
  top: 2rem;
  right: 2rem;
  z-index: 900;
}
</style>
