import { IUserRepository } from "../../domain/User/User";
import { User } from "../../domain/User/User";

interface GetUsersRankingOutput {
  username: string;
  sumScore: number;
  achievements: { count: number; name: string; level: number; group: number }[];
}

export class GetUsersRankingUseCase {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  public async execute(): Promise<GetUsersRankingOutput[]> {
    const newUser = new User();
    const rankedUsers = await this.userRepository.getUsersBySumScore();

    return rankedUsers.map((user) => {
      const filteredAchievements = newUser.groupAchievementsByMaxLevel(
        user.achievements
      );

      return {
        username: user.username,
        sumScore: user.sumScore,
        achievements: filteredAchievements,
      };
    });
  }
}
