import request from 'supertest';
import { app, server } from '@src/index';
import { User } from '@src/models';
import { Auth, SignupEmailConfirmation } from '@src/services';
import { connection } from 'mongoose';

afterAll(() => {
  server.close();
  connection.close();
});

const userData = {
  firstName: 'firstName',
  lastName: 'lastName',
  email: 'user@example.org',
  password: 'password',
  username: 'username',
  refreshToken: 'refresh-token',
};

jest.mock('@src/services/signup/emailConfirmation');

describe('Users', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('create', () => {
    const MockedSignupService = SignupEmailConfirmation as jest.MockedClass<typeof SignupEmailConfirmation>;

    const newUser = {
      firstName: 'firstName',
      lastName: 'lastName',
      email: 'user@example.org',
      password: 'password',
      username: 'username',
    };

    it('returns the created user with a 201 status', async () => {
      const { status, body } = await request(app).post('/users').send(newUser);
      expect(status).toEqual(201);
      expect(body).toEqual(expect.objectContaining({
        firstName: 'firstName',
        lastName: 'lastName',
        email: 'user@example.org',
        username: 'username',
        id: expect.any(String),
      }));
      const signupConfirmationService = MockedSignupService.mock.instances[0];
      expect(signupConfirmationService.sendEmail).toHaveBeenCalledWith({
        email: newUser.email,
        name: newUser.firstName,
      });
    });
  });

  describe('confirm registration', () => {
    beforeEach(async () => {
      await new User(userData).save();
    });

    describe('when the confirmation code is valid', () => {
      it('returns success', async () => {
        const confirmationCode = await Auth.generateToken({ email: userData.email }, { expiresIn: '1h' });
        const { status, body } = await request(app).post(`/users/confirm-registration/${confirmationCode}`).send();
        expect(status).toEqual(200);
        expect(body).toEqual({ message: 'Your email has been successfully confirmed!' });
        const user = await User.findOne({ email: userData.email });
        expect(user?.confirmedAt).toBeTruthy();
      });
    });

    describe('when the confirmation code is invalid', () => {
      it('returns an error message', async () => {
        const confirmationCode = '123456';
        const { status, body } = await request(app).post(`/users/confirm-registration/${confirmationCode}`).send();
        expect(status).toEqual(401);
        expect(body).toEqual({ message: 'Confirmation code invalid or expired.' });
      });
    });
  });
});