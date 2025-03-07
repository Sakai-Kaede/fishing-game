import UserModel, { IUser } from "../../models/UserModel";
import {
  FISH_ACHIEVEMENTS,
  POKER_ACHIEVEMENTS,
} from "../../constants/AchievementData";

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
      count: number;
      name: string;
      level: number;
      group: number;
    }[],
    favoriteFish: string
  ): Promise<{
    username: string;
    userId: string;
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
        favoriteFish,
      });
      const savedUser = await newUser.save();

      return {
        username: savedUser.username,
        userId: savedUser.userId,
      };
    } catch (err: any) {
      console.error("ユーザー作成エラー:", err);
      if (err.code === 11000) {
        throw new Error("その名前は既に使用されています");
      }

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

  // 魚の種類と数に基づいて実績を追加
  public addFishingAchievements = async (
    userId: string,
    caughtFish: { name: string; count: number }[]
  ): Promise<void> => {
    try {
      const user = await UserModel.findOne({ userId });
      if (!user) return Promise.reject(new Error("ユーザーが見つかりません"));

      let achievementsToAdd = user.achievements;

      const uniqueFishCount = new Set(caughtFish.map((fish) => fish.name)).size;
      const totalFishCount = caughtFish.reduce(
        (total, fish) => total + fish.count,
        0
      );

      FISH_ACHIEVEMENTS.TYPES.forEach(({ count, name, level, group }) => {
        if (
          uniqueFishCount >= count &&
          !achievementsToAdd.some((achievement) => achievement.name === name)
        ) {
          achievementsToAdd.push({ name, count, level, group });
        }
      });

      FISH_ACHIEVEMENTS.COUNTS.forEach(({ count, name, level, group }) => {
        if (
          totalFishCount >= count &&
          !achievementsToAdd.some((achievement) => achievement.name === name)
        ) {
          achievementsToAdd.push({ name, count, level, group });
        }
      });

      user.achievements = achievementsToAdd;
      await user.save();
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  };

  // ポーカーのポイントに基づいて実績を追加
  public addPokerAchievements = async (
    userId: string,
    count: number
  ): Promise<void> => {
    try {
      const user = await UserModel.findOne({ userId });
      if (!user) return Promise.reject(new Error("ユーザーが見つかりません"));

      let achievementsToAdd = user.achievements;

      POKER_ACHIEVEMENTS.forEach(
        ({ count: requiredPoints, name, level, group }) => {
          if (
            count >= requiredPoints &&
            !achievementsToAdd.some((achievement) => achievement.name === name)
          ) {
            achievementsToAdd.push({
              name,
              count: requiredPoints,
              level,
              group,
            });
          }
        }
      );

      user.achievements = achievementsToAdd;
      await user.save();
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  };

  // ユーザー名からユーザーを検索する
  public findUserByUsername = async (
    username: string
  ): Promise<{
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
  } | null> => {
    try {
      const user = await UserModel.findOne({ username });
      if (!user) {
        console.log(`ユーザー ${username} は見つかりませんでした`);
        return null;
      }

      return {
        username: user.username,
        userId: user.userId,
        password: user.password,
        sumScore: user.sumScore,
        fishingRodLevel: user.fishingRodLevel,
        caughtFish: user.caughtFish,
        achievements: user.achievements,
        favoriteFish: user.favoriteFish,
      };
    } catch (err) {
      console.error("ユーザー検索エラー:", err);
      throw new Error("ユーザー検索に失敗しました");
    }
  };

  // ユーザー情報をスコア順に取得する（最大100件）
  public getUsersBySumScore = async (): Promise<
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
  > => {
    try {
      const users = await UserModel.find(
        {},
        { username: 1, sumScore: 1, achievements: 1, createdAt: 1, _id: 0 }
      )
        .sort({ sumScore: -1, createdAt: 1 })
        .limit(100);

      return users.map((user) => ({
        username: user.username,
        sumScore: user.sumScore,
        achievements: user.achievements,
      }));
    } catch (err) {
      console.error("スコア順ユーザー取得エラー:", err);
      throw new Error("スコア順ユーザー取得に失敗しました");
    }
  };

  // ユーザーのsumScoreに基づいた順位を取得する
  public getUserRankBySumScore = async (userId: string): Promise<number> => {
    try {
      const users = await UserModel.find(
        {},
        { username: 1, sumScore: 1, userId: 1, _id: 0 }
      ).sort({ sumScore: -1 });
      const user = users.find((u) => u.userId === userId);

      if (!user) {
        throw new Error("指定したユーザーが見つかりません");
      }

      const rank = users.findIndex((u) => u.userId === userId) + 1;

      return rank;
    } catch (err) {
      console.error("順位取得エラー:", err);
      throw new Error("ユーザーの順位取得に失敗しました");
    }
  };
}
