import { Suit, Card, Rank } from "@/config/types";

export class Poker {
  private deck: Card[] = [];
  private hand: Card[] = [];
  private hasSwapped: boolean = false;

  constructor() {
    this.initializeDeck();
  }

  private initializeDeck(): void {
    const suits: Suit[] = ["Hearts", "Diamonds", "Clubs", "Spades"];
    const ranks: Rank[] = [
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "J",
      "Q",
      "K",
      "A",
    ];

    this.deck = suits.flatMap((suit) => ranks.map((rank) => ({ suit, rank })));
    this.shuffleDeck();
  }

  private shuffleDeck(): void {
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }
  }

  public dealHand(): void {
    this.hand = this.deck.splice(0, 5);
    console.log("初手:", this.hand);
  }

  public swapCards(indices: number[]): void {
    if (this.hasSwapped) {
      console.log("カードの交換は一度しかできません");
      return;
    }

    if (indices.some((index) => index < 0 || index >= this.hand.length)) {
      console.log("カード交換のインデックスが無効です");
      return;
    }

    indices.forEach((index) => {
      this.hand[index] = this.deck.pop()!;
    });

    this.hasSwapped = true;
    console.log("交換後の新しい手札:", this.hand);
  }

  public evaluateHand(): void {
    const rankCounts: Record<string, number> = {};
    const suitCounts: Record<string, number> = {};

    this.hand.forEach((card) => {
      rankCounts[card.rank] = (rankCounts[card.rank] || 0) + 1;
      suitCounts[card.suit] = (suitCounts[card.suit] || 0) + 1;
    });

    const isFlush = Object.values(suitCounts).some((count) => count === 5);
    const rankValues = this.hand
      .map((card) => this.rankToValue(card.rank))
      .sort((a, b) => a - b);
    const isStraight = rankValues.every(
      (val, idx, arr) => idx === 0 || val === arr[idx - 1] + 1
    );

    let handScore = "";
    if (isFlush && isStraight) handScore = "Straight Flush";
    else if (Object.values(rankCounts).includes(4))
      handScore = "Four of a Kind";
    else if (
      Object.values(rankCounts).includes(3) &&
      Object.values(rankCounts).includes(2)
    )
      handScore = "Full House";
    else if (isFlush) handScore = "Flush";
    else if (isStraight) handScore = "Straight";
    else if (Object.values(rankCounts).includes(3))
      handScore = "Three of a Kind";
    else if (
      Object.values(rankCounts).filter((count) => count === 2).length === 2
    )
      handScore = "Two Pair";
    else if (Object.values(rankCounts).includes(2)) handScore = "One Pair";
    else handScore = "High Card";

    console.log(`手札の評価: ${handScore}`);
  }

  private rankToValue(rank: Rank): number {
    const rankMap: Record<Rank, number> = {
      "2": 2,
      "3": 3,
      "4": 4,
      "5": 5,
      "6": 6,
      "7": 7,
      "8": 8,
      "9": 9,
      "10": 10,
      J: 11,
      Q: 12,
      K: 13,
      A: 14,
    };
    return rankMap[rank];
  }
  public calculatePayout(bet: number): number {
    const handScore = this.evaluateCurrentHand();
    const payoutMultipliers: Record<string, number> = {
      "Straight Flush": 50,
      "Four of a Kind": 25,
      "Full House": 10,
      Flush: 8,
      Straight: 5,
      "Three of a Kind": 3,
      "Two Pair": 2,
      "One Pair": 1,
      "High Card": 0,
    };

    const multiplier = payoutMultipliers[handScore] || 0;
    return bet * multiplier;
  }

  private evaluateCurrentHand(): string {
    const rankCounts: Record<string, number> = {};
    const suitCounts: Record<string, number> = {};

    this.hand.forEach((card) => {
      rankCounts[card.rank] = (rankCounts[card.rank] || 0) + 1;
      suitCounts[card.suit] = (suitCounts[card.suit] || 0) + 1;
    });

    const isFlush = Object.values(suitCounts).some((count) => count === 5);
    const rankValues = this.hand
      .map((card) => this.rankToValue(card.rank))
      .sort((a, b) => a - b);
    const isStraight = rankValues.every(
      (val, idx, arr) => idx === 0 || val === arr[idx - 1] + 1
    );

    if (isFlush && isStraight) return "Straight Flush";
    else if (Object.values(rankCounts).includes(4)) return "Four of a Kind";
    else if (
      Object.values(rankCounts).includes(3) &&
      Object.values(rankCounts).includes(2)
    )
      return "Full House";
    else if (isFlush) return "Flush";
    else if (isStraight) return "Straight";
    else if (Object.values(rankCounts).includes(3)) return "Three of a Kind";
    else if (
      Object.values(rankCounts).filter((count) => count === 2).length === 2
    )
      return "Two Pair";
    else if (Object.values(rankCounts).includes(2)) return "One Pair";
    return "High Card";
  }
}
