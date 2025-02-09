import { FishInterface } from "@/config/types";
import { IPreFish } from "@/models/PreFishModel";
import UserModel from "@/models/UserModel";
import PreFishModel from "@/models/PreFishModel";

export class FishRepository {
  // 魚のレスポンスを保存する
  public savePreFish = async (
    fish: FishInterface,
    randomId: string,
    userId: string
  ): Promise<{
    fish: FishInterface;
    randomId: string;
    userId: string;
  }> => {
    try {
      const user = await UserModel.findOne({ userId });
      if (!user) {
        throw new Error(`ユーザーID ${userId} は存在しません`);
      }

      const newPreFish = new PreFishModel({
        fish: {
          name: fish.name,
          score: fish.score,
          requiredInteractions: fish.requiredInteractions,
        },
        randomId,
        userId,
      });

      const savedPreFish = await newPreFish.save();

      console.log("魚のレスポンスが保存されました:", savedPreFish);

      return {
        fish: savedPreFish.fish,
        userId: savedPreFish.userId,
        randomId: savedPreFish.randomId,
      };
    } catch (err) {
      console.error("魚の保存エラー:", err);
      throw new Error("魚のレスポンス保存に失敗しました");
    }
  };

  // ユーザーIDから最新のPreFish情報を取得する
  public getLatestPreFishByUserId = async (
    userId: string
  ): Promise<IPreFish> => {
    try {
      const latestPreFish = await PreFishModel.findOne({ userId })
        .sort({ createdAt: -1 })
        .select("fish userId randomId isInvalid createdAt updatedAt") // updatedAt を追加
        .lean();

      if (!latestPreFish) {
        throw new Error(
          `ユーザーID ${userId} の最新の魚が見つかりませんでした`
        );
      }
      const preFishData: IPreFish = latestPreFish as IPreFish;
      console.log(`ユーザーID ${userId} の最新の魚情報:`, preFishData);
      return preFishData;
    } catch (err) {
      console.error(`ユーザーID ${userId} の最新の魚取得エラー:`, err);
      throw new Error("最新の魚の取得に失敗しました");
    }
  };

  // 指定したrandomIdを無効化する
  public invalidateRandomId = async (randomId: string): Promise<void> => {
    try {
      const existingPreFish = await PreFishModel.findOne({ randomId });
      if (!existingPreFish) {
        throw new Error(`ランダムID ${randomId} が見つかりません`);
      }

      if (existingPreFish.isInvalid) {
        console.log(`ランダムID ${randomId} はすでに無効化されています`);
        return;
      }

      existingPreFish.isInvalid = true;
      await existingPreFish.save();

      console.log(`ランダムID ${randomId} が無効化されました`);
    } catch (err) {
      console.error(`ランダムID ${randomId} の無効化エラー:`, err);
      throw new Error("ランダムIDの無効化に失敗しました");
    }
  };

  // ランダムIDが無効化されているか確認する
  public isRandomIdInvalid = async (randomId: string): Promise<boolean> => {
    try {
      const preFish = await PreFishModel.findOne({ randomId })
        .select("isInvalid")
        .lean();
      if (!preFish) {
        throw new Error(
          `ランダムID ${randomId} に関連するデータが見つかりません`
        );
      }
      console.log(`ランダムID ${randomId} の無効化状態:`, preFish.isInvalid);
      return preFish.isInvalid === true;
    } catch (err) {
      console.error(`ランダムID ${randomId} の無効化状態確認エラー:`, err);
      throw new Error("ランダムIDの無効化状態確認に失敗しました");
    }
  };

  // PreFishデータの更新
  public updatePreFish = async (
    fish: FishInterface,
    randomId: string,
    userId: string
  ): Promise<{
    fish: FishInterface;
    randomId: string;
    userId: string;
  }> => {
    try {
      const user = await UserModel.findOne({ userId });
      if (!user) {
        throw new Error(`ユーザーID ${userId} は存在しません`);
      }

      await PreFishModel.updateOne(
        { userId },
        {
          $set: {
            fish,
            isInvalid: false,
            randomId,
          },
        }
      );

      return {
        fish: fish,
        userId: userId,
        randomId: randomId,
      };
    } catch (error) {
      console.error("魚の更新エラー:", error);
      throw new Error("魚のレスポンス更新に失敗しました");
    }
  };
}
