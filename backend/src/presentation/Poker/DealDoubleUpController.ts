import { IPokerRepository } from "../../domain/Poker/Poker";
import { Router, Request, Response } from "express";
import { DealDoubleUpUseCase } from "../../usecase/Poker/DealDoubleUpUseCase";
import { IUserRepository } from "../../domain/User/User";

export class DealDoubleUpController {
  private dealDoubleUpUseCase: DealDoubleUpUseCase;

  constructor(
    pokerRepository: IPokerRepository,
    userRepository: IUserRepository
  ) {
    this.dealDoubleUpUseCase = new DealDoubleUpUseCase(
      pokerRepository,
      userRepository
    );
  }

  public dealDoubleUp(router: Router) {
    router.post(
      "/double-up/deal/:userId",
      async (req: Request, res: Response): Promise<void> => {
        try {
          const { userId } = req.params;
          const { isDoubleUp } = req.body;

          if (!userId || typeof isDoubleUp !== "boolean") {
            res
              .status(400)
              .json({ message: "userId と isDoubleUp が必要です。" });
            return;
          }

          const result = await this.dealDoubleUpUseCase.execute(
            userId,
            isDoubleUp
          );
          res.status(200).json({
            success: true,
            message: isDoubleUp
              ? "ダブルアップ用のカードを配布しました。"
              : "ダブルアップをキャンセルしました。",
            DOUBLEUP_DEAL: result || null,
          });
        } catch (error: any) {
          res.status(400).json({ message: error.message });
        }
      }
    );
  }
}
