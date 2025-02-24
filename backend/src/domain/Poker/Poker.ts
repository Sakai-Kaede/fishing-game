import { Suit, Rank } from "@/config/types";
import { CardInterface } from "@/models/PokerModel";
import { IPokerGame } from "@/models/PokerModel";

export class Poker {
  HAND_SIZE = 5;
  PAYOUT_MULTIPLIERS: Record<string, number> = {
    "Straight Flush": 20,
    "Four of a Kind": 10,
    "Full House": 5,
    Flush: 4,
    Straight: 2,
    "Three of a Kind": 1,
    "Two Pair": 1,
    "High Card": 0,
  };

  constructor(public deck: CardInterface[]) {}

  private evaluateHand(hand: CardInterface[]): string {
    const rankCounts: Record<string, number> = {};
    const suitCounts: Record<string, number> = {};

    hand.forEach((card) => {
      rankCounts[card.rank] = (rankCounts[card.rank] || 0) + 1;
      suitCounts[card.suit] = (suitCounts[card.suit] || 0) + 1;
    });

    const isFlush = Object.values(suitCounts).some(
      (count) => count === this.HAND_SIZE
    );
    const rankValues = hand
      .map((card) => this.rankToValue(card.rank as Rank))
      .sort((a, b) => a - b);
    const isStraight = rankValues.every(
      (val, idx, arr) => idx === 0 || val === arr[idx - 1] + 1
    );

    if (isFlush && isStraight) return "Straight Flush";
    if (Object.values(rankCounts).includes(4)) return "Four of a Kind";
    if (
      Object.values(rankCounts).includes(3) &&
      Object.values(rankCounts).includes(2)
    )
      return "Full House";
    if (isFlush) return "Flush";
    if (isStraight) return "Straight";
    if (Object.values(rankCounts).includes(3)) return "Three of a Kind";
    if (Object.values(rankCounts).filter((count) => count === 2).length === 2)
      return "Two Pair";
    return "High Card";
  }

  public rankToValue(rank: Rank): number {
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
  public dealHand(): CardInterface[] {
    const hand = this.deck.splice(0, this.HAND_SIZE);
    return hand;
  }
  public swapCards(hand: CardInterface[], indices: number[]): CardInterface[] {
    indices.forEach((index) => {
      if (this.deck.length > 0) hand[index] = this.deck.pop()!;
    });
    return hand;
  }
  public calculateScore(hand: CardInterface[], bet: number): number {
    const handScore = this.evaluateHand(hand);
    const multiplier = this.PAYOUT_MULTIPLIERS[handScore] || 0;
    return bet * multiplier;
  }
  public drawDoubleUpCard(): CardInterface | null {
    return this.deck.length > 0 ? this.deck.pop()! : null;
  }
  public initializeDeck(): void {
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
  public shuffleDeck(): void {
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }
  }
  public compareCardValues(
    drawnCard: CardInterface,
    previousCard: CardInterface,
    guess: "higher" | "lower"
  ): boolean {
    const drawnValue = this.rankToValue(drawnCard.rank as Rank);
    const previousValue = this.rankToValue(previousCard.rank as Rank);

    return (
      (guess === "higher" && drawnValue > previousValue) ||
      (guess === "lower" && drawnValue < previousValue)
    );
  }
}

export interface IPokerRepository {
  /**
   * ポーカーのゲーム状態を更新します。
   *
   * @param userId ユーザーID
   * @param pokerFlag ポーカーフラグ（ゲーム中の状態）
   * @param doubleUpFlag ダブルアップフラグ（ダブルアップ可能な状態）
   * @throws ゲームデータの更新に失敗した場合、エラーが発生します。
   */
  updatePokerState(
    userId: string,
    pokerFlag: boolean,
    doubleUpFlag: boolean
  ): Promise<void>;

  /**
   * ユーザーのスコアを更新します。
   *
   * @param userId ユーザーID
   * @param score 更新するスコア
   * @throws スコアの更新に失敗した場合、エラーが発生します。
   */
  updateScore(userId: string, score: number): Promise<void>;

  /**
   * デッキ情報を更新します。
   *
   * @param userId ユーザーID
   * @param newDeck 新しいデッキ情報（カードの配列）
   * @throws デッキ情報の更新に失敗した場合、エラーが発生します。
   */
  updateDeck(userId: string, newDeck: CardInterface[]): Promise<void>;

  /**
   * ポーカーゲームデータを取得します。
   *
   * @param userId ユーザーID
   * @returns ユーザーのゲームデータ、存在しない場合は null
   * @throws ゲームデータの取得に失敗した場合、エラーが発生します。
   */
  getPokerData(userId: string): Promise<IPokerGame | null>;

  /**
   * 新規のポーカーゲームデータを作成します。
   *
   * @param userId ユーザーID
   * @param deck 初期デッキ情報
   * @param score 初期スコア
   * @returns 作成されたゲームデータ
   * @throws ゲームデータの作成に失敗した場合、エラーが発生します。
   */
  createPokerData(
    userId: string,
    deck: CardInterface[],
    score: number
  ): Promise<{
    userId: string;
    deck: CardInterface[];
    hand: CardInterface[];
    hasSwapped: boolean;
    score: number;
    pokerFlag: boolean;
    doubleUpFlag: boolean;
    doubleUpSuccessCount: number;
  }>;

  /**
   * ユーザーの手札情報を更新します。
   *
   * @param userId ユーザーID
   * @param newHand 更新する手札情報（カードの配列）
   * @throws 手札の枚数が5枚でない場合、または手札の更新に失敗した場合、エラーが発生します。
   */
  updateHand(userId: string, newHand: CardInterface[]): Promise<void>;

  /**
   * ダブルアップ時のカード情報を更新します。
   *
   * @param userId ユーザーID
   * @param doubleUpCard ダブルアップ時に引いたカード
   * @throws カード情報の更新に失敗した場合、エラーが発生します。
   */
  updateDoubleUpCard(
    userId: string,
    doubleUpCard: CardInterface
  ): Promise<void>;

  /**
   * ポーカーゲームデータをまとめて更新します。
   *
   * @param userId ユーザーID
   * @param updateData 更新するゲームデータ
   * @throws ゲームデータの更新に失敗した場合、エラーが発生します。
   */
  updatePokerData(
    userId: string,
    updateData: {
      deck: CardInterface[];
      hand: CardInterface[];
      hasSwapped: boolean;
      score: number;
      pokerFlag: boolean;
      doubleUpFlag: boolean;
      doubleUpCard: CardInterface;
      doubleUpSuccessCount: number;
    }
  ): Promise<void>;

  /**
   * ダブルアップ成功回数を1増加します。
   *
   * @param userId ユーザーID
   * @throws ユーザーIDが見つからない場合、または更新に失敗した場合、エラーが発生します。
   */
  incrementDoubleUpSuccessCount(userId: string): Promise<void>;
}
