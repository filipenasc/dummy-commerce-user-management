import { UserModel, PersistedUserModel } from "../models/user";
import { User } from "../entities/user";

export interface UsersRepositoryInterface {
  findById(id: string): Promise<User>;
  findByUsername(username: string): Promise<User>;
  findByRefreshToken(refreshToken: string): Promise<User>;
  findByCredentials(username: string, password: string): Promise<User>;
  create(user: UserModel): Promise<PersistedUserModel>;
  confirmEmail(id: string): Promise<void>;
  findByIdAndUpdate(id: string, data: any): Promise<void>;
}
