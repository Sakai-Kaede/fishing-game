import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  username: string;
  userId: string;
  password: string;
  sumScore: number;
  fishingRodLevel: number;
  caughtFish: {
    name: string;
    count: number;
  }[];
}

const UserSchema: Schema<IUser> = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 3,
      maxlength: 25,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 100,
    },
    sumScore: {
      type: Number,
      required: true,
      default: 0,
    },
    fishingRodLevel: {
      type: Number,
      required: true,
      default: 1,
    },
    caughtFish: {
      type: [
        {
          name: { type: String, required: true },
          count: { type: Number, required: true },
        },
      ],
    },
  },
  { timestamps: true }
);

const UserModel: Model<IUser> = mongoose.model<IUser>("User", UserSchema);
export default UserModel;
