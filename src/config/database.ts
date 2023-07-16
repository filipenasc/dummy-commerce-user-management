import { connect as mongooseConnect, connection } from 'mongoose';

export const connect = async (): Promise<void> => {
  const connectionString = process.env.MONGODB_CONNECTION;

  if (!connectionString) throw new Error('Database connection string is not defined.');

  await mongooseConnect(connectionString);
};

export const close = (): Promise<void> => connection.close();
