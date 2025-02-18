import { IUserRepository } from "@/src/domain/User/User";

interface GetUsersRankingOutput {
  username: string;
  sumScore: number;
}

export class GetUsersRankingUseCase {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  public async execute(): Promise<GetUsersRankingOutput[]> {
    const rankedUsers = await this.userRepository.getUsersBySumScore();

    return rankedUsers.map((user) => ({
      username: user.username,
      sumScore: user.sumScore,
    }));
  }
}
