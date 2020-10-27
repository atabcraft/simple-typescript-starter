import { Sequelize } from 'sequelize-typescript';
import { Like } from './like/like.model';
import { User } from './user/user.model';

export const sequelize = new Sequelize(
  process.env.DB_NAME || 'postgres',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASS,
  {
    dialect: 'postgres',
    host: process.env.DB_HOST,
  },
);

sequelize.addModels([User, Like]);
