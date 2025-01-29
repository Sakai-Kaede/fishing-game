import { Router, Request, Response } from "express";
import { RegisterUserUseCase } from "@/src/usecase/User/RegisterUserUseCase";
import { IUserRepository } from "@/src/domain/User/User";

export class RegisterUserController {
  private registerUserUseCase: RegisterUserUseCase;

  constructor(userRepository: IUserRepository) {
    this.registerUserUseCase = new RegisterUserUseCase(userRepository);
  }

  public registerUser(router: Router) {
    router.post("/register-user", async (req: Request, res: Response) => {
      try {
        const { username, password } = req.body;
        const result = await this.registerUserUseCase.execute({
          username,
          password,
        });
        res.status(200).json(result);
      } catch (error: any) {
        res.status(400).json({ message: error.message });
      }
    });
  }
}
