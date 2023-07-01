import { Password } from "@src/services";
import mongoose from "mongoose";

const { Schema } = mongoose;

export interface UserModel {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  username: string;
  confirmedAt?: Date;
  refreshToken?: string;
}

const schema = new Schema(
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

schema.pre('save', async function (): Promise<void> {
  try {
    if (!!this.password && this.isModified('password')) {
      this.password = await Password.hash(this.password);
    }
  } catch (error) {
    console.error(error);
  }
});

export const User = mongoose.model<UserModel>('User', schema);