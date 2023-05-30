import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './../src/app.module';

import * as request from 'supertest';
import * as jwt from 'jsonwebtoken';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  const mockUser = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@gmail.com',
    password: 'password',
  };

  describe('/auth/register (POST)', () => {
    it('it should register a user and return the new user object', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .set('Accept', 'application/json')
        .send(mockUser)
        .expect(HttpStatus.CREATED)
        .expect((response: request.Response) => {
          const { id, firstName, lastName, email, password, imagePath, role } =
            response.body;

          expect(typeof id).toBe('number'),
            expect(firstName).toEqual(mockUser.firstName),
            expect(lastName).toEqual(mockUser.lastName),
            expect(email).toEqual(mockUser.email),
            expect(password).toBeUndefined(),
            expect(imagePath).toBeNull(),
            expect(role).toEqual('user');
        });
    });

    it('it should not register a new user if the passed email already exists', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .set('Accept', 'application/json')
        .send(mockUser)
        .expect(HttpStatus.BAD_REQUEST);
    });

    describe('/auth/login (POST)', () => {
      it('it should not log in nor return a JWT for an unregistered user', () => {
        return request(app.getHttpServer())
          .post('/auth/login')
          .set('Accept', 'application/json')
          .send({ email: 'doesnot@exist.com', password: 'password' })
          .expect((response: request.Response) => {
            const { token }: { token: string } = response.body;

            expect(token).toBeUndefined();
          })
          .expect(HttpStatus.NOT_FOUND);
      });
    });

    it('it should log in and return a JWT for a registered user', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .set('Accept', 'application/json')
        .send(mockUser)
        .expect((response: request.Response) => {
          const { token }: { token: string } = response.body;

          expect(jwt.verify(token, 'jwtsecret123')).toBeTruthy();
        })
        .expect(HttpStatus.OK);
    });
  });
});
