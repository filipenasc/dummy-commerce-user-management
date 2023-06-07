import mongoose from "mongoose";

const { Schema, Model } = mongoose;

export interface UserModel {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  username: string;
  confirmedAt?: Date;
  refreshToken?: string;
};

export interface PersistedUserModel extends UserModel {
  id: string;
}

const userSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    username: { type: String, required: true },
    confirmedAt: { type: Date, required: false },
    refreshToken: { type: String, required: false },
  },
  {
    toJSON: {
      transform: (_, obj): void => {
        obj.id = obj._id.toString();
        delete obj._id;
        delete obj.__v;
      },
    },
  }
);

export const User = mongoose.model<UserModel>('User', userSchema);