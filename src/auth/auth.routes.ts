import { Router } from 'express';
import passport from 'passport';
import { AuthService } from './auth.service';

const authService = new AuthService();
export const authRouterFactory = () =>
  Router()
    .post('/signup', async (req, res, next) => {
      try {
        await authService.registerUser(req, res);
      } catch (error) {
        next({ statusCode: 400 });
      }
    })
    .post('/login', async (req, res, next) => {
      try {
        if (!req.body.username || !req.body.password) {
          return res.status(400);
        }
        authService.loginUser(req, res);
      } catch (error) {
        next({ statusCode: 403 });
      }
    })
    .get(
      '/me',
      passport.authenticate('jwt', { session: false }),
      async (req, res, next) => {
        try {
          return res.status(200).send({
            user: req.user,
          });
        } catch (error) {
          next({ statusCode: 403 });
        }
      },
    );
