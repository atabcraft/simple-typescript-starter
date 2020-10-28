import {
  Table,
  Column,
  Model,
  DataType,
  UpdatedAt,
  CreatedAt,
  HasMany,
} from 'sequelize-typescript';
import { Like } from '../like/like.model';

@Table
export class User extends Model<User> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  username!: string;

  @CreatedAt
  @Column
  createdAt!: Date;

  @UpdatedAt
  @Column
  updatedAt!: Date;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password!: string;

  @HasMany(() => Like)
  likes!: Like[];
}
