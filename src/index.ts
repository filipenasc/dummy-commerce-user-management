require('dotenv').config();

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { router } from './routes';

const app = express();

const port = parseInt(process.env.PORT) || 8080;

app.use(cors({
  origin: '*'
}));

mongoose.connect(process.env.MONGODB_CONNECTION);

// Middleware to parse JSON body
app.use(express.json());
app.use(router);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
})
