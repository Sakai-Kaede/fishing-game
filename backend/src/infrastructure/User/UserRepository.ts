import UserModel from '@/src/infrastructure/models/UserModel';

export class UserRepository {
  // ユーザーを作成する
  public authUser = async (username: string, password: string, score?: number): Promise<{ userName: string; password: string }> => {
    try {
      const newUser = new UserModel({
        username,
        password,
        score: score || 0, 
      });
      const savedUser = await newUser.save();

      return {
        userName: savedUser.username,
        password: savedUser.password,
      };
    } catch (err) {
      console.error('ユーザー作成エラー:', err);
      throw new Error('ユーザー作成に失敗しました');
    }
  };

  // ユーザー名からユーザーを検索する
  public findUserByUsername = async (username: string): Promise<{ userName: string; password: string } | null> => {
    try {
      const user = await UserModel.findOne({ username });
      if (!user) {
        console.log(`ユーザー ${username} は見つかりませんでした`);
        return null;
      }
      return {
        userName: user.username,
        password: user.password,
      };
    } catch (err) {
      console.error('ユーザー検索エラー:', err);
      throw new Error('ユーザー検索に失敗しました');
    }
  };
}