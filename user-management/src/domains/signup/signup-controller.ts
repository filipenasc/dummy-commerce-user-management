import { Request, Response } from 'express';
import { CreateUserService } from "./create-user-service";

export class SignupController {
  constructor(private createUserService: CreateUserService) {}

  async handle(request: Request, response: Response): Promise<Response> {
    const { username, password, email } = request.body;

    try {
      await this.createUserService.execute({
        username,
        email,
        password,
      });

      return response.status(201).send();
    } catch (err) {
      return response.status(400).json({
        message: err.message || 'Unexpected error'
      })
    }
  }
}