import passport, { use } from 'passport';
import passportLocal from 'passport-local';
import passportJwt from 'passport-jwt';
import { User } from '../user/user.model';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt-nodejs';
import jwt from 'jsonwebtoken';

const LocalStrategy = passportLocal.Strategy;
const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

export class AuthService {
  setupPassport(): void {
    passport.use(
      new LocalStrategy(async (username, password, done) => {
        try {
          const user = await User.findOne({
            where: { username: username.toLowerCase() },
          });
          if (!user) {
            return done(undefined, false, {
              message: `username ${username} not found.`,
            });
          }

          if (bcrypt.compareSync(password, this.hashPassword(password))) {
            return done(undefined, user);
          }

          return done(undefined, false, {
            message: 'Invalid username or password.',
          });
        } catch (error) {
          return done(undefined, false, {
            message: 'Invalid username or password.',
          });
        }
      }),
    );

    passport.use(
      new JwtStrategy(
        {
          jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
          secretOrKey: process.env.JWTKEY,
        },
        function(jwtPayload, done) {
          return done(null, jwtPayload);
        },
      ),
    );
  }

  public async registerUser(req: Request, res: Response): Promise<any> {
    let user;
    try {
      user = await User.findOne({
        where: { username: req.body.username },
      });
    } catch (error) {
      return res.status(400).send({});
    }

    if (user) {
      return res.status(400).send({});
    }

    const result = this.createUser(req.body.username, req.body.password);
    res.status(201).send(result);
  }

  createUser(
    username: string,
    password: string,
  ): Promise<{ user: User; token: string }> {
    return User.create({
      username: username,
      password: this.hashPassword(password),
    }).then((user: User) => {
      const token = this.generateAccessToken(user);
      return { user, token };
    });
  }

  public async loginUser(req: Request, res: Response): Promise<any> {
    try {
      const user = await User.findOne({
        where: { username: req.body.username },
      });

      if (!user) return res.status(401).send();
      if (bcrypt.compareSync(req.body.password, user.password)) {
        const token = this.generateAccessToken(user);
        return res.status(200).send({ token });
      }
      return res.status(403).send({ err: 'Invalid username or password' });
    } catch (error) {
      return res.status(400).send({ err: 'Something went wrong' });
    }
  }

  private generateAccessToken(user: User) {
    return jwt.sign({ username: user.username }, String(process.env.JWTKEY));
  }

  private hashPassword(password: string): string {
    return bcrypt.hashSync(password);
  }
}
