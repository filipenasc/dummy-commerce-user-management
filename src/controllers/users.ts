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

  public async confirmRegistration(request: Request, response: Response): Promise<Response> {
    try {
      const decodedToken = Auth.decodeToken(request.params.confirmationCode);
      const { email } = decodedToken;

      if (!email) {
        return response.status(401).send({ message: 'Confirmation code invalid or expired.' })
      }

      const user = await User.findOne({ email: decodedToken.email });

      if (!user?.confirmedAt) {
        await user?.updateOne({ confirmedAt: new Date() })
      }

      return response.status(200).send({
        message: 'Your email has been successfully confirmed!'
      });
    } catch (error) {
      return response.status(401).send({ message: 'Confirmation code invalid or expired.' })
    }
  }
}