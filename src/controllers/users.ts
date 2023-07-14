import { Request, Response } from 'express';
import { User } from '@src/models';
import { SignupEmailConfirmation } from '@src/services/signup/emailConfirmation';
import { Auth } from '@src/services/auth';
import { BaseController } from './base';

export class UsersController extends BaseController {
  constructor(private signupConfirmationService = new SignupEmailConfirmation()) {
    super()
  }

  public async create(request: Request, response: Response): Promise<void> {
    try {
      const user = await new User(request.body).save();

      this.signupConfirmationService.sendEmail({
        name: user.firstName,
        email: user.email,
      })

      response.status(201).send({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        id: user.id,
      });
    } catch (error) {
      this.sendErrorResponse(response, error as Error);
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
