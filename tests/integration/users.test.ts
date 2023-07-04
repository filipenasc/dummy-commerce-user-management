import { expect, jest } from '@jest/globals';
import { User } from '@src/models';
import { Auth } from '@services/auth';
import { SignupEmailConfirmation } from '@services/signup/emailConfirmation';

describe('Users', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('create', () => {
    const newUser = {
      firstName: 'firstName',
      lastName: 'lastName',
      email: 'user@example.org',
      password: 'password',
      username: 'username',
    };

    it('returns the created user with a 201 status', async () => {
      const signupEmailConfirmation = jest.spyOn(SignupEmailConfirmation.prototype, 'sendEmail').mockResolvedValueOnce();
      const { status, body } = await global.testRequest.post('/users').send(newUser);
      expect(status).toEqual(201);
      expect(body).toEqual(expect.objectContaining({
        firstName: 'firstName',
        lastName: 'lastName',
        email: 'user@example.org',
        username: 'username',
        id: expect.any(String),
      }));
      expect(signupEmailConfirmation).toHaveBeenCalledWith({
        email: newUser.email,
        name: newUser.firstName,
      });
    });
  });

  describe('confirm registration', () => {
    const email = 'user@example.org'

    beforeEach(async () => {
      await new User({
        email,
        firstName: 'firstName',
        lastName: 'lastName',
        password: 'password',
        username: 'username',
        refreshToken: 'refresh-token',
      }).save();
    });

    describe('when the confirmation code is valid', () => {
      it('returns success', async () => {
        const confirmationCode = await Auth.generateToken({ email }, { expiresIn: '1h' });
        const { status, body } = await global.testRequest.post(`/users/confirm-registration/${confirmationCode}`).send();
        expect(status).toEqual(200);
        expect(body).toEqual({ message: 'Your email has been successfully confirmed!' });
        const user = await User.findOne({ email });
        expect(user?.confirmedAt).toBeTruthy();
      });
    });

    describe('when the confirmation code is invalid', () => {
      it('returns an error message', async () => {
        const confirmationCode = '123456';
        const { status, body } = await global.testRequest.post(`/users/confirm-registration/${confirmationCode}`).send();
        expect(status).toEqual(401);
        expect(body).toEqual({ message: 'Confirmation code invalid or expired.' });
      });
    });
  });
});
