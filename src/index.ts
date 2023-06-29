import dotenv from 'dotenv';

dotenv.config();

import express from 'express';
import cors from 'cors';
import { router } from './routes';
import mongoose from 'mongoose';

export const app = express();

async function setupDatabase(connection: string): Promise<void> {
  await mongoose.connect(connection);
}

const port = process.env.PORT || 8080;

app.use(cors({
  origin: '*'
}));

setupDatabase(process.env.MONGODB_CONNECTION || 'mongodb://localhost:27017/user-management-test');

app.use(express.json());
app.use(router);

export const server = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
})
