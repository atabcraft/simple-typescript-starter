import { Router } from 'express';
import { Like } from './like.model';

export const postRouterFactory = () =>
  Router()
    .get('/posts', (req, res, next) =>
      Like.findAll()
        .then(posts => res.json(posts))
        .catch(next),
    )

    .get('/posts/:id', (req, res, next) =>
      Like.findByPk(req.params.id)
        .then(post => (post ? res.json(post) : next({ statusCode: 404 })))
        .catch(next),
    )

    .post('/posts', (req, res, next) =>
      Like.create(req.body)
        .then(post => res.json(post))
        .catch(next),
    );
