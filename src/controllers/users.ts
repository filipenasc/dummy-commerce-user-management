import { Request, Response } from 'express';
import { User } from '@src/models/user';
import { Auth } from '@src/services/auth';

export interface UserCredentialsRequest {
  email: string;
  password: string;
}

export interface UserCredentialsResponse {
  email: string;
  accessToken: string;
  refreshToken: string;
}

export class UsersController {
  public async refreshToken(request: Request, response: Response): Promise<Response> {
    try {
      const { refreshToken } = request.body;
      const user = await User.findOne({ refreshToken });

      if (!user) {
        return response.status(401).send({
          message: 'Invalid refresh token.'
        });
      }

      const responsePayload = {
        email: user.email,
        accessToken: Auth.generateToken(user.toJSON(), { expiresIn: '1d' }),
        refreshToken: user.refreshToken,
      };

      return response.status(200).json(responsePayload);
    } catch (error) {
      console.error(error);
      return response.status(500).send({ message: 'Unexpected Error' })
    }
  }

  public async create(request: Request, response: Response): Promise<void> {
    try {
      const user = await new User(request.body).save();
      response.status(201).send({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
        id: user.id,
      });
    } catch (error) {
      console.error(error);
      response.status(500).send({ message: 'Unexpected Error' })
    }
  }

  public async authenticate(request: Request, response: Response): Promise<Response> {
    try {
      const { email, password } = request.body;
      const user = await User.findOne({ email });

      if (!user) {
        return response.status(401).send({
          message: 'Invalid email and/or password.'
        });
      }

      const validPassword = await Auth.comparePasswords(password, user.password);

      if (!validPassword) {
        return response.status(401).send({
          message: 'Invalid email and/or password.'
        });
      }
      const responsePayload = {
        email,
        accessToken: Auth.generateToken(user.toJSON(), { expiresIn: '1d' }),
        refreshToken: user.refreshToken,
      };

      return response.status(200).json(responsePayload);
    } catch (error) {
      console.error(error);
      return response.status(500).send({ message: 'Unexpected Error' })
    }
  }
}