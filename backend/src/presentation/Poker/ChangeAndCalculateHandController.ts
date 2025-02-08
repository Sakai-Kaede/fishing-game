import { IPokerRepository } from "@/src/domain/Poker/Poker";
import { Router, Request, Response } from "express";
import { ChangeAndCalculateHandUseCase } from "@/src/usecase/Poker/ChangeAndCalculateHandUseCase";

export class ChangeAndCalculateHandController {
  private calculateHandScoreUseCase: ChangeAndCalculateHandUseCase;

  constructor(pokerRepository: IPokerRepository) {
    this.calculateHandScoreUseCase = new ChangeAndCalculateHandUseCase(
      pokerRepository
    );
  }

  public changeAndCalculateHand(router: Router) {
    router.post(
      "/poker/change-calculate/:userId",
      async (req: Request, res: Response): Promise<void> => {
        try {
          const { userId } = req.params;
          const { swapIndices } = req.body;
          if (!userId || !swapIndices) {
            res
              .status(400)
              .json({ message: "userId と swapIndices が必要です。" });
            return;
          }
          const result = await this.calculateHandScoreUseCase.execute(
            userId,
            swapIndices
          );
          res.status(200).json({
            success: true,
            message: "手札の得点を計算しました。",
            POKER_RESULT: result,
          });
        } catch (error: any) {
          res.status(400).json({ message: error.message });
        }
      }
    );
  }
}
