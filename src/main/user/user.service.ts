import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User as User } from './entities/user.entity';

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

  /**
   * 前 x 个月的用户注册量,与用户注册量统计
   * @param count
   * @returns
   */
  async registerCount(count = 6) {
    const total = await this.userRepo.count();
    const results = await this.userRepo.query(
      `SELECT COUNT(*) as count, DATE_FORMAT(create_date, '%Y-%m') as date FROM user WHERE create_date >= DATE_SUB(CURDATE(), INTERVAL ? MONTH) GROUP BY DATE_FORMAT(create_date, '%Y-%m') ORDER BY date DESC`,
      [count],
    );
    return {
      total,
      results,
    };
  }
}
