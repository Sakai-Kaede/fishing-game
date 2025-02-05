import PokerGameModel, { IPokerGame } from "@/models/PokerModel";
import { CardInterface } from "@/models/PokerModel";

export class PokerRepository {
  private static readonly HAND_SIZE = 5;

  public async createPokerData(
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
  }> {
    try {
      const hand = deck.splice(0, PokerRepository.HAND_SIZE);
      if (hand.length !== PokerRepository.HAND_SIZE) {
        throw new Error(
          "手札が5枚揃っていません。デッキに十分なカードがありません。"
        );
      }
      const newPokerData = new PokerGameModel({
        userId,
        deck,
        hand,
        hasSwapped: false,
        score,
        pokerFlag: false,
        doubleUpFlag: false,
      });
      const savedPokerData = await newPokerData.save();

      return { ...savedPokerData.toObject() };
    } catch (err) {
      console.error("ゲームデータ作成エラー:", err);
      throw new Error("ゲームデータ作成に失敗しました");
    }
  }

  public async updatePokerData(
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
  ): Promise<void> {
    try {
      if (updateData.hand.length !== PokerRepository.HAND_SIZE) {
        throw new Error("手札は必ず5枚である必要があります");
      }
      await PokerGameModel.updateOne({ userId }, { $set: updateData });
    } catch (error) {
      console.error("ゲームデータ更新エラー:", error);
      throw new Error("ゲームデータの更新に失敗しました");
    }
  }

  public async updatePokerState(
    userId: string,
    pokerFlag: boolean,
    doubleUpFlag: boolean
  ): Promise<void> {
    await PokerGameModel.updateOne(
      { userId },
      { $set: { pokerFlag, doubleUpFlag } }
    );
  }

  public async updateScore(userId: string, score: number): Promise<void> {
    await PokerGameModel.updateOne({ userId }, { $set: { score } });
  }

  public async updateDeck(
    userId: string,
    newDeck: CardInterface[]
  ): Promise<void> {
    await PokerGameModel.updateOne({ userId }, { $set: { deck: newDeck } });
  }

  public async getPokerData(userId: string): Promise<IPokerGame | null> {
    return await PokerGameModel.findOne({ userId });
  }

  public async updateHand(
    userId: string,
    newHand: CardInterface[]
  ): Promise<void> {
    try {
      if (newHand.length !== PokerRepository.HAND_SIZE) {
        throw new Error("手札は必ず5枚である必要があります");
      }
      const pokerData = await PokerGameModel.findOne({ userId });
      if (!pokerData) throw new Error("ゲームデータが見つかりません");

      await PokerGameModel.updateOne(
        { userId },
        { $set: { hand: newHand, hasSwapped: true } }
      );
    } catch (error) {
      console.error("手札更新エラー:", error);
      throw new Error("手札の更新に失敗しました");
    }
  }

  public async updateDoubleUpCard(
    userId: string,
    doubleUpCard: CardInterface
  ): Promise<void> {
    await PokerGameModel.updateOne({ userId }, { $set: { doubleUpCard } });
  }

  public async incrementDoubleUpSuccessCount(userId: string): Promise<void> {
    try {
      const result = await PokerGameModel.updateOne(
        { userId },
        { $inc: { doubleUpSuccessCount: 1 } }
      );
      if (result.modifiedCount === 0) {
        throw new Error("ユーザーIDが見つかりません。更新できませんでした。");
      }
    } catch (error) {
      console.error("doubleUpSuccessCount 更新エラー:", error);
      throw new Error("doubleUpSuccessCount の更新に失敗しました");
    }
  }
}
