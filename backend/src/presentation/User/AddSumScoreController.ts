import { Router, Request, Response } from "express";
import { AddSumScoreUseCase } from "@/src/usecase/User/AddSumScoreUseCase";
import { IUserRepository } from "@/src/domain/User/User";

export class AddSumScoreController {
  private addSumScoreUseCase: AddSumScoreUseCase;

  constructor(userRepository: IUserRepository) {
    this.addSumScoreUseCase = new AddSumScoreUseCase(userRepository);
  }

  public addSumScore(router: Router) {
    router.post("/add-score/:userId", async (req: Request, res: Response) => {
      try {
        const { userId } = req.params;
        const { additionalScore } = req.body;
        const result = await this.addSumScoreUseCase.execute({
          userId,
          additionalScore,
        });
        res.status(200).json(result);
      } catch (error: any) {
        res.status(400).json({ message: error.message });
      }
    });
  }
}
