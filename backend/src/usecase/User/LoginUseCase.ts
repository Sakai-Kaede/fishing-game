import { IUserRepository } from "@/src/domain/User/User";
import { User } from "@/src/domain/User/User";

interface LoginUserInput {
  username: string;
  password: string;
  favoriteFish: string;
}

interface LoginUserOutput {
  username: string;
  userId: string;
  sumScore: number;
  fishingRodLevel: number;
  caughtFish: {
    name: string;
    count: number;
  }[];
  achievements: {
    name: string;
    achieved: boolean;
  }[];
  message: string;
}

export class LoginUseCase {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  public async execute(input: LoginUserInput): Promise<LoginUserOutput> {
    const { username, password, favoriteFish } = input;

    // ユーザーを検索
    const user = await this.userRepository.findUserByUsername(username);
    if (!user) {
      throw new Error(
        "ユーザーが存在しないか、パスワードか好きな魚が間違っています"
      );
    }

    const newUser = new User(
      undefined, // ユーザー名
      undefined, // パスワード
      undefined, // ユーザーID
      undefined, // 合計スコア
      undefined, // 釣竿レベル
      undefined, // 捕まえた魚リスト
      undefined, // 実績
      user.favoriteFish // 好きな魚
    );

    if (
      !(await newUser.verifyPasswordAndFavoriteFish(
        password,
        user.password,
        favoriteFish
      ))
    ) {
      throw new Error(
        "ユーザーが存在しないか、パスワードか好きな魚が間違っています"
      );
    }

    return {
      username: user.username,
      userId: user.userId,
      sumScore: user.sumScore,
      fishingRodLevel: user.fishingRodLevel,
      caughtFish: user.caughtFish,
      achievements: user.achievements,
      message: "ログインに成功しました。",
    };
  }
}
