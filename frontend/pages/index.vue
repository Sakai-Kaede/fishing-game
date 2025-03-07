<template>
  <div class="home-wrapper">
    <div class="background-gradient">
      <div class="wave-container">
        <img :src="waveImage" alt="波" class="wave wave-top" />
        <img :src="waveImage" alt="波" class="wave wave-bottom" />
      </div>
      <div class="navigation-container">
        <div class="bottom-row">
          <NuxtLink
            v-for="link in topLinks"
            :key="link.to"
            :to="link.to"
            v-bind="linkProps(link.to)"
            class="nuxt-link"
          >
            <div
              class="animated-image-button"
              :style="{ width: link.size + 'rem' }"
            >
              <img :src="link.imgSrc" :alt="link.alt" />
              <span class="icon-label">{{ link.alt }}</span>
            </div>
          </NuxtLink>
        </div>
        <div class="top-row">
          <NuxtLink
            v-for="link in bottomLinks"
            :key="link.to"
            :to="link.to"
            v-bind="linkProps(link.to)"
            class="nuxt-link"
          >
            <div
              class="animated-image-button"
              :style="{ width: link.size + 'rem' }"
            >
              <PhosphorIconSignIn
                v-if="link.to === '/login'"
                class="login"
                size="100"
              />
              <template v-else>
                <img :src="link.imgSrc" :alt="link.alt" :class="link.class" />
                <span class="icon-label large">{{ link.alt }}</span>
              </template>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import "@/assets/scss/main.scss";
import { useUserStore } from "@/store/user";
import waveImg from "@/assets/images/tools/wave.svg";
import trophyImg from "@/assets/images/naviIcon/trophy.png";
import shopImg from "@/assets/images/naviIcon/shop.png";
import pokerImg from "@/assets/images/naviIcon/poker.png";
import fishingImg from "@/assets/images/naviIcon/fishing.png";
import illustratedBookImg from "@/assets/images/naviIcon/illustratedBook.png";

const userStore = useUserStore();
const waveImage = ref(waveImg);

const isUserLoggedIn = ref(false);
onMounted(() => {
  isUserLoggedIn.value = !!userStore.userId;
});

const linkProps = (to: string) => ({
  class: { disabled: !isUserLoggedIn.value },
  style: {
    pointerEvents: isUserLoggedIn.value || to === "/login" ? "auto" : "none",
    opacity: isUserLoggedIn.value || to === "/login" ? 1 : 0.5,
  },
});

const topLinks = [
  { to: "/fishing", imgSrc: fishingImg, alt: "釣り", size: 35 },
  { to: "/poker", imgSrc: pokerImg, alt: "ポーカー", size: 30 },
  {
    to: "/ranking",
    imgSrc: trophyImg,
    alt: "ランキング",
    class: "trophy-icon",
    size: 20,
  },
];

const bottomLinks = [
  { to: "/login", size: 15 },
  {
    to: "/shop",
    imgSrc: shopImg,
    alt: "釣竿店",
    class: "shop-icon",
    size: 20,
  },
  { to: "/illustratedBook", imgSrc: illustratedBookImg, alt: "図鑑", size: 25 },
];
</script>

<style scoped lang="scss">
.background-gradient {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, #ffaf87, #ff8284);
  z-index: -3;
}

.wave-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: -2;

  .wave {
    position: absolute;
    width: 200%;
    height: auto;
    animation: wave-animation 10s infinite linear;

    &-top {
      bottom: 0.5rem;
      animation-delay: -1s;
      filter: brightness(0.8);
    }

    &-bottom {
      bottom: 0;
      animation-delay: 0s;
    }
  }
}

.navigation-container {
  display: flex;
  flex-direction: column;
  gap: 3rem;
  padding: 3rem;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 15px;

  .top-row,
  .bottom-row {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 3rem;
  }

  .nuxt-link {
    transition: transform 0.2s ease-in-out;
    &:hover {
      transform: scale(1.1);
    }
  }

  .animated-image-button {
    position: relative;
    height: auto;
    padding: 10px;
    background: linear-gradient(145deg, #ffe27a, #e6b800);
    border-radius: 15px;
    box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.3),
      inset -4px -4px 8px rgba(255, 255, 255, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 100%;
      height: auto;
      filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.2));
    }

    .icon-label {
      position: absolute;
      font-size: 4rem;
      font-weight: bold;
      color: $gray-20;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
      -webkit-text-stroke: 2px $gray-80;
    }
  }
}
</style>
