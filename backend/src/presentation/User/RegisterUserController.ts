import { Router, Request, Response } from "express";
import { RegisterUserUseCase } from "@/src/usecase/User/RegisterUserUseCase";
import { IUserRepository } from "@/src/domain/User/User";

export class RegisterUserController {
  private registerUserUseCase: RegisterUserUseCase;

  constructor(userRepository: IUserRepository) {
    this.registerUserUseCase = new RegisterUserUseCase(userRepository);
  }

  public registerUser(router: Router) {
    router.post("/register", async (req: Request, res: Response) => {
      try {
        const { username, password, favoriteFish } = req.body;
        const result = await this.registerUserUseCase.execute({
          username,
          password,
          favoriteFish,
        });
        res.status(200).json(result);
      } catch (error: any) {
        if (error.message === "その名前は既に使用されています") {
          // 重複したユーザー名の場合は 409 Conflict
          res.status(409).json({ message: error.message });
        } else {
          // その他のエラーは 400 Bad Request
          res.status(400).json({ message: error.message });
        }
      }
    });
  }
}
