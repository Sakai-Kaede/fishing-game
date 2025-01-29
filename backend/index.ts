import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import helmet from "helmet";
import connectDB from "@/src/infrastructure/db/mongoConnection";

import { UserRepository } from "@/src/infrastructure/User/UserRepository";
import { AddSumScoreController } from "@/src/presentation/User/AddSumScoreController";
import { GetUserDataController } from "@/src/presentation/User/GetUserDataController";
import { IncrementCaughtFishCountController } from "@/src/presentation/User/IncrementCaughtFishCountController";
import { RegisterUserController } from "@/src/presentation/User/RegisterUserController";
import { UpdateFishingRodLevelController } from "@/src/presentation/User/UpdateFishingRodLevelController";
import { IUserRepository } from "./src/domain/User/User";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(helmet());
app.use(express.json());

// インフラ層のリポジトリをインスタンス化
const userRepository: IUserRepository = new UserRepository();

// プレゼンテーション層のコントローラをインスタンス化
const addSumScoreController = new AddSumScoreController(userRepository);
const getUserDataController = new GetUserDataController(userRepository);
const incrementCaughtFishCountController =
  new IncrementCaughtFishCountController(userRepository);
const registerUserController = new RegisterUserController(userRepository);
const updateFishingRodLevelController = new UpdateFishingRodLevelController(
  userRepository
);

// エンドポイントを登録
addSumScoreController.addSumScore(app);
getUserDataController.getUserData(app);
incrementCaughtFishCountController.incrementCaughtFishCount(app);
registerUserController.registerUser(app);
updateFishingRodLevelController.updateFishingRodLevel(app);

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
