import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { UserService } from '../src/user/user.service';
import { UserEntity } from '../src/user/user.entity';
import { RolesTypeEnum } from '../src/_enums/roles-type.enum';
import { AuthModule } from '../src/auth/auth.module';
import * as request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AppModule } from '../src/app.module';
import { AuthService } from '../src/auth/auth.service';
import { RefreshTokensService } from '../src/refresh-tokens/refresh-tokens.service';

const oneUser: UserEntity = {
  id: 1,
  email: 'test@test.com',
  password: 'test',
  createdAt: new Date(),
  roles: RolesTypeEnum.CLIENT,
  username: 'test',
  refreshTokens: [],
};

describe('Auth', () => {
  let app: INestApplication;
  let userService = {
    findOne: (id) => {
      if (id == 1) {
        return oneUser;
      }
      return undefined;
    },
    findByEmail: (email) => {
      if (email == 'test@test.com') {
        return oneUser;
      }
      // console.log('tartealacreme AAAAAAAAàe');
      return undefined;
    },
  };

  let authService = {
    validateUser: (user, password) => {
      if (user.email == 'test@test.com' && password == 'test') {
        return oneUser;
      }
      return undefined;
    },
    createToken: (user) => {
      return 'token for user ' + user.id;
    },
  };

  let refreshTokensService = {
    create: (user) => {
      return 'refresh token for user ' + user.id;
    },
  };

  // const mockedUserRepository = () => ({
  //   findOne: jest.fn((id) => (id == 1 ? Promise.resolve(oneUser) : undefined)),
  // });

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
      // providers: [
      //   {
      //     provide: getRepositoryToken(UserEntity),
      //     useValue: userService,
      //   },
      // ],
    })
      .overrideProvider(UserService)
      .useValue(userService)
      .overrideProvider(AuthService)
      .useValue(authService)
      .overrideProvider(RefreshTokensService)
      .useValue(refreshTokensService)
      .compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('app is defined', () => {
    expect(app).toBeDefined();
  });

  describe('/auth/login', () => {
    it('should return access token', async () => {
      return request(app.getHttpServer())
        .post('/auth')
        .send({
          email: 'test@test.com',
          password: 'test',
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .expect((res) => {
          expect(res.body.accessToken).toBeDefined();
          expect(res.body.refreshToken).toBeDefined();
        });
    });

    it('should return error when email is not found', async () => {
      return request(app.getHttpServer())
        .post('/auth')
        .send({
          email: 'test@wrong.com',
          password: 'test',
        })
        .expect(401)
        .expect('Content-Type', /json/)
        .expect((res) => {
          expect(res.body.error).toBeDefined();
        });
    });

    it('should return error when password is wrong', async () => {
      return request(app.getHttpServer())
        .post('/auth')
        .send({
          email: 'test@test.com',
          password: 'wrong',
        })
        .expect(401)
        .expect('Content-Type', /json/)
        .expect((res) => {
          expect(res.body.error).toBeDefined();
        });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
