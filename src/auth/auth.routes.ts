import { Router } from 'express';
import { AuthService } from './auth.service';

const authService = new AuthService();
export const authRouterFactory = () =>
  Router()
    .post('/signup', async (req, res, next) => {
      try {
        await authService.registerUser(req, res);
      } catch (error) {
        next(error);
      }
    })
    .post('/login', async (req, res, next) => {
      try {
        if (!req.body.username || !req.body.password) {
          return res.status(400);
        }
        authService.loginUser(req, res);
      } catch (error) {
        next(error);
      }
    })
    .get('/me', AuthService.authenticateWithJWT(), async (req, res, next) => {
      try {
        return res.status(200).send({
          user: req.user,
        });
      } catch (error) {
        next(error);
      }
    });
