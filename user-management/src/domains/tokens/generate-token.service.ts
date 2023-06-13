import { GenerateTokenInterface, GenerateTokenOptionsInterface } from './generate-token.interface';
import { User } from '../../entities/user';

export class GenerateTokenService {
  constructor(private tokenGenerator: GenerateTokenInterface) {}

  execute(userId: string, options?: GenerateTokenOptionsInterface): string {
    return this.tokenGenerator.generate(userId, options);
  }
}