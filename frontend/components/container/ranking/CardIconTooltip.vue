<template>
  <AtomsTooltip>
    <template #target>
      <RankingCardIcon :color="color"></RankingCardIcon>
    </template>
    <template #text>{{ tooltipText }}</template>
  </AtomsTooltip>
</template>

<script lang="ts">
export default defineComponent({
  props: {
    tooltipText: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
  },
});
</script>

<style scoped lang="scss"></style>
