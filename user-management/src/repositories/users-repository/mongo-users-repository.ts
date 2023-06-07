import { User, UserModel, PersistedUserModel } from "../../models/user";
import { User as UserEntity } from "../../entities/user";
import { UsersRepositoryInterface } from "../users-repository-interface";

export class MongoUsersRepository implements UsersRepositoryInterface {
  constructor(private users = User) {}

  async findById(id: string): Promise<UserEntity> {
    return await this.users.findById(id);
  }

  async findByCredentials(username: string, password: string): Promise<UserEntity> {
    return await this.users.findOne({ username, password });
  }

  async findByUsername(username: string): Promise<UserEntity> {
    return await this.users.findOne({ username });
  }

  async findByRefreshToken(refreshToken: string): Promise<UserEntity> {
    return this.users.findOne({ refreshToken });
  }

  async create(data: UserModel): Promise<PersistedUserModel> {
    const result = await this.users.create(data);
    return result.toJSON();
  }

  async confirmEmail(id: string): Promise<void> {
    await this.users.findByIdAndUpdate(id, { $set: { confirmedAt: new Date() } });
  }

  async findByIdAndUpdate(id: string, data: any): Promise<void> {
    await this.users.findByIdAndUpdate(id, { $set: data });
  }
}