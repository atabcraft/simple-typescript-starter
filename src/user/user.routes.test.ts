import request from 'supertest';
import { app } from '../app';
import { AuthService } from '../auth/auth.service';
const authService = new AuthService();
authService.setupPassport();
import '../sequelize';
import { User } from './user.model';
import { Like } from '../like/like.model';

const MOCKED_USER = { username: 'test123456234', password: 'test13223423432' };
const MOCKED_LIKED_USER = { username: 'test', password: 'test' };

async function clearDatabase() {
  await Like.destroy({ truncate: true, cascade: true });
  return await User.destroy({ truncate: true, cascade: true });
}

describe('Like and unlike flow of a user', () => {
  it('should create a like', async () => {
    const userResult = await authService.createUser(
      MOCKED_USER.username,
      MOCKED_USER.password,
    );
    const likedUserresult = await authService.createUser(
      MOCKED_LIKED_USER.username,
      MOCKED_LIKED_USER.password,
    );
    const beforeCount = await Like.count({
      where: { createdBy: userResult.user.username },
    });

    const res = await request(app)
      .put('/user/' + likedUserresult.user.id + '/like')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + userResult.token)
      .send({ userId: userResult.user.id })
      .expect(async res => {
        expect(res.status).toEqual(201);
        expect(
          await Like.count({
            where: {
              createdBy: userResult.user.username,
              userId: likedUserresult.user.id,
            },
          }),
        ).toEqual(beforeCount + 1);
        await clearDatabase();
      });
  });
  /**
  it('should delete a like', async () => {
    const userResult = await authService.createUser(
      MOCKED_USER.username,
      MOCKED_USER.password,
    );
    const likedUserresult = await authService.createUser(
      MOCKED_LIKED_USER.username,
      MOCKED_LIKED_USER.password,
    );

    const like = await Like.create({
      userId: likedUserresult.user.id,
      createdBy: userResult.user.username,
    });

    const beforeCount = await Like.count({
      where: { createdBy: MOCKED_USER.username },
    });
    const res = await request(app)
      .put('/user/' + likedUserresult.user.id + '/unlike')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + userResult.token)
      .send({ userId: likedUserresult.user.id })
      .expect(async res => {
        expect(res.status).toEqual(200);
        expect(
          await Like.count({
            where: { createdBy: MOCKED_USER.username },
          }),
        ).toBe(beforeCount - 1);
        await clearDatabase();
      });
  });

   */
});
