import dotenv from 'dotenv';

dotenv.config();

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { router } from './routes';

const app = express();

const port = process.env.PORT || 8080;

app.use(cors({
  origin: '*'
}));

const DB_CONNECTION = process.env.MONGODB_CONNECTION || 'mongodb://localhost:27017/user-management'

mongoose.connect(DB_CONNECTION);

app.use(express.json());
app.use(router);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
})
