import { Router } from 'express';
import { Like } from '../like/like.model';

import { User } from './user.model';

export const userRouterFactory = () =>
  Router()
    .get('/users', (req, res, next) =>
      User.findAll({ include: [Like] })
        .then(users => res.json(users))
        .catch(next),
    )

    .get('/users/:id', (req, res, next) =>
      User.findByPk(req.params.id)
        .then(user => (user ? res.json(user) : next({ statusCode: 404 })))
        .catch(next),
    )

    .post('/users', (req, res, next) =>
      User.create(req.body)
        .then(user => res.json(user))
        .catch(next),
    );
