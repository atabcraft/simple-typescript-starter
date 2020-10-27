import express from 'express';
import strongErrorHandler = require('strong-error-handler');
import { json } from 'body-parser';
import * as dotenv from 'dotenv';
dotenv.config();

import { userRouterFactory } from './user/user.routes';
import { postRouterFactory } from './like/like.routes';

export const app = express();

app.use(json());

app.use(userRouterFactory());
app.use(postRouterFactory());

app.use(
  strongErrorHandler({
    debug: true,
  }),
);
