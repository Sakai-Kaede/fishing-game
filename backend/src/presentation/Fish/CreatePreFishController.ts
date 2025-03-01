import { Router, Request, Response } from "express";
import { CreatePreFishUseCase } from "../../usecase/Fish/CreatePreFishUseCase";
import { IFishRepository } from "../../domain/Fish/Fish";
import { IUserRepository } from "../../domain/User/User";

export class CreatePreFishController {
  private createPreFishUseCase: CreatePreFishUseCase;

  constructor(
    fishRepository: IFishRepository,
    userRepository: IUserRepository
  ) {
    this.createPreFishUseCase = new CreatePreFishUseCase(
      fishRepository,
      userRepository
    );
  }

  public createPreFish(router: Router) {
    router.post("/get-fish/:userId", async (req: Request, res: Response) => {
      try {
        const { userId } = req.params;
        const { depth } = req.body;
        if (!userId) {
          throw new Error("User ID is required");
        }
        if (!userId) {
          throw new Error("Depth is required");
        }
        const result = await this.createPreFishUseCase.execute(userId, depth);
        res.status(200).json(result);
      } catch (error: any) {
        res.status(400).json({ message: error.message });
      }
    });
  }
}
