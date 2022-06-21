import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { RolesTypeEnum } from '../_enums/roles-type.enum';
import { query } from 'express';

const repository_token = getRepositoryToken(UserEntity);

const oneUser: UserEntity = {
  id: 1,
  email: 'test@test.com',
  password: 'test',
  username: 'test',
  roles: RolesTypeEnum.CLIENT,
  createdAt: new Date(),
  refreshTokens: [],
};

describe('UserService', () => {
  let service: UserService;

  // We mock the user repository

  const mockedUserRepository = () => ({
    findOne: jest.fn((id) => (id == 1 ? Promise.resolve(oneUser) : undefined)),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: repository_token,
          useValue: mockedUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  afterEach(() => jest.clearAllMocks());

  // Tests

  // Check if the service is defined
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Check if the findOne method is called and returns a user or undefined
  describe('findOne', () => {
    it('should return a user', async () => {
      const spyOnFindOne = jest
        .spyOn(service, 'findOne')
        .mockImplementation(() => Promise.resolve(oneUser));

      const user = await service.findOne(1);
      expect(user).toBe(oneUser);

      expect(spyOnFindOne).toHaveBeenCalledTimes(1);
      expect(spyOnFindOne).toHaveBeenCalledWith(1);
    });

    it('should return undefined', async () => {
      const spyOnFindOne = jest
        .spyOn(service, 'findOne')
        .mockImplementation(() => Promise.resolve(undefined));

      const user = await service.findOne(2);
      expect(user).toBeUndefined();

      expect(spyOnFindOne).toHaveBeenCalledTimes(1);
      expect(spyOnFindOne).toHaveBeenCalledWith(2);
    });
  });

  describe('findByEmail', () => {
    it('should return a user', async () => {
      const spyOnFindOne = jest
        .spyOn(service, 'findByEmail')
        .mockImplementation(() => Promise.resolve(oneUser));

      const user = await service.findByEmail('test@test.com');

      expect(user).toBe(oneUser);

      expect(spyOnFindOne).toHaveBeenCalledTimes(1);
      expect(spyOnFindOne).toHaveBeenCalledWith('test@test.com');
    });

    it('should return undefined', async () => {
      const spyOnFindOne = jest
        .spyOn(service, 'findByEmail')
        .mockImplementation(() => Promise.resolve(undefined));

      const user = await service.findByEmail('test@gmail.com');

      expect(user).toBeUndefined();

      expect(spyOnFindOne).toHaveBeenCalledTimes(1);
      expect(spyOnFindOne).toHaveBeenCalledWith('test@gmail.com');
    });
  });
});
