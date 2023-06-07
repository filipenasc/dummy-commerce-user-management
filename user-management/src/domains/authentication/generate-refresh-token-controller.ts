import { Request, Response } from 'express';
import { GenerateTokenService } from "./generate-token-service";
import { UsersRepositoryInterface } from '../../repositories/users-repository-interface';

export class GenerateRefreshTokenController {
  constructor(private generateTokenService: GenerateTokenService, private usersRepository: UsersRepositoryInterface) { }

  async handle(request: Request, response: Response): Promise<Response> {
    const { refresh_token: refreshToken } = request.body;

    try {
      const user = await this.usersRepository.findByRefreshToken(refreshToken);

      if (user) {
        const accessToken = this.generateTokenService.execute(user.id);

        const responsePayload = {
          username: user.username,
          accessToken,
          refreshToken,
        }

        return response.status(201).json(responsePayload);
      } else {
        response.status(403).json({ message: 'Invalid refresh token' });
      }

    } catch (e) {
      return response.status(400).json({
        message: e.message || 'Unexpected error'
      });
    }
  }
}