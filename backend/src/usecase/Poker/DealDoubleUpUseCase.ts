import { Poker } from "../../domain/Poker/Poker";
import { IPokerRepository } from "../../domain/Poker/Poker";
import { CardInterface } from "../../models/PokerModel";
import { IUserRepository } from "../../domain/User/User";
import { User } from "../../domain/User/User";

export class DealDoubleUpUseCase {
  private pokerRepository: IPokerRepository;
  private userRepository: IUserRepository;

  constructor(
    pokerRepository: IPokerRepository,
    userRepository: IUserRepository
  ) {
    this.pokerRepository = pokerRepository;
    this.userRepository = userRepository;
  }

  public async execute(
    userId: string,
    isDoubleUp: boolean
  ): Promise<{ card?: CardInterface; updateSumScore?: number }> {
    const pokerData = await this.pokerRepository.getPokerData(userId);
    if (!pokerData) throw new Error("ゲームデータが存在しません");
    if (!pokerData.doubleUpFlag) {
      throw new Error("ダブルアップ状態ではありません");
    }
    if (!isDoubleUp) {
      // ダブルアップをスキップ
      await this.pokerRepository.updatePokerState(userId, false, false);
      const user = await this.userRepository.getUserById(userId);
      if (!user) {
        throw new Error(`ユーザーID ${userId} が見つかりません`);
      }
      const newUser = new User(
        undefined, // ユーザー名
        undefined, // パスワード
        undefined, // ユーザーID
        user.sumScore, // 合計スコア
        undefined, // 釣竿レベル
        undefined, // 捕まえた魚リスト
        undefined, // 実績
        undefined // 好きな魚
      );
      const updateSumScore = newUser.addScore(pokerData.score);
      await this.userRepository.updateSumScore(user.userId, updateSumScore);
      await this.userRepository.addPokerAchievements(userId, pokerData.score);
      return { updateSumScore };
    }

    let doubleUpCard;
    const poker = new Poker(pokerData.deck);
    if (
      pokerData.doubleUpCard.rank === "None" &&
      pokerData.doubleUpCard.suit === "None"
    ) {
      poker.shuffleDeck();
      doubleUpCard = poker.drawDoubleUpCard();
    } else {
      doubleUpCard = pokerData.doubleUpCard;
    }

    if (!doubleUpCard) throw new Error("デッキにカードがありません");
    await this.pokerRepository.updateDoubleUpCard(userId, doubleUpCard);
    await this.pokerRepository.updateDeck(userId, poker.deck);

    return { card: doubleUpCard };
  }
}
