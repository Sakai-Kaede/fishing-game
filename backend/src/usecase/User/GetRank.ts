import { IUserRepository } from "@/src/domain/User/User";

interface GetRankUseCaseOutput {
  rank: number;
}

export class GetRankUseCase {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  public async execute(userId: string): Promise<GetRankUseCaseOutput> {
    const rank = await this.userRepository.getUserRankBySumScore(userId);

    return {
      rank,
    };
  }
}
