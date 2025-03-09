import bcrypt from "bcrypt";
import { fishList } from "../../constants/FishData";
import { IUser } from "../../models/UserModel";

export class User {
  private username: string;
  private password: string;
  private userId: string;
  private sumScore: number;
  private fishingRodLevel: number;
  private caughtFish: {
    name: string;
    count: number;
  }[];
  private achievements: {
    count: number;
    name: string;
    level: number;
    group: number;
  }[];
  private favoriteFish: string;

  constructor(
    username: string = "xxx",
    password: string = "xxxxxx",
    userId: string = this.generateUserId(),
    sumScore: number = 0,
    fishingRodLevel: number = 1,
    caughtFish: {
      name: string;
      count: number;
    }[] = [],
    achievements: {
      count: number;
      name: string;
      level: number;
      group: number;
    }[] = [],
    favoriteFish: string = "xxx"
  ) {
    if (username.length < 3 || username.length > 8) {
      throw new Error("ユーザー名は3文字以上8文字以内である必要があります");
    }
    if (password.length < 6 || password.length > 256) {
      throw new Error("パスワードは6文字以上256文字以内である必要があります");
    }
    this.username = username;
    this.password = this.hashPasswordSync(password);
    this.userId = userId;
    this.sumScore = sumScore;
    this.fishingRodLevel = fishingRodLevel;
    this.caughtFish = caughtFish;
    this.achievements = achievements;
    this.favoriteFish = favoriteFish;
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
  // スコアを加算
  public addScore(score: number): number {
    this.sumScore += score;
    return this.sumScore;
  }
  // スコアを減算
  public subtractScore(score: number): number {
    this.sumScore -= score;
    return this.sumScore;
  }
  // 釣竿レベル更新のためのバリデーションチェック（返り値は更新後のレベルと必要なスコア）
  public validateFishingRodLevelUpgrade(
    input: number
  ): [number, number] | Error {
    switch (input) {
      case 5:
        return [5, 1000];
      case 10:
        return [10, 5000];
      case 20:
        return [20, 10000];
      default:
        throw new Error("無効な入力です");
    }
  }
  // 釣竿レベルを比較するメソッド
  public isBigInputFishingRodLevel(inputLevel: number): number | Error {
    if (inputLevel <= this.fishingRodLevel) {
      throw new Error("入力された釣竿レベルは現在の釣竿レベル以下です");
    }
    return inputLevel;
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
    achievements: {
      count: number;
      name: string;
      level: number;
      group: number;
    }[];
    favoriteFish: string;
  } {
    return {
      username: this.username,
      userId: this.userId,
      password: this.password,
      sumScore: this.sumScore,
      fishingRodLevel: this.fishingRodLevel,
      caughtFish: this.caughtFish,
      achievements: this.achievements,
      favoriteFish: this.favoriteFish,
    };
  }

  // パスワードと好きな魚を照合するメソッド
  public async verifyPasswordAndFavoriteFish(
    password: string,
    userPassword: string,
    favoriteFish: string
  ): Promise<boolean> {
    const isPasswordValid = await bcrypt.compare(password, userPassword);
    const isFavoriteFishValid = this.favoriteFish === favoriteFish;
    return isPasswordValid && isFavoriteFishValid;
  }

  // achievements を group ごとに最も level が高いもののみ残す
  public groupAchievementsByMaxLevel = (
    achievements: {
      count: number;
      name: string;
      level: number;
      group: number;
    }[]
  ): { count: number; name: string; level: number; group: number }[] => {
    // achievements を group ごとに最も level が高いもののみ残す
    const achievementsGroupedByMaxLevel = achievements.reduce(
      (result, achievement) => {
        const { group, level } = achievement;

        // グループがすでに存在している場合、最も高い level を保持
        if (!result[group]) {
          result[group] = achievement; // グループがなければそのまま追加
        } else if (result[group].level < level) {
          result[group] = achievement; // 既存のレベルより高い場合、更新
        }

        return result;
      },
      {} as Record<
        number,
        { count: number; name: string; level: number; group: number }
      >
    );

    // グループごとに最もレベルが高いものを配列に変換
    return Object.values(achievementsGroupedByMaxLevel);
  };
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
    password: string,
    sumScore: number,
    fishingRodLevel: number,
    caughtFish: {
      name: string;
      count: number;
    }[],
    achievements: {
      count: number;
      name: string;
      level: number;
      group: number;
    }[],
    favoriteFish: string
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

  /**
   * ユーザーの捕まえた魚の実績を更新します。
   * 魚の種類や数に応じて達成可能な実績を追加します。
   *
   * @param userId ユーザーID
   * @param caughtFish 捕まえた魚のリスト（名前と数）
   * @returns なし
   * @throws ユーザーが見つからない場合、エラーが発生します
   */
  addFishingAchievements(
    userId: string,
    caughtFish: { name: string; count: number }[]
  ): Promise<void>;

  /**
   * ユーザーのポーカーポイントに基づいて実績を更新します。
   * ポイント数に応じて達成可能な実績を追加します。
   *
   * @param userId ユーザーID
   * @param points ユーザーのポーカーポイント
   * @returns なし
   * @throws ユーザーが見つからない場合、エラーが発生します
   */
  addPokerAchievements(userId: string, points: number): Promise<void>;

  /**
   * ユーザー名をもとにユーザー情報を取得します。
   *
   * @param username 検索するユーザー名
   * @returns ユーザー情報のPromiseオブジェクト。情報には以下が含まれます:
   * - username: ユーザー名
   * - userId: ユーザーID
   * - password: パスワード
   * - sumScore: ユーザーの総スコア
   * - fishingRodLevel: 釣り竿のレベル
   * - caughtFish: 捕まえた魚の情報（魚の名前と捕獲数）
   * - achievements: 実績情報（実績名と達成状況）
   * - favoriteFish: お気に入りの魚
   *
   * ユーザーが見つからない場合は `null` を返します。
   */
  findUserByUsername(username: string): Promise<{
    username: string;
    userId: string;
    password: string;
    sumScore: number;
    fishingRodLevel: number;
    caughtFish: {
      name: string;
      count: number;
    }[];
    achievements: {
      count: number;
      name: string;
      level: number;
      group: number;
    }[];
    favoriteFish: string;
  } | null>;

  /**
   * ユーザーをsumScore順に取得します。（最大100件）
   *
   * @returns ユーザー名とsumScoreを含むリスト
   */
  getUsersBySumScore(): Promise<
    {
      username: string;
      sumScore: number;
      achievements: {
        count: number;
        name: string;
        level: number;
        group: number;
      }[];
    }[]
  >;

  /**
   * ユーザーのsumScoreに基づいた順位を取得します。
   *
   * @param userId ユーザーID
   * @returns 指定したユーザーの順位（1から始まる）
   */
  getUserRankBySumScore(userId: string): Promise<number>;
}
