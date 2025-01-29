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
      user.username,
      user.password,
      undefined,
      user.sumScore
    );
    const updateSumScore = newUser.addScore(additionalScore);
    return await this.userRepository.updateSumScore(
      user.userId,
      updateSumScore
    );
  }
}
