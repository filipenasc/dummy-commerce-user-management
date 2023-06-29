// import { MongoUsersRepository } from "../users/repositories/mongo-users-repository";
import { UsersController } from "@src/controllers/users";

// const usersRepository = new MongoUsersRepository();
// const tokensController = new TokensController(generateTokenService, usersRepository);
const usersController = new UsersController();

export { usersController };