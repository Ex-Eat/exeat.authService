import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private _repository: Repository<UserEntity>,
  ) {}

  async findOne(id: number): Promise<UserEntity> {
    return await this._repository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<UserEntity> {
    return await this._repository.findOne({ where: { email } });
  }
}
