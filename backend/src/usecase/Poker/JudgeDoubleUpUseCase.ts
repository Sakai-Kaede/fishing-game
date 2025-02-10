import { Rank } from "@/config/types";
import { Poker } from "@/src/domain/Poker/Poker";
import { IPokerRepository } from "@/src/domain/Poker/Poker";
import { CardInterface } from "@/models/PokerModel";
import { IUserRepository } from "@/src/domain/User/User";
import { User } from "@/src/domain/User/User";

export class JudgeDoubleUpUseCase {
  private static readonly MAX_DOUBLE_UP_SUCCESS = 10;
  constructor(
    private pokerRepository: IPokerRepository,
    private userRepository: IUserRepository
  ) {}

  public async execute(
    userId: string,
    guess: "higher" | "lower"
  ): Promise<{
    guessCorrect: boolean;
    drawnCard: CardInterface;
    newScore: number;
    updateSumScore?: number;
  }> {
    const pokerData = await this.pokerRepository.getPokerData(userId);
    if (!pokerData || !pokerData.doubleUpCard) {
      throw new Error("ダブルアップカードが設定されていません");
    }
    if (!pokerData.doubleUpFlag) {
      throw new Error("ダブルアップ状態ではありません");
    }

    const poker = new Poker(pokerData.deck);
    const drawnCard = poker.drawDoubleUpCard();

    if (!drawnCard) throw new Error("デッキにカードがありません");

    await this.pokerRepository.updateDeck(userId, poker.deck);
    await this.pokerRepository.updateDoubleUpCard(userId, drawnCard);

    const previousCard = pokerData.doubleUpCard;
    let newScore = pokerData.score;
    let guessCorrect = false;

    if (
      poker.rankToValue(drawnCard.rank as Rank) !==
      poker.rankToValue(previousCard.rank as Rank)
    ) {
      guessCorrect = poker.compareCardValues(drawnCard, previousCard, guess);
      newScore = guessCorrect ? pokerData.score * 2 : 0;
    } else {
      return { guessCorrect: true, drawnCard, newScore: 0 };
    }

    if (guessCorrect) {
      await this.pokerRepository.incrementDoubleUpSuccessCount(userId);
    } else {
      await this.pokerRepository.updatePokerState(userId, false, false);
    }

    if (
      guessCorrect &&
      // 10回目の成功
      pokerData.doubleUpSuccessCount + 1 ===
        JudgeDoubleUpUseCase.MAX_DOUBLE_UP_SUCCESS
    ) {
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
      // スコアをダブルアップして、保存する
      newScore = newUser.addScore(newScore * 2);
      const updateSumScore = await this.userRepository.updateSumScore(
        user.userId,
        newScore
      );
      await this.userRepository.addPokerAchievements(userId, newScore);
      await this.pokerRepository.updatePokerState(userId, false, false);
      return { guessCorrect, drawnCard, newScore, updateSumScore };
    }

    await this.pokerRepository.updateScore(userId, newScore);

    return { guessCorrect, drawnCard, newScore };
  }
}
