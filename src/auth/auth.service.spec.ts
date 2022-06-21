import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { RolesTypeEnum } from '../_enums/roles-type.enum';
import * as bcrypt from 'bcrypt';

const mockUserEntity = {
  id: 1,
  email: 'test@test.com',
  password: 'test',
  username: 'test',
  roles: RolesTypeEnum.CLIENT,
  createdAt: new Date(),
  refreshTokens: [],
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [AuthService, JwtService],
    }).compile();

    service = app.get(AuthService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Check if the createToken method is called and returns a token or undefined
  describe('createToken', () => {
    it('should return a token', async () => {
      const spyOnJwtSign = jest
        .spyOn(JwtService.prototype, 'sign')
        .mockImplementation(() => 'testToken');

      const token = await service.createToken(mockUserEntity);
      expect(token).toBe('testToken');

      expect(spyOnJwtSign).toHaveBeenCalledTimes(1);
      // expect(spyOnJwtSign).toHaveBeenCalledWith();
    });
  });

  // Check if the validateUser method is called and returns a user or null if the password is wrong
  describe('validateUser', () => {
    it('should return a promise with a user', async () => {
      const spyOnCompare = jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation((pass1, pass2) => Promise.resolve(true));

      const user = await service.validateUser(
        mockUserEntity,
        mockUserEntity.password,
      );
      expect(user).toBe(mockUserEntity);

      expect(spyOnCompare).toHaveBeenCalledTimes(1);
      expect(spyOnCompare).toHaveBeenCalledWith(
        mockUserEntity.password,
        mockUserEntity.password,
      );
    });

    it('should return null', async () => {
      const spyOnCompare = jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation((pass1, pass2) =>
          pass1 === pass2 ? Promise.resolve(true) : Promise.resolve(false),
        );

      const user = await service.validateUser(mockUserEntity, 'wrongPassword');

      expect(user).toBeNull();

      expect(spyOnCompare).toHaveBeenCalledTimes(1);
      expect(spyOnCompare).toHaveBeenCalledWith(
        'wrongPassword',
        mockUserEntity.password,
      );
    });
  });

  // Check if the verifyToken method is called and returns an object, renew if it is expired or reject if it is invalid
  describe('verifyToken', () => {
    it('should return an object', async () => {
      const spyOnVerify = jest
        .spyOn(JwtService.prototype, 'verify')
        .mockImplementation(() => mockUserEntity);

      const user = await service.verifyToken('Bearer testToken');
      expect(user).toEqual(expect.not.stringMatching('reject | renew'));

      expect(spyOnVerify).toHaveBeenCalledTimes(1);
    });

    it('should return "renew"', async () => {
      const spyOnVerify = jest
        .spyOn(JwtService.prototype, 'verify')
        .mockImplementation(() => {
          throw { name: 'TokenExpiredError' };
        });

      const response = await service.verifyToken('Bearer expiredTestToken');
      expect(response).toBe('renew');

      expect(spyOnVerify).toHaveBeenCalledTimes(1);
    });

    it('should return "reject"', async () => {
      const spyOnVerify = jest
        .spyOn(JwtService.prototype, 'verify')
        .mockImplementation(() => {
          throw { name: 'JsonWebTokenError' };
        });

      const response = await service.verifyToken('Bearer invalidTestToken');

      expect(response).toBe('reject');

      expect(spyOnVerify).toHaveBeenCalledTimes(1);
    });
  });
});
