<template>
  <div class="container">
    <RankingBoard class="board"></RankingBoard>
  </div>
</template>

<script lang="ts">
import "@/assets/scss/main.scss";
</script>

<style scoped lang="scss">
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: $blue-10;

  .board {
    margin: 5rem;
  }
}
</style>
