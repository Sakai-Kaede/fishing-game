import mongoose, { Schema, Document, Model } from "mongoose";

export interface CardInterface {
  suit: string; // "Hearts", "Diamonds", "Clubs", "Spades"
  rank: string; // "2", "3", ..., "10", "J", "Q", "K", "A"
}

export interface IPokerGame extends Document {
  userId: string;
  deck: CardInterface[];
  hand: CardInterface[];
  hasSwapped: boolean;
  score: number;
  pokerFlag: boolean;
  doubleUpFlag: boolean;
  doubleUpCard: CardInterface;
  doubleUpSuccessCount: number;
}

const PokerGameSchema: Schema<IPokerGame> = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    deck: {
      type: [
        {
          suit: {
            type: String,
            required: true,
            enum: ["Hearts", "Diamonds", "Clubs", "Spades"],
          },
          rank: {
            type: String,
            required: true,
            enum: [
              "2",
              "3",
              "4",
              "5",
              "6",
              "7",
              "8",
              "9",
              "10",
              "J",
              "Q",
              "K",
              "A",
            ],
          },
        },
      ],
      required: true,
    },
    hand: {
      type: [
        {
          suit: {
            type: String,
            required: true,
            enum: ["Hearts", "Diamonds", "Clubs", "Spades"],
          },
          rank: {
            type: String,
            required: true,
            enum: [
              "2",
              "3",
              "4",
              "5",
              "6",
              "7",
              "8",
              "9",
              "10",
              "J",
              "Q",
              "K",
              "A",
            ],
          },
        },
      ],
      required: true,
      validate: {
        validator: (hand: CardInterface[]) => hand.length === 5,
        message: "手札は必ず5枚必要です",
      },
    },
    hasSwapped: {
      type: Boolean,
      required: true,
      default: false,
    },
    score: {
      type: Number,
      required: true,
      default: 0,
    },
    pokerFlag: {
      type: Boolean,
      required: true,
      default: false,
    },
    doubleUpFlag: {
      type: Boolean,
      required: true,
      default: false, // ダブルアップの状態（例: false = ダブルアップ無効）
    },
    doubleUpCard: {
      type: {
        suit: {
          type: String,
          required: true,
          enum: ["Hearts", "Diamonds", "Clubs", "Spades"],
        },
        rank: {
          type: String,
          required: true,
          enum: [
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "10",
            "J",
            "Q",
            "K",
            "A",
          ],
        },
      },
    },
    doubleUpSuccessCount: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

const PokerGameModel: Model<IPokerGame> = mongoose.model<IPokerGame>(
  "PokerGame",
  PokerGameSchema
);

export default PokerGameModel;
