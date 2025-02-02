import { Card, Rank } from "@/config/types";

export class DoubleUp {
  private deck: Card[];

  constructor(deck: Card[]) {
    this.deck = deck;
    this.shuffleDeck();
  }

  private shuffleDeck(): void {
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }
  }

  public play(currentScore: number): number {
    if (this.deck.length < 2) {
      console.log("ダブルアップをするためのカードが足りません");
      return currentScore;
    }

    const currentCard = this.deck.pop()!;
    const nextCard = this.deck.pop()!;

    console.log(`現在のカード: ${currentCard.rank} の ${currentCard.suit}`);
    const guess = prompt(
      'Will the next card be higher or lower? (type "higher" or "lower")'
    )?.toLowerCase();

    if (!guess || (guess !== "higher" && guess !== "lower")) {
      console.log("無効な入力です。higherまたはlowerと入力してください。");
      return currentScore;
    }

    console.log(`次のカード: ${nextCard.rank} の ${nextCard.suit}`);

    const currentValue = this.rankToValue(currentCard.rank);
    const nextValue = this.rankToValue(nextCard.rank);

    const isCorrect =
      (guess === "higher" && nextValue > currentValue) ||
      (guess === "lower" && nextValue < currentValue);

    if (isCorrect) {
      const newScore = currentScore * 2;
      console.log(`新しいスコアは ${newScore} です！`);
      return newScore;
    } else {
      console.log("スコアが0になってしまいました...");
      return 0;
    }
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
}
