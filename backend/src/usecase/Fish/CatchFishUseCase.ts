import { IFishRepository } from "@/src/domain/Fish/Fish";
import { IUserRepository } from "@/src/domain/User/User";
import { Fish } from "@/src/domain/Fish/Fish";
import { User } from "@/src/domain/User/User";

export class CaughtFishUseCase {
  private fishRepository: IFishRepository;
  private userRepository: IUserRepository;

  constructor(
    fishRepository: IFishRepository,
    userRepository: IUserRepository
  ) {
    this.fishRepository = fishRepository;
    this.userRepository = userRepository;
  }

  public async execute(userId: string, randomId: string) {
    const latestPreFish = await this.fishRepository.getLatestPreFishByUserId(
      userId
    );
    if (!latestPreFish) {
      throw new Error("最新の魚情報が見つかりません");
    }
    const isInvalid = await this.fishRepository.isRandomIdInvalid(
      latestPreFish.randomId
    );
    if (isInvalid) {
      throw new Error("このランダムIDはすでに無効化されています");
    }
    const fishDomain = new Fish(0);
    const isValidRandomId = fishDomain.isRandomIdEqual(
      randomId,
      latestPreFish.randomId
    );
    if (!isValidRandomId) {
      throw new Error("提供された魚のランダムIDが無効です");
    }
    const requiredInteractions = latestPreFish.fish.requiredInteractions;
    const isRequiredInteractionsUnderLimit =
      fishDomain.isRequiredInteractionsUnderLimit(requiredInteractions, 50);
    if (!isRequiredInteractionsUnderLimit) {
      throw new Error("提供された必要インタラクション回数が上限を超えています");
    }
    try {
      await this.fishRepository.invalidateRandomId(latestPreFish.randomId);
    } catch (err) {
      console.error("ランダムIDの無効化に失敗しました:", err);
      throw new Error("ランダムIDの無効化に失敗したため、処理を中止します");
    }
    const fishScore = latestPreFish.fish.score;

    const user = await this.userRepository.getUserById(userId);
    if (!user) {
      throw new Error("ユーザーが見つかりません");
    }

    await this.userRepository.incrementCaughtFishCount(
      userId,
      latestPreFish.fish.name
    );
    const newUser = new User(
      undefined,
      undefined,
      undefined,
      user.sumScore,
      undefined,
      undefined,
      undefined
    );

    const caughtFish = user.caughtFish;
    await this.userRepository.addFishingAchievements(userId, caughtFish);
    const newScore = newUser.addScore(fishScore);
    await this.userRepository.updateSumScore(userId, newScore);

    console.log(
      `ユーザー ${userId} が魚 ${latestPreFish.fish.name} を捕まえました。スコア: ${fishScore}`
    );
    return {
      fish: {
        name: latestPreFish.fish.name,
        score: latestPreFish.fish.score,
      },
    };
  }
}
