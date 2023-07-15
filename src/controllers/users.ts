import { Request, Response } from 'express';
import { User } from '@src/models';
import { SignupEmailConfirmation } from '@src/services/signup/emailConfirmation';
import { Auth, DecodedToken } from '@src/services/auth';
import { BaseController } from './base';
import { AuthError } from '@src/lib/errors';

export class UsersController extends BaseController {
  constructor(private signupConfirmationService = new SignupEmailConfirmation()) {
    super()
  }

  public async create(request: Request, response: Response): Promise<void> {
    try {
      const {
        id,
        email,
        firstName,
        lastName,
      } = await new User(request.body).save();

      this.signupConfirmationService.sendEmail({
        email,
        name: firstName,
      })

      response.status(201).send({
        id,
        email,
        firstName,
        lastName,
      });
    } catch (error) {
      this.sendErrorResponse(response, error as Error);
    }
  }

  public async confirmRegistration(request: Request, response: Response): Promise<void> {
    try {
      const decodedToken = this.decodeConfirmationCode(request.params.confirmationCode);
      const { email } = decodedToken;

      if (!email) {
        throw new AuthError('Confirmation code invalid or expired.');
      }

      const user = await User.findOne({ email: decodedToken.email });

      if (!user?.confirmedAt) {
        await user?.updateOne({ confirmedAt: new Date() })
      }

      response.status(200).send({
        message: 'Your email has been successfully confirmed!'
      });
    } catch (error) {
      this.sendErrorResponse(response, error as Error);
    }
  }

  private decodeConfirmationCode(code: string): DecodedToken {
    try {
      return Auth.decodeToken(code);
    } catch (error) {
      throw new AuthError('Confirmation code invalid or expired.');
    }
  }
}
