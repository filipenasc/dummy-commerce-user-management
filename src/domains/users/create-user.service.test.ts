const { MongoClient } = require('mongodb');
import { CreateUserService } from './create-user.service';

const createUserService = new CreateUserService(repository, mailProvider, tokenGenerator);


describe('CreateUserService', () => {
  test('when the user already exists', () => {
    expect(3).toBe(3);
  })
})