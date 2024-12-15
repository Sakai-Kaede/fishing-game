import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import { UserRepository } from "@/src/infrastructure/User/UserRepository";
import { RegisterController } from "@/src/presentation/User/RegisterController";
import { IUserRepository } from "@/src/domain/User/User";
import connectDB from "@/src/infrastructure/db/mongoConnection";
import helmet from 'helmet';

const app = express();
const port = process.env.PORT || 3000;
app.use(helmet());
app.use(express.json());

// インフラ層のリポジトリをインスタンス化
const userRepository: IUserRepository = new UserRepository();

// プレゼンテーション層のコントローラをインスタンス化
const registerController = new RegisterController(userRepository);

// エンドポイントを登録
registerController.registerUser(app);

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`サーバーがポート${port}で起動しました`);
  });
}).catch((error) => {
  console.error('DB接続に失敗しました:', error);
  process.exit(1);
});