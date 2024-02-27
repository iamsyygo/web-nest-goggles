import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Role } from '../main/role/entities/role.entity';
import { User } from '../main/user/entities/user.entity';
import { Permission } from '../main/permission/entities/permission.entity';

// Object Relational Mapping => ORM
export const typeOrmUseFactory = (configService: ConfigService): TypeOrmModuleOptions => {
  const typeOrmConfig = configService.get('db.mysql') as AppYamlConfig['db']['mysql'] as TypeOrmModuleOptions;
  return {
    ...typeOrmConfig,
    // 驼峰转下划线
    namingStrategy: new SnakeNamingStrategy(),
    entities: [User, Role, Permission],
  };
};
