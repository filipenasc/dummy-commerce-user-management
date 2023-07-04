import express, { Application } from 'express';
import cors from 'cors';
import { router } from './routes';
import * as database from '@src/config/database';
import * as http from 'http';

export class SetupExpressServer {
  public app: Application;
  private server?: http.Server;

  constructor(private port: string | undefined = '8080') {
    this.app = express();
  }

  public async init(): Promise<void> {
    this.setupMiddlewares();
    await this.setupDatabase();
  }

  public start(): void {
    this.server = this.app.listen(this.port, () => {
      console.log(`Listening on port ${this.port}`);
    });
  }

  public async close(): Promise<void> {
    await database.close();
    if (this.server) {
      await new Promise((resolve, reject) => {
        this.server?.close((err) => {
          if (err) {
            return reject(err);
          }
          resolve(true);
        });
      });
    }
  }

  public getApp(): Application {
    return this.app;
  }

  private setupMiddlewares(): void {
    this.app.use(cors({
      origin: '*'
    }));

    this.app.use(express.urlencoded({
      extended: true
    }));

    this.app.use(express.json());
    this.app.use(router);
  }

  async setupDatabase(): Promise<void> {
    await database.connect();
  }
}
