import { signupConfirmationController } from './domains/signup-confirmation';
import { generateTokenController, generateRefreshTokenController } from './domains/authentication';
import { createUserController } from './domains/signup';
import { Router } from 'express';

const router = Router();

router.post('/api/login', (req, res) => {
  return generateTokenController.handle(req, res);
});

router.post('/api/refresh', (req, res) => {
  return generateRefreshTokenController.handle(req, res);
});

router.post('/api/users', (req, res) => {
  return createUserController.handle(req, res);
});

router.post('/confirmation/:confirmationCode', (req, res) => {
  return signupConfirmationController.handle(req, res);
});

export { router };