import { FishList } from "@/src/domain/fish/FishList";

type FishType = {
  name: string;
  score: number;
};
const expirationTime = 300000;

export class Fish {
  private fish: FishType;
  private generatedFishId: string;
  private generatedTime: number;

  constructor() {
    this.generatedFishId = this.generateFishId();
    this.fish = this.randomizeFish();
    this.generatedTime = this.timeRecord();
  }

  // ランダムな文字列の生成
  private generateFishId(): string {
    return crypto.randomUUID();
  }
  // 魚リストからランダムな魚を選択
  private randomizeFish(): FishType {
    const totalWeight = FishList.reduce((sum: number, fish: FishType) => sum + (1 / fish.score), 0);
    let randomWeight = Math.random() * totalWeight;
    for (let i = 0; i < FishList.length; i++) {
      randomWeight -= 1 / FishList[i].score;
      if (randomWeight <= 0) {
        return FishList[i];
      }
    }
    return FishList[0]; // 万が一、何も選ばれなかった場合
  }
  // 現在の時刻を記録
  private timeRecord(): number {
    return Date.now();  
  }
  // 魚を返す
  public getFish(): { fish: FishType; fishId: string } {
    return {
      fish: this.fish,
      fishId: this.generatedFishId,
    };
  }
  // 魚IDが一致するか確認する
  public isFishIdEqual(fishId: string): boolean {
    return this.generatedFishId === fishId
  }
  // 有効期限を超えていないか確認
  public expirationCheck(): boolean {
    const elapsedTime = Date.now() - this.generatedTime;
    return elapsedTime > expirationTime
  }
}