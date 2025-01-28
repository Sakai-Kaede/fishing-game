import bcrypt from "bcrypt";

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
  // 釣り竿のレベルを更新
  public upgradeFishingRod(level: number): void {
    if (level < this.fishingRodLevel)
      throw new Error(
        "現在のレベルや現在のレベルより低いレベルにはアップグレードできません"
      );
    this.fishingRodLevel = level;
  }
  // スコアを加算
  public addScore(score: number): void {
    this.sumScore += score;
  }
  // 魚を追加
  public addCaughtFish(name: string): void {
    const existingFish = this.caughtFish.find((fish) => fish.name === name);
    if (existingFish) {
      existingFish.count += 1;
    } else {
      this.caughtFish.push({ name, count: 1 });
    }
  }
  // ユーザー情報の取得
  public getUser(): {
    username: string;
    userId: string;
    sumScore: number;
    fishingRodLevel: number;
    caughtFish: { name: string; count: number }[];
  } {
    return {
      username: this.username,
      userId: this.userId,
      sumScore: this.sumScore,
      fishingRodLevel: this.fishingRodLevel,
      caughtFish: this.caughtFish,
    };
  }
}
