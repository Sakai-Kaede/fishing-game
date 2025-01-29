import bcrypt from "bcrypt";
import { fishList } from "@/constants/FishData";
import { IUser } from "@/models/UserModel";

export class User {
  private username: string;
  private password: string;
  private userId: string = this.generateUserId();
  private sumScore: number = 0;
  private fishingRodLevel: number = 1;
  private caughtFish: {
    name: string;
    count: number;
  }[] = [];

  constructor(username: string, password: string) {
    if (username.length < 3 || username.length > 256) {
      throw new Error("ユーザー名は3文字以上256文字以内である必要があります");
    }
    if (password.length < 6 || password.length > 256) {
      throw new Error("パスワードは6文字以上256文字以内である必要があります");
    }
    this.username = username;
    this.password = this.hashPasswordSync(password);
  }

  // ユーザーIDを生成
  private generateUserId(): string {
    const id = crypto.randomUUID();
    console.log(id);
    return id;
  }
  // パスワードをハッシュ化
  private hashPasswordSync(password: string): string {
    const saltRounds = 10;
    return bcrypt.hashSync(password, saltRounds);
  }

  // パスワードの照合メソッド
  public async comparePassword(inputPassword: string): Promise<boolean> {
    const isMatch = await bcrypt.compare(inputPassword, this.password);
    return isMatch;
  }
  // 釣竿レベル更新のためのバリデーションチェック（返り値は更新後のレベルと必要なスコア）
  public validateFishingRodLevelUpgrade(
    input: number
  ): [number, number] | Error {
    switch (input) {
      case 5:
        return [5, 1000];
      case 10:
        return [10, 3000];
      case 20:
        return [20, 5000];
      default:
        throw new Error("無効な入力です");
    }
  }
  // 魚名のバリデーションチェック
  public validateFishName = (name: string): string | Error => {
    const fish = fishList.find((fish) => fish.name === name);

    if (fish) {
      return fish.name;
    } else {
      throw new Error("指定された魚はリストに存在しません");
    }
  };
  // ユーザー情報の取得
  public getUser(): {
    username: string;
    userId: string;
    password: string;
    sumScore: number;
    fishingRodLevel: number;
    caughtFish: { name: string; count: number }[];
  } {
    return {
      username: this.username,
      userId: this.userId,
      password: this.password,
      sumScore: this.sumScore,
      fishingRodLevel: this.fishingRodLevel,
      caughtFish: this.caughtFish,
    };
  }
}

export interface IUserRepository {
  /**
   * 新しいユーザーを登録します。
   *
   * @param username ユーザー名
   * @param userId ユーザーID（ユニーク）
   * @param password ユーザーのパスワード
   * @returns 登録したユーザー情報（username, userId）
   * @throws エラーが発生した場合、ユーザー登録に失敗します
   */
  authUser(
    username: string,
    userId: string,
    password: string
  ): Promise<{ username: string; userId: string }>;

  /**
   * ユーザーの釣竿レベルを更新します。
   *
   * @param userId ユーザーID
   * @param newLevel 新しいレベル
   * @param requiredScore 必要なスコア（現在のsumScoreから減算される）
   * @returns 更新後の釣竿レベル（fishingRodLevel）
   * @throws ユーザーが見つからない、またはsumScoreが不足している場合、エラーが発生します
   */
  updateFishingRodLevel(
    userId: string,
    newLevel: number,
    requiredScore: number
  ): Promise<number>;

  /**
   * ユーザーIDを元にユーザー情報を取得します。
   *
   * @param userId ユーザーID
   * @returns ユーザー情報（IUser型）または見つからない場合はnull
   * @throws ユーザーが見つからない場合、エラーが発生します
   */
  getUserById(userId: string): Promise<IUser | null>;

  /**
   * ユーザーのsumScoreを更新します。
   *
   * @param userId ユーザーID
   * @param additionalScore 追加するスコア（sumScoreに加算されます）
   * @returns 更新後の合計スコア（sumScore）
   * @throws ユーザーが見つからない場合、エラーが発生します
   */
  updateSumScore(userId: string, additionalScore: number): Promise<number>;

  /**
   * ユーザーのcaughtFishのcountを1増やします。
   *
   * @param userId ユーザーID
   * @param name 捕まえた魚の名前
   * @returns 更新後の捕まえた魚のリスト（caughtFish）
   * @throws ユーザーが見つからない、または魚名が無効な場合、エラーが発生します
   */
  incrementCaughtFishCount(
    userId: string,
    name: string
  ): Promise<
    {
      name: string;
      count: number;
    }[]
  >;
}
