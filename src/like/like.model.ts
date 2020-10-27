import {
  Model,
  Table,
  Column,
  ForeignKey,
  BelongsTo,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { User } from '../user/user.model';

@Table
export class Like extends Model<Like> {
  @ForeignKey(() => User) @Column userId!: number;
  @BelongsTo(() => User) user!: User;

  @CreatedAt
  @Column
  createdAt!: Date;

  @UpdatedAt
  @Column
  updatedAt!: Date;
}
