import { IUserRepository } from "@/src/domain/User/User";
import { User } from "@/src/domain/User/User";

interface AddSumScoreInput {
  userId: string;
  additionalScore: number;
}

export class AddSumScoreUseCase {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  public async execute(input: AddSumScoreInput): Promise<number> {
    const { userId, additionalScore } = input;
    const user = await this.userRepository.getUserById(userId);
    if (!user) {
      throw new Error(`ユーザーID ${userId} が見つかりません`);
    }
    const newUser = new User(
      undefined, // ユーザー名
      undefined, // パスワード
      undefined, // ユーザーID
      user.sumScore,
      undefined, // 釣竿レベル
      undefined, // 捕まえた魚リスト
      undefined, // 実績
      undefined // 好きな魚
    );
    const updateSumScore = newUser.addScore(additionalScore);
    return await this.userRepository.updateSumScore(
      user.userId,
      updateSumScore
    );
  }
}
