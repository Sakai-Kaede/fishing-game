<template>
  <div>
    <AtomsHamburgerMenu class="hamburger-menu" />
    <AtomsUserProfile class="user-profile" />
    <NuxtPage />
  </div>
</template>

<style scoped lang="scss">
.hamburger-menu {
  position: fixed;
  top: 2rem;
  left: 2rem;
  z-index: 1000;
}
.user-profile {
  position: fixed;
  top: 2rem;
  right: 2rem;
  z-index: 900;
}
</style>
