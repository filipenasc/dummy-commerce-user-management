import { User } from '../../../../entities/user';
import { GenerateTokenInterface, GenerateTokenOptionsInterface } from '../../generate-token-interface';
import jwt from 'jsonwebtoken';

export class GenerateJWTToken implements GenerateTokenInterface {
  generate(user: User, options?: GenerateTokenOptionsInterface): string {

    return jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.AUTH_SECRET_KEY,
      { expiresIn: options?.expiresIn }
    );
  }
}