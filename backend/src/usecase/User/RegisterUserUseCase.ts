import { User } from "../../domain/User/User";
import { IUserRepository } from "../../domain/User/User";

interface RegisterUserInput {
  username: string;
  password: string;
  favoriteFish: string;
}
interface RegisterUserOutput {
  username: string;
  userId: string;
}

export class RegisterUserUseCase {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  public async execute(input: RegisterUserInput): Promise<RegisterUserOutput> {
    const { username, password, favoriteFish } = input;
    const newUser = new User(
      username, // ユーザー名
      password, // パスワード
      undefined, // ユーザーID
      undefined, // 合計スコア
      undefined, // 釣竿レベル
      undefined, // 捕まえた魚リスト
      undefined, // 実績
      favoriteFish // 好きな魚
    );
    const savedUser = await this.userRepository.authUser(
      newUser.getUser().username,
      newUser.getUser().userId,
      newUser.getUser().password,
      newUser.getUser().sumScore,
      newUser.getUser().fishingRodLevel,
      newUser.getUser().caughtFish,
      newUser.getUser().achievements,
      newUser.getUser().favoriteFish
    );
    return {
      username: savedUser.username,
      userId: savedUser.userId,
    };
  }
}
