import { SetupExpressServer } from '../src/server';
import supertest from 'supertest';

let server: SetupExpressServer;

beforeAll(async () => {
  server = new SetupExpressServer();
  await server.init();
  global.testRequest = supertest(server.getApp());
});

afterAll(async () => {
  await server.close();
})
