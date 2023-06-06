import { Request, Response } from 'express';
import { SignupConfirmationService } from "./signup-confirmation-service";

export class SignupConfirmationController {
  constructor(private signupConfirmationService: SignupConfirmationService) {}

  async handle(request: Request, response: Response): Promise<Response> {
    const confirmationCode = request.params.confirmationCode;

    try {
      this.signupConfirmationService.execute(confirmationCode);
      return response.status(200).json({
        message: 'Your email has been successfully confirmed!'
      });
    } catch (e) {
      return response.status(400).json({
        error: e.message
      });
    }
  }
}