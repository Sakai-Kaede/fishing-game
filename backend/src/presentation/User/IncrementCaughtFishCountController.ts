import { Router, Request, Response } from "express";
import { IncrementCaughtFishCountUseCase } from "@/src/usecase/User/IncrementCaughtFishCountUseCase";
import { IUserRepository } from "@/src/domain/User/User";

export class IncrementCaughtFishCountController {
  private incrementCaughtFishCountUseCase: IncrementCaughtFishCountUseCase;

  constructor(userRepository: IUserRepository) {
    this.incrementCaughtFishCountUseCase = new IncrementCaughtFishCountUseCase(
      userRepository
    );
  }

  public incrementCaughtFishCount(router: Router) {
    router.post("/caught-fish/:userId", async (req: Request, res: Response) => {
      try {
        const { userId } = req.params;
        const { name } = req.body;
        const result = await this.incrementCaughtFishCountUseCase.execute({
          userId,
          name,
        });
        res.status(200).json(result);
      } catch (error: any) {
        res.status(400).json({ message: error.message });
      }
    });
  }
}
