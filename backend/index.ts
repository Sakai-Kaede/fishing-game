import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import helmet from "helmet";
import connectDB from "@/src/infrastructure/db/mongoConnection";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(helmet());
app.use(express.json());

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
