import { Poker } from "@/src/domain/Poker/Poker";
import { IPokerRepository } from "@/src/domain/Poker/Poker";
import { CardInterface } from "@/models/PokerModel";

export class ChangeAndCalculateHandUseCase {
  private pokerRepository: IPokerRepository;

  constructor(pokerRepository: IPokerRepository) {
    this.pokerRepository = pokerRepository;
  }

  public async execute(
    userId: string,
    swapIndices: number[]
  ): Promise<{ hand: CardInterface[]; score: number }> {
    const gameData = await this.pokerRepository.getGameData(userId);
    if (!gameData) throw new Error("ゲームデータが存在しません");
    if (!gameData.pokerFlag) {
      throw new Error("ポーカー状態ではありません");
    }
    const poker = new Poker(gameData.deck);
    let hand = gameData.hand;

    // 交換するカードがある場合は交換
    if (swapIndices.length > 0) {
      hand = poker.swapCards(hand, swapIndices);
    }
    const score = poker.calculateScore(hand, gameData.score);

    if (score === 0) {
    } else {
      await this.pokerRepository.updatePokerState(userId, false, true);
    }

    await this.pokerRepository.updateScore(userId, score);
    await this.pokerRepository.updateDeck(userId, poker.deck);

    return { hand, score };
  }
}
