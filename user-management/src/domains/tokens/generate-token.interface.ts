import { User } from "../../entities/user";

export interface GenerateTokenOptionsInterface {
  expiresIn: string;
}

export interface GenerateTokenInterface {
  generate(userId: string, options?: GenerateTokenOptionsInterface): string;
}