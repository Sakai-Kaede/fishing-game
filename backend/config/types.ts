export interface FishInterface {
  name: string;
  score: number;
  frequency: number;
  requiredInteractions: number;
  CatchableMinDepth: number;
  CatchableMaxDepth: number;
}
export interface Card {
  suit: Suit;
  rank: Rank;
}

export type Suit = "Hearts" | "Diamonds" | "Clubs" | "Spades";
export type Rank =
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "J"
  | "Q"
  | "K"
  | "A";
