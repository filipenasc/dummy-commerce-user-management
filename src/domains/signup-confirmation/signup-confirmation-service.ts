import jwt from 'jsonwebtoken';
import { UsersRepositoryInterface } from "../users/repositories/users-repository.interface";

export class SignupConfirmationService {
  constructor(private usersRepository: UsersRepositoryInterface) {}

  execute(confirmationCode: string): void {
    jwt.verify(confirmationCode, process.env.AUTH_SECRET_KEY, (err, user) => {
      if (err) {
        throw new Error(`Invalid confirmation code: ${err}`);
      } else {
        this.usersRepository.confirmEmail(user.id)
      }
    });
  }
}