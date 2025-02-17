export interface User {
  username: string;
  userId: string;
  sumScore: number;
  fishingRodLevel: number;
  caughtFishResults: { name: string; isCaught: boolean }[] | null;
  message?: string;
}
