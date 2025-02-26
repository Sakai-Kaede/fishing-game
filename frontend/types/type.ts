export interface User {
  username: string;
  userId: string;
  sumScore: number;
  fishingRodLevel: number;
  caughtFish: { name: string; count: number }[];
  achievements: {
    count: number;
    name: string;
    level: number;
    group: number;
  }[];
  message?: string;
}

export interface Ranking {
  username: string;
  sumScore: string;
  achievements: {
    count: number;
    name: string;
    level: number;
    group: number;
  }[];
}

export interface Card {
  suit: string;
  rank: string;
}

export interface PokerDeal {
  hand: Card[];
  updateSumScore: number;
}

export interface PokerResponse {
  success: boolean;
  message: string;
  POKER_DEAL: PokerDeal;
}

export interface CardWithId {
  suit: string;
  rank: string;
  _id: string;
}

export interface PokerResult {
  hand: CardWithId[];
  score: number;
}

export interface PokerResultResponse {
  success: boolean;
  message: string;
  POKER_RESULT: PokerResult;
}

export interface DoubleUpDealFalse {
  updateSumScore: number;
}

export interface DoubleUpFalseResponse {
  success: boolean;
  message: string;
  DOUBLEUP_DEAL: DoubleUpDealFalse;
}

export interface DoubleUpDealTrue {
  card: CardWithId;
}

export interface DoubleUpTrueResponse {
  success: boolean;
  message: string;
  DOUBLEUP_DEAL: DoubleUpDealTrue;
}

export interface DoubleUpResult {
  guessCorrect: boolean;
  drawnCard: CardWithId;
  newScore: number;
}

export interface DoubleUpResultResponse {
  success: boolean;
  message: string;
  DOUBLEUP_RESULT: DoubleUpResult;
}

export type TabKey = "図鑑" | "実績";

export interface Tab {
  key: TabKey;
  label: string;
  component: Component;
}

export interface Fish {
  name: string;
  score: number;
  requiredInteractions: number;
}

export interface FishDetails {
  fish: Fish;
  userId: string;
  randomId: string;
  isInvalid: boolean;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export type AchievementColor =
  | "gold"
  | "silver"
  | "bronze"
  | "purple"
  | "blue"
  | "gray";
