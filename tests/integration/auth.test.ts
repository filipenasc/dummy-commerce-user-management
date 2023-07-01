import request from 'supertest';
import { app, server } from '@src/index';
import { User } from '@src/models';
import { Auth } from '@src/services';
import { connection } from 'mongoose';

afterAll(() => {
  server.close();
  connection.close();
});

const userData = {
  firstName: 'firstName',
  lastName: 'lastName',
  email: 'user@example.org',
  password: 'my_password',
  username: 'username',
  refreshToken: 'refresh-token',
};

jest.mock('@src/services/auth');
const MockedAuthService = Auth as jest.Mocked<typeof Auth>;

describe('OAuth', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('token', () => {
    beforeEach(async () => {
      await new User(userData).save();
    });

    describe('when requesting for an access token', () => {
      MockedAuthService.generateToken.mockReturnValueOnce('access-token').mockReturnValueOnce('refresh-token');

      it('returns the user credentials', async () => {
        const credentials = {
          email: 'user@example.org',
          password: 'my_password',
          grant_type: 'password'
        };

        const { body, status } = await request(app).post('/oauth/token').type('form').send(credentials);
        expect(status).toEqual(200);
        expect(body).toEqual({
          access_token: 'access-token',
          refresh_token: 'refresh-token',
          token_type: 'Bearer',
          expires_in: 86400
        });
      });

      describe('when the user is not found', () => {
        it('returns an invalid email/password error', async () => {
          const credentials = {
            email: 'not-found-user@example.org',
            password: 'my_password',
            grant_type: 'password'
          };

          const { body, status } = await request(app).post('/oauth/token').type('form').send(credentials);
          expect(status).toEqual(401);
          expect(body).toEqual({ message: "Invalid email or password." });
        });
      });

      describe('when the password is invalid', () => {
        it('returns an invalid email/password error', async () => {
          const credentials = {
            email: 'user@example.org',
            password: 'invalid-password',
            grant_type: 'password'
          };

          const { body, status } = await request(app).post('/oauth/token').type('form').send(credentials);
          expect(status).toEqual(401);
          expect(body).toEqual({ message: "Invalid email or password." });
        });
      });
    });

    describe('when requesting for a refresh token', () => {
      MockedAuthService.generateToken.mockReturnValueOnce('access-token').mockReturnValueOnce('refresh-token');

      it('returns the user credentials', async () => {
        const credentials = {
          refresh_token: 'refresh-token',
          grant_type: 'refresh_token'
        };

        const { body, status } = await request(app).post('/oauth/token').type('form').send(credentials);
        expect(status).toEqual(200);
        expect(body).toEqual({
          access_token: 'access-token',
          token_type: 'Bearer',
          expires_in: 86400
        });
      });

      describe('when the refresh_token is invalid', () => {
        it('returns an invalid refresh_token error', async () => {
          const credentials = {
            refresh_token: 'invalid-refresh-token',
            grant_type: 'refresh_token'
          };

          const { body, status } = await request(app).post('/oauth/token').type('form').send(credentials);
          expect(status).toEqual(401);
          expect(body).toEqual({ message: "Invalid refresh token." });
        });
      });
    });

    describe('when the grant_type is not provided', () => {
      it('returns a "missing grant type" error', async () => {
        const credentials = {
          email: 'user@example.org',
          password: 'my_password',
        };

        const { body, status } = await request(app).post('/oauth/token').type('form').send(credentials);
        expect(status).toEqual(400);
        expect(body).toEqual({ message: "'grant_type' is required." });
      });
    });

    describe('when the provided grant_type is not supported', () => {
      it('returns a "unsupported grant type" error', async () => {
        const credentials = {
          email: 'user@example.org',
          password: 'my_password',
          grant_type: 'client_credentials'
        };

        const { body, status } = await request(app).post('/oauth/token').type('form').send(credentials);
        expect(status).toEqual(400);
        expect(body).toEqual({ message: "'client_credentials' is not supported as a 'grant_type'." });
      });
    });
  });
});