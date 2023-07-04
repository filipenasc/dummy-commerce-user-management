import { connect as mongooseConnect, connection } from 'mongoose';

export const connect = async (): Promise<void> => {
  await mongooseConnect(process.env.MONGODB_CONNECTION || 'mongodb://localhost:27017/user-management-test');
};

export const close = (): Promise<void> => connection.close();
