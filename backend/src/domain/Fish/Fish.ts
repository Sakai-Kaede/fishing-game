import { fishList } from "../../constants/FishData";
import { FishInterface } from "../../config/types";
import { IPreFish } from "../../models/PreFishModel";

export class Fish {
  private fish: FishInterface;
  private randomId: string;

  constructor(depth: number) {
    this.fish = this.randomizeFish(depth);
    this.randomId = this.generateRandomId();
  }

  private generateRandomId(): string {
    return crypto.randomUUID();
  }
  private randomizeFish(depth: number): FishInterface {
    // depthがCatchableMinDepthとCatchableMaxDepthの範囲にある魚をフィルタリング
    const availableFish = fishList.filter(
      (fish) =>
        depth >= fish.CatchableMinDepth && depth <= fish.CatchableMaxDepth
    );

    // 範囲内の魚がない場合のエラーハンドリング
    if (availableFish.length === 0) {
      throw new Error("No fish available at this depth.");
    }

    // ランダムに魚を選ぶ
    const totalWeight = availableFish.reduce(
      (sum: number, fish: FishInterface) => sum + 1 / fish.frequency,
      0
    );
    let randomWeight = Math.random() * totalWeight;
    for (let i = 0; i < availableFish.length; i++) {
      randomWeight -= 1 / availableFish[i].frequency;
      if (randomWeight <= 0) {
        return availableFish[i];
      }
    }
    return availableFish[0]; // 万が一、何も選ばれなかった場合
  }

  public getFish(): { fish: FishInterface; randomId: string } {
    return {
      fish: this.fish,
      randomId: this.randomId,
    };
  }
  public isRandomIdEqual(randomId: string, latestLandomId: string): boolean {
    return randomId === latestLandomId;
  }
  public isRequiredInteractionsUnderLimit(
    requiredInteractions: number,
    limit: number
  ) {
    return requiredInteractions <= limit;
  }
  public checkTimeDifference(
    latestCreatedAt: Date | { createdAt: Date; updatedAt: Date },
    waitTime: number
  ): void {
    const now = new Date();

    // createdAt と updatedAt をそれぞれ取得
    const latestDate =
      latestCreatedAt instanceof Date
        ? latestCreatedAt
        : latestCreatedAt.createdAt;

    const latestUpdatedAt =
      latestCreatedAt instanceof Date
        ? latestCreatedAt
        : latestCreatedAt.updatedAt;

    const createdAtDifference = now.getTime() - new Date(latestDate).getTime();
    const updatedAtDifference =
      now.getTime() - new Date(latestUpdatedAt).getTime();

    if (createdAtDifference < waitTime || updatedAtDifference < waitTime) {
      throw new Error("前回のリクエストから指定の待機時間が経過していません");
    }
  }
}

export interface IFishRepository {
  /**
   * 魚のレスポンスを保存します。
   *
   * @param fish 魚の情報（FishInterface型）
   * @param randomId ランダムID
   * @param userId ユーザーID
   * @returns 保存された魚の情報、ランダムID、ユーザーID
   * @throws ユーザーが存在しない場合、ユーザーIDが見つからないというエラーが発生します。
   * @throws 魚の保存に失敗した場合、保存処理のエラーが発生します。
   */
  savePreFish(
    fish: FishInterface,
    randomId: string,
    userId: string
  ): Promise<{
    fish: FishInterface;
    randomId: string;
    userId: string;
  }>;

  /**
   * ユーザーIDから最新のPreFish情報を取得します。
   *
   * @param userId ユーザーID
   * @returns ユーザーIDに関連する最新のPreFish情報（IPreFish型）
   * @throws 最新のPreFishが見つからない場合、エラーが発生します。
   */
  getLatestPreFishByUserId(userId: string): Promise<IPreFish>;

  /**
   * 指定したrandomIdを無効化します。
   *
   * @param randomId 無効化するランダムID
   * @returns 無効化が成功した場合、何も返さない
   * @throws ランダムIDが見つからない場合、エラーが発生します。
   * @throws すでに無効化されている場合、処理は何も行いません。
   */
  invalidateRandomId(randomId: string): Promise<void>;

  /**
   * ランダムIDが無効化されているかを確認します。
   *
   * @param randomId 無効化状態を確認するランダムID
   * @returns ランダムIDが無効化されている場合、trueを返す。無効化されていない場合、falseを返す。
   * @throws ランダムIDに関連するデータが見つからない場合、エラーが発生します。
   */
  isRandomIdInvalid(randomId: string): Promise<boolean>;

  /**
   * 捕まえる前の魚の情報を更新します。
   *
   * @param fish 更新対象の魚情報
   * @param randomId ランダムに生成された識別ID
   * @param userId ユーザーID
   * @returns 更新後の魚情報、ランダムID、ユーザーIDを含むオブジェクト
   * @throws 更新処理中にエラーが発生した場合に例外をスローします
   */
  updatePreFish(
    fish: FishInterface,
    randomId: string,
    userId: string
  ): Promise<{
    fish: FishInterface;
    randomId: string;
    userId: string;
  }>;
}
