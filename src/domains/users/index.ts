import { MailTrapProvider } from "../email/providers/mail-trap.provider";
import { CreateUserService } from "./create-user.service";
import { MongoUsersRepository } from "./repositories/mongo-users-repository";
import { UsersController } from "./users.controller";
import { GenerateJWTToken } from "../tokens/adapters/jwt.adapter";

const mailProvider = new MailTrapProvider();
const repository = new MongoUsersRepository();
const tokenGenerator = new GenerateJWTToken();

const createUserService = new CreateUserService(repository, mailProvider, tokenGenerator);
const usersController = new UsersController(createUserService);

export { usersController };