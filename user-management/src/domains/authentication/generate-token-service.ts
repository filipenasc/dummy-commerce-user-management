import { GenerateTokenInterface, GenerateTokenOptionsInterface } from './generate-token-interface';
import { User } from '../../entities/user';

export class GenerateTokenService {
  constructor(private tokenGenerator: GenerateTokenInterface) {}

  execute(user: User, options?: GenerateTokenOptionsInterface): string {
    return this.tokenGenerator.generate(user, options);
  }
}