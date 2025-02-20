<template>
  <AtomsTooltip>
    <template #target>
      <AtomsFishIcon :color="color"></AtomsFishIcon>
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
