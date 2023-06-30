import { Request, Response } from 'express';
import { Router } from 'express';
import { AuthController } from '@src/controllers/auth';
import { UsersController } from '@src/controllers/users';

const router = Router();

router.post('/users', (req: Request, res: Response) => {
  return new UsersController().create(req, res);
});

router.post('/users/confirm-registration/:confirmationCode', (req: Request, res: Response) => {
  return new UsersController().confirmRegistration(req, res);
});

router.post('/oauth/token', (req: Request, res: Response) => {
  return new AuthController().token(req, res);
});

export { router };