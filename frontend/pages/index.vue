<template>
  <NuxtLink to="/login">
    <PhosphorIconSignIn class="login" size="100" />
  </NuxtLink>
  <NuxtLink to="/ranking">
    <img
      src="@/assets/images/naviIcon/trophy.png"
      alt="トロフィー"
      class="trophy-icon"
    />
  </NuxtLink>
  <NuxtLink to="/shop">
    <img src="@/assets/images/naviIcon/shop.png" alt="お店" class="shop-icon" />
  </NuxtLink>
  <NuxtLink to="/poker">
    <img
      src="@/assets/images/naviIcon/poker.png"
      alt="ポーカー"
      class="shop-icon"
    />
  </NuxtLink>
  <NuxtLink to="/illustratedBook">
    <img src="@/assets/images/naviIcon/illustratedBook.png" alt="図鑑" />
  </NuxtLink>
  <NuxtLink to="/fishing">
    <img src="@/assets/images/naviIcon/fishing.png" alt="釣り" />
  </NuxtLink>
</template>

<script setup lang="ts"></script>

<style></style>
