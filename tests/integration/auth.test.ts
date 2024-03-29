import { User } from '@src/models';

const userData = {
  firstName: 'firstName',
  lastName: 'lastName',
  email: 'user@example.org',
  password: 'my_password',
  refreshToken: 'refresh-token',
};

describe('OAuth', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('token', () => {
    beforeEach(async () => {
      await new User(userData).save();
    });

    describe('when requesting for an access token', () => {
      it('returns the user credentials', async () => {
        const credentials = {
          email: 'user@example.org',
          password: 'my_password',
          grant_type: 'password'
        };
        const { body, status } = await global.testRequest.post('/oauth/token').type('form').send(credentials);
        expect(status).toEqual(200);
        expect(body).toEqual(expect.objectContaining(
          {
            access_token: expect.any(String),
            refresh_token: expect.any(String),
            token_type: 'Bearer',
            expires_in: 86400
          }
        ));
      });

      describe('when the user is not found', () => {
        it('returns an invalid email/password error', async () => {
          const credentials = {
            email: 'not-found-user@example.org',
            password: 'my_password',
            grant_type: 'password'
          };

          const { body, status } = await global.testRequest.post('/oauth/token').type('form').send(credentials);
          expect(status).toEqual(401);
          expect(body).toEqual({
            type: 'AUTH_ERROR',
            message: 'Invalid email or password.',
          });
        });
      });

      describe('when the password is invalid', () => {
        it('returns an invalid email/password error', async () => {
          const credentials = {
            email: 'user@example.org',
            password: 'invalid-password',
            grant_type: 'password'
          };

          const { body, status } = await global.testRequest.post('/oauth/token').type('form').send(credentials);
          expect(status).toEqual(401);
          expect(body).toEqual({
            type: 'AUTH_ERROR',
            message: 'Invalid email or password.',
          });
        });
      });
    });

    describe('when requesting for a refresh token', () => {
      it('returns the user credentials', async () => {
        const credentials = {
          refresh_token: 'refresh-token',
          grant_type: 'refresh_token'
        };

        const { body, status } = await global.testRequest.post('/oauth/token').type('form').send(credentials);
        expect(status).toEqual(200);
        expect(body).toEqual(expect.objectContaining(
          {
            access_token: expect.any(String),
            token_type: 'Bearer',
            expires_in: 86400
          }
        ));
      });

      describe('when the refresh_token is invalid', () => {
        it('returns an invalid refresh_token error', async () => {
          const credentials = {
            refresh_token: 'invalid-refresh-token',
            grant_type: 'refresh_token'
          };

          const { body, status } = await global.testRequest.post('/oauth/token').type('form').send(credentials);
          expect(status).toEqual(401);
          expect(body).toEqual({
            type: 'AUTH_ERROR',
            message: 'Invalid refresh token.',
          });
        });
      });
    });

    describe('when the grant_type is not provided', () => {
      it('returns a "missing grant type" error', async () => {
        const credentials = {
          email: 'user@example.org',
          password: 'my_password',
        };

        const { body, status } = await global.testRequest.post('/oauth/token').type('form').send(credentials);
        expect(status).toEqual(400);
        expect(body).toEqual({
          type: 'VALIDATION_ERROR',
          message: 'Invalid parameters.',
          errors: [
            {
              path: 'grant_type',
              type: 'required',
            }
          ]
        });
      });
    });

    describe('when the provided grant_type is not supported', () => {
      it('returns a "unsupported grant type" error', async () => {
        const credentials = {
          email: 'user@example.org',
          password: 'my_password',
          grant_type: 'client_credentials'
        };

        const { body, status } = await global.testRequest.post('/oauth/token').type('form').send(credentials);
        expect(status).toEqual(400);
        expect(body).toEqual({
          type: 'VALIDATION_ERROR',
          message: 'Invalid parameters.',
          errors: [
            {
              path: 'grant_type',
              type: 'not_supported',
            }
          ]
        });
      });
    });
  });
});
