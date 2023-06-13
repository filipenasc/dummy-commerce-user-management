require('dotenv').config();

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { router } from './routes';

const app = express();

app.use(cors({
  origin: 'http://localhost:3000'
}));

mongoose.connect(process.env.MONGODB_CONNECTION);

// Middleware to parse JSON body
app.use(express.json());
app.use(router);

app.listen(4000, () => {
  console.log(`Listening on port 4000`);
})