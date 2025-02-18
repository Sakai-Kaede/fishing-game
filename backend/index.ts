import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import helmet from "helmet";
import connectDB from "@/src/infrastructure/db/mongoConnection";

import { UserRepository } from "@/src/infrastructure/User/UserRepository";
import { GetUserDataController } from "@/src/presentation/User/GetUserDataController";
import { RegisterUserController } from "@/src/presentation/User/RegisterUserController";
import { UpdateFishingRodLevelController } from "@/src/presentation/User/UpdateFishingRodLevelController";
import { LoginController } from "@/src/presentation/User/LoginController";
import { GetRankingController } from "@/src/presentation/User/GetRankingController";
import { IUserRepository } from "@/src/domain/User/User";

import { FishRepository } from "@/src/infrastructure/Fish/FishRepository";
import { CaughtFishController } from "@/src/presentation/Fish/CatchFishController";
import { CreatePreFishController } from "@/src/presentation/Fish/CreatePreFishController";
import { IFishRepository } from "@/src/domain/Fish/Fish";

import { PokerRepository } from "@/src/infrastructure/Poker/PokerRepository";
import { ChangeAndCalculateHandController } from "@/src/presentation/Poker/ChangeAndCalculateHandController";
import { DealCardsController } from "@/src/presentation/Poker/DealCardsController";
import { DealDoubleUpController } from "@/src/presentation/Poker/DealDoubleUpController";
import { JudgeDoubleUpController } from "@/src/presentation/Poker/JudgeDoubleUpController";
import { IPokerRepository } from "@/src/domain/Poker/Poker";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(helmet());
app.use(express.json());

// インフラ層のリポジトリをインスタンス化
const userRepository: IUserRepository = new UserRepository();
const fishRepository: IFishRepository = new FishRepository();
const pokerRepository: IPokerRepository = new PokerRepository();

// プレゼンテーション層のコントローラをインスタンス化
const getUserDataController = new GetUserDataController(userRepository);
const registerUserController = new RegisterUserController(userRepository);
const updateFishingRodLevelController = new UpdateFishingRodLevelController(
  userRepository
);
const loginController = new LoginController(userRepository);
const getRankingController = new GetRankingController(userRepository);

const createFishController = new CreatePreFishController(
  fishRepository,
  userRepository
);
const catchFishController = new CaughtFishController(
  fishRepository,
  userRepository
);

const calculateHandScoreController = new ChangeAndCalculateHandController(
  pokerRepository
);
const dealCardsController = new DealCardsController(
  pokerRepository,
  userRepository
);
const dealDoubleUpController = new DealDoubleUpController(
  pokerRepository,
  userRepository
);
const judgeDoubleUpController = new JudgeDoubleUpController(
  pokerRepository,
  userRepository
);

// エンドポイントを登録
getUserDataController.getUserData(app);
registerUserController.registerUser(app);
updateFishingRodLevelController.updateFishingRodLevel(app);
loginController.login(app);
getRankingController.getRanking(app);

createFishController.createPreFish(app);
catchFishController.caughtFish(app);

calculateHandScoreController.changeAndCalculateHand(app);
dealCardsController.dealCards(app);
dealDoubleUpController.dealDoubleUp(app);
judgeDoubleUpController.judgeDoubleUp(app);

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`サーバーがポート${port}で起動しました`);
    });
  })
  .catch((error) => {
    console.error("DB接続に失敗しました:", error);
    process.exit(1);
  });
