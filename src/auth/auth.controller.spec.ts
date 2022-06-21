import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { RefreshTokensService } from '../refresh-tokens/refresh-tokens.service';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../user/user.entity';
import { RolesTypeEnum } from '../_enums/roles-type.enum';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RefreshTokensEntity } from '../refresh-tokens/refresh-tokens.entity';
import { stringify } from 'querystring';

const mockJwtService = {
  sign: jest.fn(),
  verify: jest.fn(),
};

const oneUser: UserEntity = {
  id: 1,
  email: 'test@test.com',
  password: 'test',
  username: 'test',
  roles: RolesTypeEnum.CLIENT,
  createdAt: new Date(),
  refreshTokens: [],
};

const oneRefreshToken: RefreshTokensEntity = {
  id: 1,
  user: oneUser,
  token: 'test',
  createdAt: new Date(),
  expiresAt: new Date(),
};

describe('AuthController', () => {
  let authController: AuthController;

  const mockedUserRepository = () => ({
    findOne: jest.fn((id) => (id == 1 ? Promise.resolve(oneUser) : undefined)),
  });

  const mockedRefreshTokensRepository = () => ({
    findOne: jest.fn((id) =>
      id == 1 ? Promise.resolve(oneRefreshToken) : undefined,
    ),
  });

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        UserService,
        RefreshTokensService,
        { provide: JwtService, useValue: mockJwtService },
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockedUserRepository,
        },
        {
          provide: getRepositoryToken(RefreshTokensEntity),
          useValue: mockedRefreshTokensRepository,
        },
      ],
    }).compile();

    authController = app.get<AuthController>(AuthController);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('login', () => {
    it('should return a promise with token and refreshToken', async () => {
      const spyOnLogin = jest
        .spyOn(authController, 'login')
        .mockImplementation((email, password) =>
          Promise.resolve({ accessToken: 'test', refreshToken: 'test' }),
        );

      const token = await authController.login('test@test.com', 'test');
      expect(token).toEqual({ accessToken: 'test', refreshToken: 'test' });

      expect(spyOnLogin).toHaveBeenCalledTimes(1);
      expect(spyOnLogin).toHaveBeenCalledWith('test@test.com', 'test');
    });

    it('should return undefined', async () => {
      const spyOnLogin = jest
        .spyOn(authController, 'login')
        .mockImplementation((email, password) => Promise.resolve(undefined));

      const token = await authController.login('test@gmail.com', 'test');
      expect(token).toBeUndefined();
      expect(spyOnLogin).toHaveBeenCalledTimes(1);
      expect(spyOnLogin).toHaveBeenCalledWith('test@gmail.com', 'test');
    });
  });

  describe('refreshToken', () => {
    it('should return a promise with token and refreshToken', async () => {
      const spyOnRefreshToken = jest
        .spyOn(authController, 'refreshToken')
        .mockImplementation((token) =>
          Promise.resolve({ accessToken: 'test', refreshToken: 'test' }),
        );

      const token = await authController.refreshToken(
        'IamARefreshToken',
        'test',
      );

      expect(token).toEqual({ accessToken: 'test', refreshToken: 'test' });

      expect(spyOnRefreshToken).toHaveBeenCalledTimes(1);
      expect(spyOnRefreshToken).toHaveBeenCalledWith(
        'IamARefreshToken',
        'test',
      );
    });

    it('should return undefined', async () => {
      const spyOnRefreshToken = jest
        .spyOn(authController, 'refreshToken')
        .mockImplementation((token) => Promise.resolve(undefined));

      const token = await authController.refreshToken(
        'IamARefreshToken',
        'test',
      );
      expect(token).toBeUndefined();

      expect(spyOnRefreshToken).toHaveBeenCalledTimes(1);
      expect(spyOnRefreshToken).toHaveBeenCalledWith(
        'IamARefreshToken',
        'test',
      );
    });
  });
});
