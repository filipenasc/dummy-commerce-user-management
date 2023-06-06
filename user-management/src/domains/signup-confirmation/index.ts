import { MongoUsersRepository } from "../../repositories/users-repository/mongo-users-repository";
import { SignupConfirmationController } from "./signup-confirmation-controller";
import { SignupConfirmationService } from "./signup-confirmation-service";

const usersRepository = new MongoUsersRepository();
const signupConfirmationService = new SignupConfirmationService(usersRepository)
const signupConfirmationController = new SignupConfirmationController(signupConfirmationService)

export { signupConfirmationController }