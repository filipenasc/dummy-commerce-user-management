import jwt from 'jsonwebtoken';
import { UsersRepositoryInterface } from "../../repositories/users-repository-interface";

export class SignupConfirmationService {
  constructor(private usersRepository: UsersRepositoryInterface) {}

  execute(confirmationCode: string): void {
    console.log({ confirmationCode })
    jwt.verify(confirmationCode, process.env.AUTH_SECRET_KEY, (err, user) => {
      if (err) {
        throw new Error(`Invalid confirmation code: ${err}`);
      } else {
        console.log({user})
      }
    });
  }
}