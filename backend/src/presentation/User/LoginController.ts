import { Router, Request, Response } from "express";
import { LoginUseCase } from "@/src/usecase/User/LoginUseCase";
import { IUserRepository } from "@/src/domain/User/User";

export class LoginController {
  private loginUseCase: LoginUseCase;

  constructor(userRepository: IUserRepository) {
    this.loginUseCase = new LoginUseCase(userRepository);
  }

  public login(router: Router) {
    router.post("/login", async (req: Request, res: Response) => {
      try {
        const { username, password, favoriteFish } = req.body;

        const result = await this.loginUseCase.execute({
          username,
          password,
          favoriteFish,
        });

        res.status(200).json(result);
      } catch (error: any) {
        res.status(400).json({ message: error.message });
      }
    });
  }
}
