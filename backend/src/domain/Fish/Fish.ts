import { fishList } from "@/constants/FishData";
import { FishInterface } from "@/config/types";

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
}
