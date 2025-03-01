import { IPokerRepository } from "../../domain/Poker/Poker";
import { Router, Request, Response } from "express";
import { JudgeDoubleUpUseCase } from "../../usecase/Poker/JudgeDoubleUpUseCase";
import { IUserRepository } from "../../domain/User/User";

export class JudgeDoubleUpController {
  private judgeDoubleUpUseCase: JudgeDoubleUpUseCase;

  constructor(
    pokerRepository: IPokerRepository,
    userRepository: IUserRepository
  ) {
    this.judgeDoubleUpUseCase = new JudgeDoubleUpUseCase(
      pokerRepository,
      userRepository
    );
  }

  public judgeDoubleUp(router: Router) {
    router.post(
      "/double-up/judge/:userId",
      async (req: Request, res: Response): Promise<void> => {
        try {
          const { userId } = req.params;
          const { guess } = req.body;

          if (!userId || !guess) {
            res.status(400).json({ message: "userId と guess が必要です。" });
            return;
          }

          const result = await this.judgeDoubleUpUseCase.execute(userId, guess);
          // 結果と引いたカードをレスポンスに含める
          res.status(200).json({
            success: true,
            message: result.guessCorrect
              ? "ダブルアップ成功！"
              : "ダブルアップ失敗。",
            DOUBLEUP_RESULT: result,
          });
        } catch (error: any) {
          res.status(400).json({ message: error.message });
        }
      }
    );
  }
}
