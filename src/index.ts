import dotenv from 'dotenv';
dotenv.config();

import './config/module-alias';
import { SetupExpressServer } from './server';

(async (): Promise<void> => {
  try {
    const server = new SetupExpressServer(process.env.PORT)
    await server.init();
    server.start();

    const exitSignals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM', 'SIGQUIT'];

    exitSignals.forEach(signal => process.on(signal, async () => {
      try {
        await server.close();
        process.exit(0);
      } catch (error) {
        process.exit(1);
      }
    }))
  } catch (error) {
    console.error(`App exited with error: ${error}`);
    process.exit(1);
  }
})();
