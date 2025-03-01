import { IUserRepository } from "../../domain/User/User";
import { IUser } from "../../models/UserModel";

interface GetUserDataInput {
  userId: string;
}

export class GetUserDataUseCase {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  public async execute(input: GetUserDataInput): Promise<IUser> {
    const { userId } = input;
    const user = await this.userRepository.getUserById(userId);
    if (!user) {
      throw new Error(
        `ユーザーID "${userId}" に該当するユーザーが見つかりません。`
      );
    }
    return user;
  }
}
