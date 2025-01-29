import UserModel, { IUser } from "@/models/UserModel";

export class UserRepository {
  // 新規ユーザーを登録する
  public authUser = async (
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
      name: string;
      achieved: boolean;
    }[]
  ): Promise<{
    username: string;
    userId: string;
    fishingRodLevel: number;
    caughtFish: {
      name: string;
      count: number;
    }[];
    achievements: {
      name: string;
      achieved: boolean;
    }[];
  }> => {
    try {
      const newUser = new UserModel({
        username,
        password,
        userId,
        sumScore,
        fishingRodLevel,
        caughtFish,
        achievements,
      });
      const savedUser = await newUser.save();

      return {
        username: savedUser.username,
        userId: savedUser.userId,
        fishingRodLevel: savedUser.fishingRodLevel,
        caughtFish: savedUser.caughtFish,
        achievements: savedUser.achievements,
      };
    } catch (err) {
      console.error("ユーザー作成エラー:", err);
      throw new Error("ユーザー作成に失敗しました");
    }
  };

  // ユーザーのsumScoreとfishingRodLevelを更新する
  public updateFishingRodLevel = async (
    userId: string,
    newLevel: number,
    requiredScore: number
  ): Promise<number> => {
    try {
      const user = await UserModel.findOne({ userId });

      if (!user) {
        throw new Error("ユーザーが見つかりません");
      }

      if (user.sumScore < requiredScore) {
        throw new Error("スコアが不足しています");
      }

      user.fishingRodLevel = newLevel;
      user.sumScore -= requiredScore;

      await user.save();
      return user.fishingRodLevel;
    } catch (err) {
      if (err instanceof Error && err.message === "ユーザーが見つかりません") {
        throw err;
      }

      if (err instanceof Error && err.message === "スコアが不足しています") {
        throw err;
      }

      console.error("ユーザー更新エラー:", err);
      throw new Error("ユーザー情報の更新に失敗しました");
    }
  };

  // ユーザーIDからユーザー情報を取得する（passwordを除外）
  public getUserById = async (userId: string): Promise<IUser | null> => {
    try {
      const user = await UserModel.findOne({ userId }).select("-password");

      if (!user) {
        throw new Error("ユーザーが見つかりません");
      }

      return user;
    } catch (err) {
      console.error("ユーザー取得エラー:", err);
      throw new Error("ユーザー情報の取得に失敗しました");
    }
  };

  // ユーザーのsumScoreを更新する
  public updateSumScore = async (
    userId: string,
    additionalScore: number
  ): Promise<number> => {
    try {
      const user = await UserModel.findOne({ userId });
      if (!user) {
        console.log(`ユーザー ${userId} は見つかりませんでした`);
        throw new Error("ユーザーが見つかりません");
      }

      user.sumScore = additionalScore;
      await user.save();
      console.log(`ユーザー ${userId} の sumScore を更新しました`);

      return user.sumScore;
    } catch (err) {
      console.error("sumScore 更新エラー:", err);
      throw new Error("sumScore の更新に失敗しました");
    }
  };

  // ユーザーのcaughtFishのcountを1増やす
  public incrementCaughtFishCount = async (
    userId: string,
    name: string
  ): Promise<
    {
      name: string;
      count: number;
    }[]
  > => {
    try {
      const user = await UserModel.findOne({ userId });

      if (!user) {
        throw new Error("ユーザーが見つかりません");
      }

      const fish = user.caughtFish.find((fish) => fish.name === name);

      if (fish) {
        fish.count += 1;
      } else {
        user.caughtFish.push({ name, count: 1 });
      }

      await user.save();
      return user.caughtFish;
    } catch (err) {
      console.error("魚のカウント更新エラー:", err);
      throw new Error("魚のカウントの更新に失敗しました");
    }
  };
}
