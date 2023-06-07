import { User } from '../../../../entities/user';
import { GenerateTokenInterface, GenerateTokenOptionsInterface } from '../../generate-token-interface';
import jwt from 'jsonwebtoken';

export class GenerateJWTToken implements GenerateTokenInterface {
  generate(userId: string, options?: GenerateTokenOptionsInterface): string {
    return jwt.sign(
      {
        id: userId,
      },
      process.env.AUTH_SECRET_KEY,
      { ...options }
    );
  }
}