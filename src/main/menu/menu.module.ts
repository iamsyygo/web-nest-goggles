import { Module } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Menu } from './entities/menu.entity';
import { RoleService } from '../role/role.service';
import { RoleModule } from '../role/role.module';
import { Role } from '../role/entities/role.entity';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Menu, Role, User]), RoleModule],
  controllers: [MenuController],
  providers: [MenuService, RoleService],
})
export class MenuModule {}
