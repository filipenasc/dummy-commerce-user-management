import { Request, Response } from 'express';
import { signupConfirmationController } from './domains/signup-confirmation';
import { tokensController } from './domains/tokens';
import { usersController } from './domains/users';
import { Router } from 'express';

const router = Router();

router.post('/api/login', (req: Request, res: Response) => {
  return tokensController.generateToken(req, res);
});

router.post('/api/refresh', (req: Request, res: Response) => {
  return tokensController.refreshToken(req, res);
});

router.post('/api/users', (req: Request, res: Response) => {
  return usersController.create(req, res);
});

router.get('/confirmation/:confirmationCode', (req: Request, res: Response) => {
  return signupConfirmationController.handle(req, res);
});

export { router };