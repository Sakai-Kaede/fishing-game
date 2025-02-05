import { Suit, Rank } from "@/config/types";
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
  ): Promise<{ guessCorrect: boolean; drawnCard: CardInterface }> {
    const gameData = await this.pokerRepository.getGameData(userId);
    if (!gameData || !gameData.doubleUpCard) {
      throw new Error("ダブルアップカードが設定されていません");
    }
    if (!gameData.doubleUpFlag) {
      throw new Error("ダブルアップ状態ではありません");
    }

    const poker = new Poker(gameData.deck);
    const drawnCard = poker.drawDoubleUpCard();

    if (!drawnCard) throw new Error("デッキにカードがありません");

    await this.pokerRepository.updateDeck(userId, poker.deck);
    await this.pokerRepository.updateDoubleUpCard(userId, drawnCard);

    const previousCard = gameData.doubleUpCard;
    let newScore = gameData.score;
    let guessCorrect = false;

    if (
      poker.rankToValue(drawnCard.rank as Rank) !==
      poker.rankToValue(previousCard.rank as Rank)
    ) {
      guessCorrect = poker.compareCardValues(drawnCard, previousCard, guess);
      newScore = guessCorrect ? gameData.score * 2 : 0;
    } else {
      return { guessCorrect: true, drawnCard };
    }

    if (guessCorrect) {
      await this.pokerRepository.incrementDoubleUpSuccessCount(userId);
    } else {
      await this.pokerRepository.updatePokerState(userId, false, false);
    }

    if (
      guessCorrect &&
      // 10回目の成功
      gameData.doubleUpSuccessCount + 1 ===
        JudgeDoubleUpUseCase.MAX_DOUBLE_UP_SUCCESS
    ) {
      const user = await this.userRepository.getUserById(userId);
      if (!user) {
        throw new Error(`ユーザーID ${userId} が見つかりません`);
      }
      const newUser = new User(
        undefined,
        undefined,
        undefined,
        user.sumScore,
        undefined,
        undefined,
        undefined
      );
      // スコアをダブルアップして、保存する
      const updateSumScore = newUser.addScore(newScore * 2);
      await this.userRepository.updateSumScore(user.userId, updateSumScore);
      await this.pokerRepository.updatePokerState(userId, false, false);
    }

    await this.pokerRepository.updateScore(userId, newScore);

    return { guessCorrect, drawnCard };
  }
}
