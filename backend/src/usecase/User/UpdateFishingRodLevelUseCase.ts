import { IUserRepository } from "@/src/domain/User/User";
import { User } from "@/src/domain/User/User";

interface UpdateFishingRodLevelInput {
  userId: string;
  fishingRodLevel: number;
}

export class UpdateFishingRodLevelUseCase {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  public async execute(input: UpdateFishingRodLevelInput): Promise<number> {
    const { userId, fishingRodLevel } = input;
    const user = await this.userRepository.getUserById(userId);
    if (!user) {
      throw new Error(`ユーザーID ${userId} が見つかりません`);
    }

    const newUser = new User(
      undefined, // ユーザー名
      undefined, // パスワード
      undefined, // ユーザーID
      undefined, // 合計スコア
      user.fishingRodLevel,
      undefined, // 捕まえた魚リスト
      undefined, // 実績
      undefined // 好きな魚
    );
    const updatableFishingRodLevel =
      newUser.isBigInputFishingRodLevel(fishingRodLevel);
    if (updatableFishingRodLevel instanceof Error) {
      throw updatableFishingRodLevel;
    }
    const validateFishingRodLevel = newUser.validateFishingRodLevelUpgrade(
      updatableFishingRodLevel
    );
    if (validateFishingRodLevel instanceof Error) {
      throw validateFishingRodLevel;
    }
    const [updatedLevel, requiredScore] = validateFishingRodLevel;
    return await this.userRepository.updateFishingRodLevel(
      user.userId,
      updatedLevel,
      requiredScore
    );
  }
}
