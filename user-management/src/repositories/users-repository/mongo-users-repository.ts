import { User } from "../../entities/user";
import { UsersRepositoryInterface } from "../users-repository-interface";

export class MongoUsersRepository implements UsersRepositoryInterface {
  private users: User[] = [];

  async find(id: string): Promise<User> {
    return this.users.find(user => user.id === id);
  }

  async findByCredentials(username: string, password: string): Promise<User> {
    return this.users.find(user => user.username === username && user.password === password);
  }

  async findByUsername(username: string): Promise<User> {
    return this.users.find(user => user.username === username);
  }

  async findByRefreshToken(refreshToken: string): Promise<User> {
    return this.users.find(user => user.refreshToken === refreshToken);
  }

  async create(user: User): Promise<void> {
    this.users.push(user);
  }

  async confirmEmail(id: string): Promise<void> {
    this.users.forEach(user => {
      if (user.id === id) {
        user.confirmed = true;
      }
    });
  }
}