import { IFishRepository } from "@/src/domain/Fish/Fish";
import { IUserRepository } from "@/src/domain/User/User";
import { Fish } from "@/src/domain/Fish/Fish";

export class CreatePreFishUseCase {
  private fishRepository: IFishRepository;
  private userRepository: IUserRepository;

  constructor(
    fishRepository: IFishRepository,
    userRepository: IUserRepository
  ) {
    this.fishRepository = fishRepository;
    this.userRepository = userRepository;
  }

  public async execute(userId: string, depth: number) {
    const fishDomain = new Fish(depth);
    let latestPreFish;

    try {
      latestPreFish = await this.fishRepository.getLatestPreFishByUserId(
        userId
      );
    } catch (error) {
      console.log(
        "最新の魚が見つかりません。新規ユーザーとして処理を続行します"
      );
    }

    if (latestPreFish) {
      try {
        fishDomain.checkTimeDifference(latestPreFish, 20 * 1000);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("エラー:", error.message);
          throw error;
        }
      }
    }

    const userData = await this.userRepository.getUserById(userId);
    if (!userData || typeof userData.fishingRodLevel !== "number") {
      throw new Error("ユーザーの釣竿レベルが正しく取得できませんでした");
    }

    const fishingRodLevel = userData.fishingRodLevel;
    const { fish: FishInterface, randomId } = fishDomain.getFish();

    FishInterface.requiredInteractions = Math.ceil(
      FishInterface.requiredInteractions / fishingRodLevel
    );

    if (latestPreFish) {
      // 更新処理
      const updateFish = await this.fishRepository.updatePreFish(
        FishInterface,
        randomId,
        userId
      );
      return {
        fish: {
          name: updateFish.fish.name,
          score: updateFish.fish.score,
          requiredInteractions: updateFish.fish.requiredInteractions,
        },
        randomId: updateFish.randomId,
        message: "既存のpreFishが更新されました",
      };
    } else {
      // 新規作成処理
      const savedFish = await this.fishRepository.savePreFish(
        FishInterface,
        randomId,
        userId
      );
      return {
        fish: savedFish.fish,
        randomId: savedFish.randomId,
        message: "新しいpreFishが作成されました",
      };
    }
  }
}
