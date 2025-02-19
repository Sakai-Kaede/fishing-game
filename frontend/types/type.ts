export interface User {
  username: string;
  userId: string;
  sumScore: number;
  fishingRodLevel: number;
  caughtFish: { name: string; count: number }[];
  achievements: {
    count: number;
    name: string;
    level: number;
    group: number;
  }[];
  message?: string;
}
