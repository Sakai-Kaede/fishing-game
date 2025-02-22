<template>
  <div class="shop-container">
    <div class="shop-background">
      <div class="clerk-background">
        <ShopClerk
          :shopkeeperImage="shopkeeperImage"
          :speechBubbleText="speechBubbleText"
          :showSpeechBubble="showSpeechBubble"
          @click="showRandomGreeting"
        />
      </div>
      <div class="item-list">
        <div class="item">
          <span class="price-text">1000円</span>
          <ShopFishingRodUpdateButton
            :level="5"
            class="button"
            @click="onReactionHandling(5, userStore.sumScore < 1000)"
          />
        </div>
        <div class="item">
          <span class="price-text">3000円</span>
          <ShopFishingRodUpdateButton
            :level="10"
            class="button"
            @click="onReactionHandling(10, userStore.sumScore < 3000)"
          />
        </div>
        <div class="item">
          <span class="price-text">5000円</span>
          <ShopFishingRodUpdateButton
            :level="20"
            class="button"
            @click="onReactionHandling(20, userStore.sumScore < 5000)"
          />
        </div>
      </div>

      <p v-if="isDataLoaded" class="money-possessed">
        所持金: {{ userStore.sumScore }}円
      </p>
      <p v-else>Loading...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useUserStore } from "@/store/user";
import "@/assets/scss/main.scss";

const userStore = useUserStore();

const shopkeeperImage = ref("normal");
const speechBubbleText = ref("いらっしゃいませ！");
const isDataLoaded = ref(false);
const showSpeechBubble = ref(false);
let timeoutId: ReturnType<typeof setTimeout> | null = null;

const messages = ["釣り日和ですね！", "ゆっくり見て行ってください"];

const showRandomGreeting = () => {
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];
  showGreeting(randomMessage, "smile");
};

const onReactionHandling = (reqLevel: number, notEnoughError: boolean) => {
  if (notEnoughError) {
    showGreeting("おっと！所持金がたりません", "surprise");
  } else if (userStore.fishingRodLevel >= reqLevel) {
    showGreeting("その釣竿を買っても、レベルは上がりませんよ", "surprise");
  } else {
    switch (reqLevel) {
      case 5:
        purchaseRod("お買い上げありがとうございます！", 1000, 5);
        break;
      case 10:
        purchaseRod("お選びいただきありがとうございます！", 3000, 10);
        break;
      case 20:
        purchaseRod(
          "お買い上げありがとうございます。最高の釣竿です！",
          5000,
          20
        );
        break;
    }
  }
};

const purchaseRod = (message: string, price: number, level: number) => {
  showGreeting(message, "smile");
  userStore.sumScore -= price;
  userStore.fishingRodLevel = level;
};

const showGreeting = (message: string, imageUrl: string) => {
  if (timeoutId) clearTimeout(timeoutId);

  speechBubbleText.value = message;
  shopkeeperImage.value = imageUrl;
  showSpeechBubble.value = true;

  timeoutId = setTimeout(() => {
    showSpeechBubble.value = false;
    speechBubbleText.value = "いらっしゃいませ！";
    shopkeeperImage.value = "normal";
    timeoutId = null;
  }, 3000);
};

onMounted(async () => {
  await userStore.getUserData();
  isDataLoaded.value = true;
  showGreeting("いらっしゃいませ！", "normal");
});
</script>

<style scoped lang="scss">
.shop-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: $yellow-10;
}
.shop-background {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background-color: $orange-20;
  border: 2px solid $orange-60;
  width: 70rem;
  padding: 2rem;
  position: relative;
  height: 100%;
}

.clerk-background {
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url("@/assets/images/background/ocean.jpg");
  background-size: cover;
  background-position: center;
  border: 2px solid $orange-60;
  width: 65rem;
  height: 50%;
  overflow: hidden;
}

.item-list {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 65rem;
  height: 50%;
}

.item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 1rem 0;

  .price-text {
    font-size: 2rem;
    padding-right: 1rem;
  }
}

.money-possessed {
  font-size: 1.5rem;
  margin-top: 1rem;
}
</style>
