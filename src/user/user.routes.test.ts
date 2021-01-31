import request from 'supertest';
import { AuthService } from '../auth/auth.service';
const authService = new AuthService();
authService.setupPassport();
import { app } from '../app';
import '../sequelize';
import { User } from './user.model';
import { Like } from '../like/like.model';

const MOCKED_USER = { username: 'test123456234', password: 'test13223423432' };
const MOCKED_LIKED_USER = { username: 'test', password: 'test' };

async function clearDatabase() {
  await User.destroy({ truncate: true, cascade: true });
  return await Like.destroy({ truncate: true, cascade: true });
}
let userResult: { user: User; token: string };
let likedUserresult: { user: User; token: string };
let beforeCount: number;

describe('Like and unlike flow of a user', () => {
  beforeAll(async () => {
    userResult = await authService.createUser(
      MOCKED_USER.username,
      MOCKED_USER.password,
    );
    likedUserresult = await authService.createUser(
      MOCKED_LIKED_USER.username,
      MOCKED_LIKED_USER.password,
    );
    return (beforeCount = await Like.count({
      where: { createdBy: userResult.user.username },
    }));
  });

  afterAll(async () => {
    return await clearDatabase();
  });

  it('should create a like', async () => {
    const res = await request(app)
      .put('/users/' + likedUserresult.user.id + '/like')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + userResult.token)
      .send()
      .expect(async res => {
        expect(res.status).toEqual(201);
        const afterCount = await Like.count({
          where: {
            createdBy: userResult.user.username,
            userId: likedUserresult.user.id,
          },
        });
        expect(afterCount).toEqual(beforeCount + 1);
      });
  });
  it('should delete a like', async () => {
    const res = await request(app)
      .put('/users/' + likedUserresult.user.id + '/unlike')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + userResult.token)
      .send()
      .expect(async res => {
        expect(res.status).toEqual(200);
        expect(
          await Like.count({
            where: {
              createdBy: MOCKED_USER.username,
              userId: likedUserresult.user.id,
            },
          }),
        ).toBe(beforeCount);
      });
  });
});
