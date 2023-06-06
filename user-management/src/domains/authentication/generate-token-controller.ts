import { Request, Response } from 'express';
import { GenerateTokenService } from "./generate-token-service";
import { UsersRepositoryInterface } from '../../repositories/users-repository-interface';

export class GenerateTokenController {
  constructor(private generateTokenService: GenerateTokenService, private usersRepository: UsersRepositoryInterface) { }

  async handle(request: Request, response: Response): Promise<Response> {
    const { username, password } = request.body;

    try {
      const user = await this.usersRepository.findByCredentials(username, password);

      if (user) {
        const accessToken = this.generateTokenService.execute(user, { expiresIn: '30s' });
        const refreshToken = this.generateTokenService.execute(user);

        const responsePayload = {
          username: user.username,
          accessToken,
          refreshToken,
        }

        return response.status(200).json(responsePayload);
      } else {
        response.status(401).json({ message: 'Invalid name or password' })
      }
    } catch (e) {
      return response.status(400).json({
        message: e.message || 'Unexpected error'
      })
    }
  }
}