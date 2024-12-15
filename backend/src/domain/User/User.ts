import bcrypt from 'bcrypt';

export class User {
  private userName: string;
  private password: string;

  constructor(userName: string, password: string) {
    if (userName.length < 4 || userName.length > 256) {
      throw new Error("ユーザー名は4文字以上256文字以内である必要があります");
    }
    if (password.length < 8 || password.length > 256) {
      throw new Error("パスワードは8文字以上256文字以内である必要があります");
    }
    this.userName = userName;
    this.password = this.hashPasswordSync(password);
  }

  // パスワードを同期的にハッシュ化
  private hashPasswordSync(password: string): string {
    const saltRounds = 10;
    return bcrypt.hashSync(password, saltRounds);
  }

  // パスワードの照合メソッド（非同期）
  public async comparePassword(inputPassword: string): Promise<boolean> {
    const isMatch = await bcrypt.compare(inputPassword, this.password);
    return isMatch;
  }
  // ユーザー名とハッシュ化されたパスワードを取得
  public getUser(): { userName: string; password: string } {
    return {
      userName: this.userName,
      password: this.password,
    };
  }
}

export interface IUserRepository {
  /**
   * 新しいユーザーを作成する
   * @param username ユーザー名
   * @param password パスワード
   * @param score 初期値は0
   * @returns 作成されたユーザーオブジェクト
   */
  authUser(username: string, password: string, score?: number): Promise<{ userName: string; password: string }>;
  /**
   * ユーザー名でユーザーを検索する
   * @param username ユーザー名
   * @returns 見つかった場合はユーザーオブジェクト、見つからない場合は null
   */
  findUserByUsername(username: string): Promise<{ userName: string; password: string } | null>;
}