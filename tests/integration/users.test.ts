import request from 'supertest';
import { app, server } from '@src/index';
import { UserCredentialsRequest } from '@src/controllers/users';
import { User } from '@src/models/user';
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
  refreshToken: 'refresh-token'
};

describe('Users', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('authenticate', () => {
    beforeEach(async () => {
      await new User(userData).save();
    });

    it('returns the user credentials', async () => {
      const userCredentialsRequest: UserCredentialsRequest = {
        email: 'user@example.org',
        password: 'password',
      };

      const { body, status } = await request(app).post('/users/authenticate').send(userCredentialsRequest);
      expect(status).toEqual(200);
      // @todo: mock the token generation and expect the generated tokens here
      expect(body).toEqual(expect.objectContaining({
        email: userData.email,
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
      }));
    });

    describe('when the user is not found', () => {
      const userCredentialsRequest: UserCredentialsRequest = {
        email: 'notFoundUser@example.org',
        password: 'password',
      };

      it('returns a 401 error', async () => {
        const { status } = await request(app).post('/users/authenticate').send(userCredentialsRequest);
        expect(status).toEqual(401);
      });
    });

    describe('when the password is invalid', () => {
      const userCredentialsRequest: UserCredentialsRequest = {
        email: 'user@example.org',
        password: 'invalidPassword',
      };

      it('returns a 401 error', async () => {
        const { status } = await request(app).post('/users/authenticate').send(userCredentialsRequest);
        expect(status).toEqual(401);
      });
    });
  });

  describe('refreshToken', () => {
    beforeEach(async () => {
      await new User(userData).save();
    });

    it('returns the user credentials', async () => {
      const { body, status } = await request(app).post('/users/refresh-token').send({ refreshToken: userData.refreshToken });
      expect(status).toEqual(200);
      expect(body).toEqual(expect.objectContaining({
        email: userData.email,
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
      }));
    });
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
      const { status, body } = await request(app).post('/users').send(newUser);
      expect(status).toEqual(201);
      // @todo: mock password encryption
      expect(body).toEqual(expect.objectContaining({
        firstName: 'firstName',
        lastName: 'lastName',
        email: 'user@example.org',
        username: 'username',
        id: expect.any(String),
      }));
    });
  });
});