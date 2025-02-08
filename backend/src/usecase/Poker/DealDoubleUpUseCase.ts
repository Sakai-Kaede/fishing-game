import { Poker } from "@/src/domain/Poker/Poker";
import { IPokerRepository } from "@/src/domain/Poker/Poker";
import { CardInterface } from "@/models/PokerModel";
import { IUserRepository } from "@/src/domain/User/User";
import { User } from "@/src/domain/User/User";

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
  ): Promise<{ card?: CardInterface }> {
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
        undefined,
        undefined,
        undefined,
        user.sumScore,
        undefined,
        undefined,
        undefined
      );
      const updateSumScore = newUser.addScore(pokerData.score);
      await this.userRepository.updateSumScore(user.userId, updateSumScore);
      return {};
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
