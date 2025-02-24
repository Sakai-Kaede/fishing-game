import Clubs_A from "@/assets/images/cards/Clubs@A.png";
import Clubs_2 from "@/assets/images/cards/Clubs@2.png";
import Clubs_3 from "@/assets/images/cards/Clubs@3.png";
import Clubs_4 from "@/assets/images/cards/Clubs@4.png";
import Clubs_5 from "@/assets/images/cards/Clubs@5.png";
import Clubs_6 from "@/assets/images/cards/Clubs@6.png";
import Clubs_7 from "@/assets/images/cards/Clubs@7.png";
import Clubs_8 from "@/assets/images/cards/Clubs@8.png";
import Clubs_9 from "@/assets/images/cards/Clubs@9.png";
import Clubs_10 from "@/assets/images/cards/Clubs@10.png";
import Clubs_J from "@/assets/images/cards/Clubs@J.png";
import Clubs_Q from "@/assets/images/cards/Clubs@Q.png";
import Clubs_K from "@/assets/images/cards/Clubs@K.png";

import Diamonds_A from "@/assets/images/cards/Diamonds@A.png";
import Diamonds_2 from "@/assets/images/cards/Diamonds@2.png";
import Diamonds_3 from "@/assets/images/cards/Diamonds@3.png";
import Diamonds_4 from "@/assets/images/cards/Diamonds@4.png";
import Diamonds_5 from "@/assets/images/cards/Diamonds@5.png";
import Diamonds_6 from "@/assets/images/cards/Diamonds@6.png";
import Diamonds_7 from "@/assets/images/cards/Diamonds@7.png";
import Diamonds_8 from "@/assets/images/cards/Diamonds@8.png";
import Diamonds_9 from "@/assets/images/cards/Diamonds@9.png";
import Diamonds_10 from "@/assets/images/cards/Diamonds@10.png";
import Diamonds_J from "@/assets/images/cards/Diamonds@J.png";
import Diamonds_Q from "@/assets/images/cards/Diamonds@Q.png";
import Diamonds_K from "@/assets/images/cards/Diamonds@K.png";

import Hearts_A from "@/assets/images/cards/Hearts@A.png";
import Hearts_2 from "@/assets/images/cards/Hearts@2.png";
import Hearts_3 from "@/assets/images/cards/Hearts@3.png";
import Hearts_4 from "@/assets/images/cards/Hearts@4.png";
import Hearts_5 from "@/assets/images/cards/Hearts@5.png";
import Hearts_6 from "@/assets/images/cards/Hearts@6.png";
import Hearts_7 from "@/assets/images/cards/Hearts@7.png";
import Hearts_8 from "@/assets/images/cards/Hearts@8.png";
import Hearts_9 from "@/assets/images/cards/Hearts@9.png";
import Hearts_10 from "@/assets/images/cards/Hearts@10.png";
import Hearts_J from "@/assets/images/cards/Hearts@J.png";
import Hearts_Q from "@/assets/images/cards/Hearts@Q.png";
import Hearts_K from "@/assets/images/cards/Hearts@K.png";

import Spades_A from "@/assets/images/cards/Spades@A.png";
import Spades_2 from "@/assets/images/cards/Spades@2.png";
import Spades_3 from "@/assets/images/cards/Spades@3.png";
import Spades_4 from "@/assets/images/cards/Spades@4.png";
import Spades_5 from "@/assets/images/cards/Spades@5.png";
import Spades_6 from "@/assets/images/cards/Spades@6.png";
import Spades_7 from "@/assets/images/cards/Spades@7.png";
import Spades_8 from "@/assets/images/cards/Spades@8.png";
import Spades_9 from "@/assets/images/cards/Spades@9.png";
import Spades_10 from "@/assets/images/cards/Spades@10.png";
import Spades_J from "@/assets/images/cards/Spades@J.png";
import Spades_Q from "@/assets/images/cards/Spades@Q.png";
import Spades_K from "@/assets/images/cards/Spades@K.png";

export const CardImages = {
  Clubs_A,
  Clubs_2,
  Clubs_3,
  Clubs_4,
  Clubs_5,
  Clubs_6,
  Clubs_7,
  Clubs_8,
  Clubs_9,
  Clubs_10,
  Clubs_J,
  Clubs_Q,
  Clubs_K,
  Diamonds_A,
  Diamonds_2,
  Diamonds_3,
  Diamonds_4,
  Diamonds_5,
  Diamonds_6,
  Diamonds_7,
  Diamonds_8,
  Diamonds_9,
  Diamonds_10,
  Diamonds_J,
  Diamonds_Q,
  Diamonds_K,
  Hearts_A,
  Hearts_2,
  Hearts_3,
  Hearts_4,
  Hearts_5,
  Hearts_6,
  Hearts_7,
  Hearts_8,
  Hearts_9,
  Hearts_10,
  Hearts_J,
  Hearts_Q,
  Hearts_K,
  Spades_A,
  Spades_2,
  Spades_3,
  Spades_4,
  Spades_5,
  Spades_6,
  Spades_7,
  Spades_8,
  Spades_9,
  Spades_10,
  Spades_J,
  Spades_Q,
  Spades_K,
} as const;

// CardImageKeys 型を定義
export type CardImageKeys = keyof typeof CardImages;
