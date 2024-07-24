import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserV2 as User } from './entities/user.entity';

interface IFindDto {
  username?: string;
  email?: string;
  id?: number;
}

@Injectable()
export class UserService {
  @InjectRepository(User)
  private readonly userRepo: Repository<User>;

  findOne(dto: IFindDto) {
    return this.userRepo.findOne({ where: { ...dto } });
  }

  create(dto: Partial<User>) {
    return this.userRepo.save(dto);
  }
}
