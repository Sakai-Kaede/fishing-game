import { Router, Request, Response } from "express";
import { UpdateFishingRodLevelUseCase } from "@/src/usecase/User/UpdateFishingRodLevelUseCase";
import { IUserRepository } from "@/src/domain/User/User";

export class UpdateFishingRodLevelController {
  private updateFishingRodLevelUseCase: UpdateFishingRodLevelUseCase;

  constructor(userRepository: IUserRepository) {
    this.updateFishingRodLevelUseCase = new UpdateFishingRodLevelUseCase(
      userRepository
    );
  }

  public updateFishingRodLevel(router: Router) {
    router.post("/update-rod/:userId", async (req: Request, res: Response) => {
      try {
        const { userId } = req.params;
        const { fishingRodLevel } = req.body;
        const result = await this.updateFishingRodLevelUseCase.execute({
          userId,
          fishingRodLevel,
        });
        res.status(200).json(result);
      } catch (error: any) {
        res.status(400).json({ message: error.message });
      }
    });
  }
}
