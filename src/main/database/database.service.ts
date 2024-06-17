import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CreateDatabaseDto } from './dto/create-database.dto';
import { UpdateDatabaseDto } from './dto/update-database.dto';

@Injectable()
export class DatabaseService {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  create(createDatabaseDto: CreateDatabaseDto) {
    return 'This action adds a new database';
  }

  async findAll() {
    const queryRunner = this.dataSource.createQueryRunner();
    // const tables = await queryRunner.query('SELECT * FROM information_schema.tables');
    const tables = await queryRunner.query(
      "SELECT * FROM information_schema.tables WHERE table_schema = 'goggles-dev'",
    );
    await queryRunner.release();
    return tables;
  }

  findOne(id: number) {
    return `This action returns a #${id} database`;
  }

  update(id: number, updateDatabaseDto: UpdateDatabaseDto) {
    return `This action updates a #${id} database`;
  }

  remove(id: number) {
    return `This action removes a #${id} database`;
  }

  // 通过表名查询表结构
  async findTableStructure(tableName: string, tableSchema: string = 'goggles-dev') {
    const queryRunner = this.dataSource.createQueryRunner();
    const columns = await queryRunner.query(
      `SELECT * FROM information_schema.columns WHERE table_schema = '${tableSchema}' AND table_name = '${tableName}'`,
    );
    await queryRunner.release();
    return columns;
  }
}
