import express from 'express';
import strongErrorHandler = require('strong-error-handler');
import { json } from 'body-parser';
import cors from 'cors';
import * as dotenv from 'dotenv';
dotenv.config();

import { userRouterFactory } from './user/user.routes';
import { likeRouterFactory } from './like/like.routes';
import { authRouterFactory } from './auth/auth.routes';
import passport = require('passport');

export const app = express();

app.use(json());
if (process.env.NODE_ENV != 'DEVELOPMENT') {
  app.use(cors());
}
app.use(passport.initialize());
app.use(userRouterFactory());
app.use(likeRouterFactory());
app.use(authRouterFactory());

app.use(
  strongErrorHandler({
    debug: true,
  }),
);
