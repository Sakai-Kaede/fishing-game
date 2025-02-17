export interface User {
  username: string;
  userId: string;
  sumScore: number;
  fishingRodLevel: number;
  caughtFish: { name: string; count: number }[];
  achievements: {
    name: string;
    achieved: boolean;
  }[];
  message?: string;
}
