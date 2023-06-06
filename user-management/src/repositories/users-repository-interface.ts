import { User } from "../entities/user";

export interface UsersRepositoryInterface {
  find(id: string): Promise<User>;
  findByUsername(username: string): Promise<User>;
  findByRefreshToken(refreshToken: string): Promise<User>;
  findByCredentials(username: string, password: string): Promise<User>;
  create(user: User): Promise<void>;
  confirmEmail(id: string): Promise<void>;
}
