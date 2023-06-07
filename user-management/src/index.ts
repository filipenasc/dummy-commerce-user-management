require('dotenv').config();

import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { router } from './routes';

const app = express();

mongoose.connect(process.env.MONGODB_CONNECTION);

// Middleware to parse JSON body
app.use(express.json());
app.use(router);

const verify = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.AUTH_SECRET_KEY, (err, user) => {
      if (err) {
        res.status(403).json({ message: 'Invalid token.' });
      } else {
        req.user = user;
        next();
      }
    });
  } else {
    res.status(401).json({ message: 'You are not authenticated.' });
  }
};

app.get('/api/users', verify, (req, res) => {
  res.status(200).json({});
})

app.listen(3000, () => {
  console.log(`Listening on port 3000`);
})