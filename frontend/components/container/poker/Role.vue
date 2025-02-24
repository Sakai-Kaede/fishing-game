<template>
  <div class="poker-role">
    <div
      v-for="(role, index) in pokerRoles"
      :key="index"
      class="card-hand"
      :class="role.class"
    >
      <div class="role-info">
        <span class="role-title">{{ role.title }}</span>
        <span class="role-description">{{ role.description }}</span>
      </div>
      <div class="card-container">
        <img
          v-for="(card, i) in role.cards"
          :key="i"
          :src="CardImages[card]"
          alt="Card Image"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import "@/assets/scss/main.scss";
import { CardImages } from "@/constants/CardImages";
import type { CardImageKeys } from "@/constants/CardImages";

const pokerRoles = [
  {
    title: "ストレートフラッシュ - 20倍",
    description: "同じスーツのカードが連続したランクで並んだ手。",
    class: "straight-flush",
    cards: [
      "Spades_5",
      "Spades_6",
      "Spades_7",
      "Spades_8",
      "Spades_9",
    ] as CardImageKeys[],
  },
  {
    title: "4カード - 10倍",
    description: "同じランクのカードが4枚揃った手。",
    class: "four-card",
    cards: [
      "Spades_7",
      "Diamonds_7",
      "Clubs_7",
      "Hearts_7",
      "Spades_2",
    ] as CardImageKeys[],
  },
  {
    title: "フルハウス - 5倍",
    description:
      "同じランクのカード3枚と、別の同じランクのカード2枚が揃った手。",
    class: "full-house",
    cards: [
      "Spades_3",
      "Diamonds_3",
      "Clubs_3",
      "Spades_5",
      "Diamonds_5",
    ] as CardImageKeys[],
  },
  {
    title: "フラッシュ - 4倍",
    description:
      "同じスーツのカードが5枚揃った手。ただし、ランクが連続していない。",
    class: "flush",
    cards: [
      "Spades_2",
      "Spades_4",
      "Spades_6",
      "Spades_8",
      "Spades_10",
    ] as CardImageKeys[],
  },
  {
    title: "ストレート - 2倍",
    description:
      "ランクが連続した5枚のカードが揃った手。ただし、スーツは異なる。",
    class: "straight",
    cards: [
      "Spades_4",
      "Diamonds_5",
      "Clubs_6",
      "Spades_7",
      "Spades_8",
    ] as CardImageKeys[],
  },
  {
    title: "3カード - 1倍",
    description: "同じランクのカードが3枚揃った手。",
    class: "three-card",
    cards: [
      "Spades_9",
      "Diamonds_9",
      "Clubs_9",
      "Hearts_2",
      "Spades_3",
    ] as CardImageKeys[],
  },
  {
    title: "2ペア - 1倍",
    description: "同じランクのカードが2枚のペアが2組揃った手。",
    class: "two-pair",
    cards: [
      "Spades_4",
      "Diamonds_4",
      "Spades_7",
      "Clubs_7",
      "Spades_9",
    ] as CardImageKeys[],
  },
];
</script>

<style scoped lang="scss">
.poker-role {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.card-hand {
  width: 90%;
  max-width: 600px;
  padding: 1.2rem;
  border-radius: 0.8rem;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.role-title {
  font-size: 1.8rem;
  font-weight: bold;
  color: $gray-80;
  display: block;
}

.role-description {
  margin-top: 0.5rem;
  font-size: 1.4rem;
  color: $gray-80;
  margin-bottom: 1rem;
  display: block;
}

.card-container {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.card-container img {
  width: 4.5rem;
  height: 6.5rem;
  border-radius: 4px;
  object-fit: contain;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.3);
}

/* 背景色 */
.straight-flush {
  background-color: $sunshine_blue;
}
.four-card {
  background-color: $sunshine_yellow;
}
.full-house {
  background-color: $sunshine_green;
}
.flush {
  background-color: $sunshine_blue;
}
.straight {
  background-color: $sunshine_yellow;
}
.three-card {
  background-color: $sunshine_green;
}
.two-pair {
  background-color: $sunshine_blue;
}
</style>
