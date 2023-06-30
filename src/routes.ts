import { Request, Response } from 'express';
// import { signupConfirmationController } from './domains/signup-confirmation';
import { Router } from 'express';
import { AuthController } from '@src/controllers/auth';
import { UsersController } from '@src/controllers/users';

const router = Router();

router.post('/users', (req: Request, res: Response) => {
  return new UsersController().create(req, res);
});

router.post('/oauth/token', (req: Request, res: Response) => {
  return new AuthController().token(req, res);
});

// router.post('/api/refresh', (req: Request, res: Response) => {
//   return tokensController.refresh(req, res);
// });

// router.post('/api/users', (req: Request, res: Response) => {
//   return usersController.create(req, res);
// });

// router.get('/confirmation/:confirmationCode', (req: Request, res: Response) => {
//   return signupConfirmationController.handle(req, res);
// });

export { router };