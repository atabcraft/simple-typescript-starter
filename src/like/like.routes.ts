import { Router } from 'express';
import { Like } from './like.model';

export const likeRouterFactory = () =>
  Router()
    .get('/like', (req, res, next) =>
      Like.findAll()
        .then(likes => res.json(likes))
        .catch(next),
    )

    .get('/like/:id', (req, res, next) =>
      Like.findByPk(req.params.id)
        .then(like => (like ? res.json(like) : next({ statusCode: 404 })))
        .catch(next),
    )

    .post('/like', (req, res, next) =>
      Like.create(req.body)
        .then(like => res.json(like))
        .catch(next),
    );
