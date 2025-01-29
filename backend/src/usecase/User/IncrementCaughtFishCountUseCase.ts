import { IUserRepository } from "@/src/domain/User/User";
import { User } from "@/src/domain/User/User";

interface IncrementCaughtFishCountInput {
  userId: string;
  name: string;
}

export class IncrementCaughtFishCountUseCase {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  public async execute(input: IncrementCaughtFishCountInput): Promise<
    {
      name: string;
      count: number;
    }[]
  > {
    const { userId, name } = input;
    const user = await this.userRepository.getUserById(userId);
    if (!user) {
      throw new Error(`ユーザーID ${userId} が見つかりません`);
    }
    const newUser = new User();
    const validateName = newUser.validateFishName(name);
    if (validateName instanceof Error) {
      throw validateName;
    }
    return await this.userRepository.incrementCaughtFishCount(
      user.userId,
      validateName
    );
  }
}
