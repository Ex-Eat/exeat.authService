import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/user.entity';
import { RolesTypeEnum } from '../_enums/roles-type.enum';
import { RefreshTokensEntity } from './refresh-tokens.entity';
import { RefreshTokensService } from './refresh-tokens.service';

const oneToken: RefreshTokensEntity = {
  id: 1,
  token: 'token',
  createdAt: new Date(),
  expiresAt: new Date(),
  user: {
    id: 1,
    email: 'test@test.com',
    password: 'test',
    username: 'test',
    roles: RolesTypeEnum.CLIENT,
    createdAt: new Date(),
    refreshTokens: [],
  },
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

describe('RefreshTokensService', () => {
  let service: RefreshTokensService;

  // Mock the token repository

  const mockedTokenRepository = () => ({
    findOne: jest.fn((id) => (id == 1 ? Promise.resolve(oneToken) : undefined)),
    create: jest.fn((user) => ({
      ...oneToken,
    })),
    save: jest.fn((token) => Promise.resolve(token)),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RefreshTokensService,
        {
          provide: getRepositoryToken(RefreshTokensEntity),
          useValue: mockedTokenRepository,
        },
      ],
    }).compile();

    service = module.get<RefreshTokensService>(RefreshTokensService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Check if the get function returns a token or undefined
  describe('get', () => {
    it('should return a token', async () => {
      const spyOnGet = jest
        .spyOn(service, 'get')
        .mockImplementation(() => Promise.resolve(oneToken));

      const token = await service.get('token');
      expect(token).toBe(oneToken);

      expect(spyOnGet).toHaveBeenCalledTimes(1);
      expect(spyOnGet).toHaveBeenCalledWith('token');
    });

    it('should return undefined', async () => {
      const spyOnGet = jest
        .spyOn(service, 'get')
        .mockImplementation(() => Promise.resolve(undefined));

      const token = await service.get('token');
      expect(token).toBeUndefined();

      expect(spyOnGet).toHaveBeenCalledTimes(1);
      expect(spyOnGet).toHaveBeenCalledWith('token');
    });
  });

  // Check if the create function returns a token or undefined
  describe('create', () => {
    it('should return a promise with a token', async () => {
      const spyOnCreate = jest
        .spyOn(service, 'create')
        .mockImplementation((user) => Promise.resolve('token'));

      const token = await service.create(oneUser);

      expect(token).toBe('token');

      expect(spyOnCreate).toHaveBeenCalledTimes(1);
      expect(spyOnCreate).toHaveBeenCalledWith(oneUser);
    });

    it('should return undefined', async () => {
      const spyOnCreate = jest
        .spyOn(service, 'create')
        .mockImplementation((user) => Promise.resolve(undefined));

      const token = await service.create(oneUser);

      expect(token).toBeUndefined();

      expect(spyOnCreate).toHaveBeenCalledTimes(1);
      expect(spyOnCreate).toHaveBeenCalledWith(oneUser);
    });
  });
});
