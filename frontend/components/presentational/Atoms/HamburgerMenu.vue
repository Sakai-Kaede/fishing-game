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
          <NuxtLink to="/" active-class="active-link" @click.native="closeMenu">
            <PhosphorIconHouse size="2.5rem" />
            <span>ホーム</span>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink
            to="/fishing"
            active-class="active-link"
            @click.native="closeMenu"
          >
            <PhosphorIconFishSimple size="2.5rem" />
            <span>釣り</span>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink
            to="/poker"
            active-class="active-link"
            @click.native="closeMenu"
          >
            <PhosphorIconDiamond size="2.5rem" />
            <span>ポーカー</span>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink
            to="/ranking"
            active-class="active-link"
            @click.native="closeMenu"
          >
            <PhosphorIconTrophy size="2.5rem" />
            <span>ランキング</span>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink
            to="/illustratedBook"
            active-class="active-link"
            @click.native="closeMenu"
          >
            <PhosphorIconBook size="2.5rem" />
            <span>図鑑</span>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink
            to="/shop"
            active-class="active-link"
            @click.native="closeMenu"
          >
            <PhosphorIconStorefront size="2.5rem" />
            <span>釣竿店</span>
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
.active-link {
  background-color: $skyblue-60 !important;
  color: $gray-10 !important;
  padding: 0 2rem;
  border-radius: 10px;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.hamburger-button {
  position: absolute;
  top: 1rem;
  left: 1rem;
  width: 4.5rem;
  height: 4.5rem;
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
  align-items: flex-start;
  justify-content: flex-start;
  padding-top: 3rem;

  &.open {
    left: 0;
  }

  ul {
    list-style: none;
    padding: 0;
    width: 100%;
  }

  li {
    margin: 1.5rem 0;
    width: 100%;

    &:first-child a {
      margin-top: 8rem;
    }
  }

  a {
    display: flex;
    align-items: center;
    width: 100%;
    color: $gray-80;
    text-decoration: none;
    font-size: 2rem;
    font-weight: 500;
    text-align: left;
    padding: 1rem 2rem 1rem 4rem;
    transition: background-color 0.3s ease, color 0.3s ease;
    border-radius: 8px;
    box-sizing: border-box;

    svg {
      margin-right: 1rem;
    }

    &:hover {
      background-color: $skyblue-30;
    }
  }
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
