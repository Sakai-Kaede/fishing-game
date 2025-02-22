<template>
  <div>
    <PhosphorIconList
      v-if="!isOpen"
      class="hamburger-button"
      @click="toggleMenu"
    />
    <PhosphorIconX v-if="isOpen" class="hamburger-button" @click="toggleMenu" />

    <nav class="sidebar" :class="{ open: isOpen }">
      <ul>
        <li>
          <NuxtLink to="/">
            <span>ホーム</span>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/ranking">
            <span>ランキング</span>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/shop">
            <span>釣り道具店</span>
          </NuxtLink>
        </li>
      </ul>
    </nav>

    <div v-if="isOpen" class="overlay" @click="closeMenu"></div>
  </div>
</template>

<script setup lang="ts">
import "@/assets/scss/main.scss";
const isOpen = ref(false);

const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};

const closeMenu = () => {
  isOpen.value = false;
};
</script>

<style scoped lang="scss">
.hamburger-button {
  position: absolute;
  width: 5rem;
  height: 5rem;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 1000;
}

.sidebar {
  position: fixed;
  top: 0;
  left: -25rem;
  width: 25rem;
  height: 100vh;
  background: $skyblue-20;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.2);
  transition: left 0.3s ease-in-out;
  z-index: 999;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.sidebar.open {
  left: 0;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar li {
  margin: 4rem 0;
}

.sidebar a {
  color: $gray-80;
  text-decoration: none;
  font-size: 2.5rem;
  font-weight: bold;
  transition: opacity 0.3s;
}

.sidebar a:hover {
  opacity: 0.7;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 900;
}
</style>
