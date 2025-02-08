import { Router, Request, Response } from "express";
import { IUserRepository } from "@/src/domain/User/User";
import { DealPokerUseCase } from "@/src/usecase/Poker/DealPokerUseCase";
import { IPokerRepository } from "@/src/domain/Poker/Poker";

export class DealCardsController {
  private dealCardsUseCase: DealPokerUseCase;

  constructor(
    pokerRepository: IPokerRepository,
    userRepository: IUserRepository
  ) {
    this.dealCardsUseCase = new DealPokerUseCase(
      pokerRepository,
      userRepository
    );
  }

  public dealCards(router: Router) {
    router.post(
      "/poker/deal/:userId",
      async (req: Request, res: Response): Promise<void> => {
        try {
          const { userId } = req.params;
          const { bet } = req.body;
          if (!userId || !bet) {
            res.status(400).json({ message: "userId と bet が必要です。" });
            return;
          }
          const result = await this.dealCardsUseCase.execute(userId, bet);
          res.status(200).json({
            success: true,
            message: "カードが配られました。",
            POKER_DEAL: result,
          });
        } catch (error: any) {
          res.status(400).json({ message: error.message });
        }
      }
    );
  }
}
