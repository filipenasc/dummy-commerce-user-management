import { MailTrapProvider } from "../../domains/email/providers/mail-trap-provider";
import { CreateUserService } from "./create-user-service";
import { MongoUsersRepository } from "../../repositories/users-repository/mongo-users-repository";
import { SignupController } from "./signup-controller";
import { GenerateJWTToken } from "../../domains/authentication/tokens/adapters/generate-jwt-token";

const mailProvider = new MailTrapProvider();
const repository = new MongoUsersRepository();
const tokenGenerator = new GenerateJWTToken();

const createUserService = new CreateUserService(repository, mailProvider, tokenGenerator);
const createUserController = new SignupController(createUserService);

export { createUserController };