import { Request, Response } from 'express';
import { User } from '@src/models/user';
import { Auth } from '@src/services/auth';
import { Password } from '@src/services/password';

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
}