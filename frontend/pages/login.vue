<template>
  <div class="container">
    <LoginForm />
    <NuxtLink to="/register" class="nuxt-link">
      <AtomsButton size="large" variant="text_underline"
        >ユーザー登録はこちら</AtomsButton
      >
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import "@/assets/scss/main.scss";
</script>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  background-color: $blue-10;
  padding-top: 16px;
  box-sizing: border-box;
}

.nuxt-link {
  margin-top: 2.4rem;
}
</style>
