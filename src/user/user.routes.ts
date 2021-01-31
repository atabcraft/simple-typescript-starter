import { Router } from 'express';
import { AuthService } from '../auth/auth.service';
import { Like } from '../like/like.model';

import { User } from './user.model';

export const userRouterFactory = () =>
  Router()
    .get('/users', AuthService.authenticateWithJWT(), (req, res, next) =>
      User.findAll({ include: [Like] })
        .then(users => res.json(users))
        .catch(next),
    )

    .get('/users/:id', AuthService.authenticateWithJWT(), (req, res, next) =>
      User.findByPk(req.params.id)
        .then(user => (user ? res.json(user) : next({ statusCode: 404 })))
        .catch(next),
    )

    .post('/users', AuthService.authenticateWithJWT(), (req, res, next) =>
      User.create(req.body)
        .then(user => res.json(user))
        .catch(next),
    )
    .put(
      '/users/:id/like',
      AuthService.authenticateWithJWT(),
      async (req, res, next) => {
        try {
          const user = await User.findOne({
            where: { id: req.params.id },
            include: [Like],
          });
          if (!user) return res.status(404).send();
          const like = new Like();
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          like.createdBy = (req.user as any).username;
          like.userId = user.id;
          like.save();
          user.likes.push(like);
          const result = await user.save();
          res.status(201).send(result);
        } catch (error) {
          next(error);
        }
      },
    )
    .put(
      '/users/:id/unlike',
      AuthService.authenticateWithJWT(),
      async (req, res, next) => {
        try {
          const user = await User.findOne({ where: { id: req.params.id } });
          if (!user) return res.status(404).send();
          const like = await Like.destroy({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            where: { userId: user.id, createdBy: (req.user as any).username },
          });
          res.status(200).send(user);
        } catch (error) {
          next(error);
        }
      },
    );
