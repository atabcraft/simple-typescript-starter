import request from 'supertest';
import { AuthService } from './auth.service';
const authService = new AuthService();
authService.setupPassport();
import { app } from '../app';
import '../sequelize';
import { User } from '../user/user.model';

const MOCKED_USER = { username: 'test1234567', password: 'test132' };

let userResult: { user: User; token: string };

async function clearDatabase() {
  return await User.destroy({ truncate: true, cascade: true });
}

describe('Sign up and login', () => {
  beforeEach(async () => {
    userResult = await authService.createUser(
      MOCKED_USER.username,
      MOCKED_USER.password,
    );
  });

  afterEach(async () => await clearDatabase());
  it('Valid request for signup should return user', async () => {
    await clearDatabase();
    const res = await request(app)
      .post('/signup')
      .set('Content-Type', 'application/json')
      .send(MOCKED_USER)
      .expect(res => {
        expect(res.body.user.username).toBe(MOCKED_USER.username);
        expect(res.body.user.password).toBeDefined();
        expect(res.status).toEqual(201);
      });
  });

  it('Should login user that exists', async () => {
    const response = await request(app)
      .post('/login')
      .set('Content-Type', 'application/json')
      .send(MOCKED_USER)
      .expect(async res => {
        expect(res.body.token).toBeDefined();
        expect(res.status).toEqual(200);
      });
  });

  it('Should not login user with invalid credentials', async () => {
    const response = await request(app)
      .post('/login')
      .set('Content-Type', 'application/json')
      .send({
        username: MOCKED_USER.username,
        password: 'whatever',
      })
      .expect(res => {
        expect(res.status).not.toEqual(200);
      });
  });

  it('Should not login user that  does not exists', async () => {
    const response = await request(app)
      .post('/login')
      .set('Content-Type', 'application/json')
      .send({
        username: 'doesnotexist',
        password: 'whatever',
      })
      .expect(res => {
        expect(res.status).toEqual(401);
      });
  });

  it('Should login user that exists', async () => {
    const response = await request(app)
      .get('/me')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + userResult.token)
      .send()
      .expect(res => {
        expect(res.body.user).toBeDefined();
        expect(res.status).toEqual(200);
      });
  });
});
