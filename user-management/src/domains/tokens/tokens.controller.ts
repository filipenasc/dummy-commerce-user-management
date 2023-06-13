import { Request, Response } from 'express';
import { GenerateTokenService } from "./generate-token.service";
import { UsersRepositoryInterface } from '../users/repositories/users-repository.interface';
import { comparePassword } from '../../lib/passwordHashing';

export class TokensController {
  constructor(private generateTokenService: GenerateTokenService, private usersRepository: UsersRepositoryInterface) { }

  async refreshToken(request: Request, response: Response): Promise<Response> {
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

  async generateToken(request: Request, response: Response): Promise<Response> {
    const { username, password } = request.body;

    try {
      const user = await this.usersRepository.findByUsername(username);
      console.log(request.body)
      if (user && !user.confirmedAt) {
        return response.status(401).json({ message: 'E-mail not confirmed' })
      }

      if (user && comparePassword(password, user.password)) {
        const accessToken = this.generateTokenService.execute(user.id, { expiresIn: '30s' });
        const refreshToken = this.generateTokenService.execute(user.id);

        await this.usersRepository.findByIdAndUpdate(user.id, { refreshToken });

        const responsePayload = {
          email: user.email,
          accessToken,
          refreshToken,
        }

        return response.status(200).json(responsePayload);
      } else {
        console.log('password does not match')
        return response.status(401).json({ message: 'Invalid name or password' })
      }
    } catch (e) {
      return response.status(400).json({
        message: e.message || 'Unexpected error'
      })
    }
  }
}