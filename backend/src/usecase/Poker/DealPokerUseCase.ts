import { Poker } from "../../domain/Poker/Poker";
import { User } from "../../domain/User/User";
import { IPokerRepository } from "../../domain/Poker/Poker";
import { IUserRepository } from "../../domain/User/User";
import { CardInterface } from "../../models/PokerModel";

export class DealPokerUseCase {
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
    bet: number
  ): Promise<{ hand: CardInterface[]; updateSumScore: number }> {
    if (bet <= 0) {
      throw new Error("betは1以上である必要があります");
    }
    if (bet > 10000) {
      throw new Error("betは10000以下である必要があります");
    }
    const pokerDomain = new Poker([]);
    pokerDomain.initializeDeck();
    const user = await this.userRepository.getUserById(userId);

    if (!user) {
      throw new Error(`ユーザーID ${userId} が見つかりません`);
    }

    if (user.sumScore - bet <= 0) {
      throw new Error("sumScoreより多くベッドすることはできません");
    }

    const deck: CardInterface[] = pokerDomain.deck; // デッキを生成
    let pokerData = await this.pokerRepository.getPokerData(userId);

    const hand = deck.slice(0, 5);
    if (hand.length !== 5) {
      throw new Error("デッキに十分なカードがありません");
    }

    if (pokerData) {
      // 既存データがある場合は初期化データで更新
      await this.pokerRepository.updatePokerData(userId, {
        deck: deck.slice(5),
        hand,
        hasSwapped: false,
        score: bet,
        pokerFlag: false,
        doubleUpFlag: false,
        doubleUpCard: { suit: "None", rank: "None" },
        doubleUpSuccessCount: 0,
      });
    } else {
      // 新規作成
      await this.pokerRepository.createPokerData(userId, deck, bet);
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
    const updateSumScore = newUser.subtractScore(bet);
    await this.userRepository.updateSumScore(user.userId, updateSumScore);
    await this.pokerRepository.updatePokerState(userId, true, false);

    return { hand, updateSumScore };
  }
}
