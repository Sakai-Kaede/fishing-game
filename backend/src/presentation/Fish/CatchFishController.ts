import { Router, Request, Response } from "express";
import { CaughtFishUseCase } from "../../usecase/Fish/CatchFishUseCase";
import { IFishRepository } from "../../domain/Fish/Fish";
import { IUserRepository } from "../../domain/User/User";

export class CaughtFishController {
  private caughtFishUseCase: CaughtFishUseCase;

  constructor(
    fishRepository: IFishRepository,
    userRepository: IUserRepository
  ) {
    this.caughtFishUseCase = new CaughtFishUseCase(
      fishRepository,
      userRepository
    );
  }
  public caughtFish(router: Router) {
    router.post(
      "/catch-fish/:userId",
      async (req: Request, res: Response): Promise<void> => {
        try {
          const { userId } = req.params;
          const { randomId } = req.body;
          if (!userId || !randomId) {
            res.status(400).json({ message: "userId と fish が必要です。" });
            return;
          }
          const result = await this.caughtFishUseCase.execute(userId, randomId);

          res.status(200).json(result);
        } catch (error: any) {
          res.status(400).json({ message: error.message });
        }
      }
    );
  }
}
