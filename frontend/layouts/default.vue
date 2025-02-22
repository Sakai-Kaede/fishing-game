<template>
  <div>
    <AtomsHamburgerMenu class="hamburger-menu" />
    <AtomsUserProfile class="user-profile" />
    <NuxtPage />
  </div>
</template>

<style scoped lang="scss">
.hamburger-menu {
  position: absolute;
  top: 2rem;
  left: 2rem;
}
.user-profile {
  position: absolute;
  top: 2rem;
  right: 2rem;
}
</style>
