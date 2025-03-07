import mongoose, { Schema, Document, Model } from "mongoose";
import { FishInterface } from "../config/types";

export interface IPreFish extends Document {
  fish: FishInterface;
  userId: string;
  randomId: string;
  isInvalid: boolean;
  createdAt: Date;
}

const IPreFish: Schema<IPreFish> = new mongoose.Schema(
  {
    fish: {
      type: {
        name: { type: String, required: true },
        score: { type: Number, required: true },
        requiredInteractions: { type: Number, required: true },
      },
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    randomId: {
      type: String,
      required: true,
    },
    isInvalid: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

const PreFishModel: Model<IPreFish> = mongoose.model<IPreFish>(
  "PreFish",
  IPreFish
);
export default PreFishModel;
