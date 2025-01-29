import { Router, Request, Response } from "express";
import { GetUserDataUseCase } from "@/src/usecase/User/GetUserDataUseCase";
import { IUserRepository } from "@/src/domain/User/User";

export class GetUserDataController {
  private getUserDataUseCase: GetUserDataUseCase;

  constructor(userRepository: IUserRepository) {
    this.getUserDataUseCase = new GetUserDataUseCase(userRepository);
  }

  public getUserData(router: Router) {
    router.get("/user-data/:userId", async (req: Request, res: Response) => {
      try {
        const { userId } = req.params;
        const result = await this.getUserDataUseCase.execute({ userId });
        res.status(200).json(result);
      } catch (error: any) {
        res.status(400).json({ message: error.message });
      }
    });
  }
}
