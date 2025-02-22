<template>
  <div class="clerk" @click="handleClick">
    <img
      v-if="props.shopkeeperImage === 'normal'"
      src="@/assets/images/clerk/normal.png"
      alt="Normal"
    />
    <img
      v-if="props.shopkeeperImage === 'surprise'"
      src="@/assets/images/clerk/surprise.png"
      alt="Surprise"
    />
    <img
      v-if="props.shopkeeperImage === 'smile'"
      src="@/assets/images/clerk/smile.png"
      alt="Smile"
    />
  </div>
  <div v-if="props.showSpeechBubble" class="speech-bubble">
    {{ props.speechBubbleText }}
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  shopkeeperImage: {
    type: String,
    default: "normal",
    required: true,
  },
  speechBubbleText: {
    type: String,
    default: "いらっしゃいませ！",
    required: true,
  },
  showSpeechBubble: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["click"]);

const handleClick = () => {
  emit("click");
};
</script>

<style scoped lang="scss">
.clerk {
  position: relative;
  top: 3rem;
  cursor: pointer;
}
.speech-bubble {
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.5rem 1rem;
  background-color: $yellow-20;
  color: $gray-70;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  font-size: 2rem;
  white-space: nowrap;
  text-align: center;
}
</style>
