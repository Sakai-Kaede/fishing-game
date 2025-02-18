import { Router, Request, Response } from "express";
import { GetUsersRankingUseCase } from "@/src/usecase/User/GetUsersRanking";
import { GetRankUseCase } from "@/src/usecase/User/GetRank";
import { IUserRepository } from "@/src/domain/User/User";

export class GetRankingController {
  private getUsersRankingUseCase: GetUsersRankingUseCase;
  private getUserRankBySumScoreUseCase: GetRankUseCase;

  constructor(userRepository: IUserRepository) {
    this.getUsersRankingUseCase = new GetUsersRankingUseCase(userRepository);
    this.getUserRankBySumScoreUseCase = new GetRankUseCase(userRepository);
  }

  public getRanking(router: Router) {
    router.get("/rank", async (req: Request, res: Response) => {
      try {
        const { userId } = req.query;

        if (userId) {
          // userId がクエリに含まれている場合、個別のユーザーの順位を取得
          const rank = await this.getUserRankBySumScoreUseCase.execute(
            userId as string
          );
          res.status(200).json(rank);
        } else {
          // userId が含まれていない場合、全ユーザーのランキングを取得
          const rankedUsers = await this.getUsersRankingUseCase.execute();
          res.status(200).json(rankedUsers);
        }
      } catch (error: any) {
        res.status(400).json({ message: error.message });
      }
    });
  }
}
