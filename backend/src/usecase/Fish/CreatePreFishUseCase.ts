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
        } else {
          console.error("予期しないエラー:", error);
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
    const saveRequiredInteractions = FishInterface.requiredInteractions;
    FishInterface.requiredInteractions = Math.ceil(
      FishInterface.requiredInteractions / fishingRodLevel
    );

    const savedFish = await this.fishRepository.savePreFish(
      FishInterface,
      randomId,
      userId
    );
    await this.fishRepository.deleteOldPreFishByUserId(userId);
    FishInterface.requiredInteractions = saveRequiredInteractions;
    return {
      fish: savedFish.fish,
      randomId: savedFish.randomId,
    };
  }
}
