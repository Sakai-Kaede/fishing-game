<template>
  <Teleport to="body">
    <ol class="notification-list">
      <li
        v-for="notification in notifications"
        :key="notification.id"
        class="notification-item"
        :style="getBorderStyle(notification.level)"
      >
        <div class="notification-message">
          {{ notification.message }} の実績を解除しました
        </div>
      </li>
    </ol>
  </Teleport>
</template>

<script setup lang="ts">
import "@/assets/scss/main.scss";
import { useNotification } from "@/composable/useNotification";
const { notifications } = useNotification();

const getBorderStyle = (level: number) => {
  let borderColor = "##cbcbcb";
  let backgroundColor = "#ffffff";

  switch (level) {
    case 1:
      borderColor = "#587fb9";
      break;
    case 2:
      borderColor = "#b656b6";
      break;
    case 3:
      backgroundColor =
        "linear-gradient(45deg, #b87333 0%, #d1885e 45%, #f0c07b 70%, #d1885e 85%, #b87333 90% 100%)";
      break;
    case 4:
      backgroundColor =
        "linear-gradient(45deg, #757575 0%, #9e9e9e 45%, #e8e8e8 70%, #9e9e9e 85%, #757575 90% 100%)";
      break;
    case 5:
      backgroundColor =
        "linear-gradient(45deg, #b67b03 0%, #daaf08 45%, #fee9a0 70%, #daaf08 85%, #b67b03 90% 100%)";
      break;
  }

  return level <= 2
    ? {
        borderLeft: `2rem solid ${borderColor}`,
        background: backgroundColor,
      }
    : {
        background: backgroundColor,
      };
};
</script>

<style lang="scss" scoped>
.notification-list {
  position: fixed;
  bottom: 3rem;
  right: 0;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  padding: 0;
  gap: 1rem;
}

.notification-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease-in-out;
  background-color: $gray-10;
  color: $gray-80;
  font-size: 1rem;
  font-weight: bold;
}

// メッセージを大きめに表示
.notification-message {
  font-size: 1.5rem;
}
</style>
