<template>
  <nav class="tabs-nav">
    <ul class="tabs-list">
      <li
        v-for="tab in tabs"
        :key="tab.key"
        class="tab-item"
        @click="currentTab = tab.key"
      >
        <IllustratedBookTabLink :tab="tab" :currentTab="currentTab" />
      </li>
    </ul>
  </nav>
  <component :is="currentTabComponent" class="tab-content" />
</template>
<script setup lang="ts">
import "@/assets/scss/main.scss";
import Achievement from "@/components/container/illustratedBook/Achievement.vue";
import Fish from "@/components/container/illustratedBook/Fish.vue";
import type { Tab, TabKey } from "@/types/type";
const tabs: Tab[] = [
  { key: "図鑑", label: "図鑑", component: Fish },
  { key: "実績", label: "実績", component: Achievement },
];

const currentTab = ref<TabKey>("図鑑");
const currentTabComponent = computed(
  () => tabs.find((tab) => tab.key === currentTab.value)?.component
);
</script>

<style scoped lang="scss">
.tabs-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  text-align: center;
  padding-bottom: 2rem;
  background-color: $yellow-20;
  min-height: 15vh;
}

.tabs-list {
  display: flex;
  justify-content: center;
  padding: 0;
  list-style: none;
}

.tab-item {
  cursor: pointer;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border-radius: 0.375rem;
  margin: 0 0.25rem;
  transition: all 0.3s ease;
  color: #4b5563;
  border: 1px solid transparent;
}
</style>
