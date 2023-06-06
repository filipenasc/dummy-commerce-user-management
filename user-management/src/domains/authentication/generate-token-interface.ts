import { User } from "../../entities/user";

export interface GenerateTokenOptionsInterface {
  expiresIn: string;
}

export interface GenerateTokenInterface {
  generate(user: User, options?: GenerateTokenOptionsInterface): string;
}