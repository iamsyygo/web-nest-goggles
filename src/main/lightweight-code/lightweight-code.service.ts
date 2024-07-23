import { Injectable } from '@nestjs/common';
import { CreateLightweightCodeDto } from './dto/create-lightweight-code.dto';
import { UpdateLightweightCodeDto } from './dto/update-lightweight-code.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { QueryLightweightCodeDto } from './dto/query-lightweight-code.dto';

@Injectable()
export class LightweightCodeService {
  tableSchema = '';
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {
    this.tableSchema = dataSource.options.database as string;
  }

  async getLightweight(queryLightweightCodeDto: QueryLightweightCodeDto) {
    const { key = 'value', name = 'label', exclude = ['id'], tableName } = queryLightweightCodeDto;
    console.log(this.dataSource.options, 'dataSource.options');

    if (!tableName) {
      throw new Error('表名是必需的');
    }

    // prevent sql injection，only allow a-zA-Z_
    if (key && !/^[a-zA-Z_]+$/.test(key)) {
      return [];
    }
    if (name && !/^[a-zA-Z_]+$/.test(name)) {
      return [];
    }
    if (exclude && exclude.some((item) => !/^[a-zA-Z_]+$/.test(item))) {
      return [];
    }
    const excludeSql = exclude ? `AND COLUMN_NAME NOT IN ('${exclude.join("','")}')` : '';

    const query = `
    SELECT 
        CONCAT(
            '[', 
            GROUP_CONCAT(
                CONCAT(
                    '{":dynamicTitle":"', COLUMN_COMMENT, '", ":dynamicValue":"', 
                    underline2camel(COLUMN_NAME), 
                    '"}'
                ) ORDER BY ORDINAL_POSITION SEPARATOR ','
            ),
            ']'
        ) AS result
    FROM 
        information_schema.COLUMNS 
    WHERE 
        TABLE_SCHEMA = '${this.tableSchema}' 
        AND TABLE_NAME = '${tableName}'
        ${excludeSql}`;

    const formattedQuery = query.replace(':dynamicTitle', name).replace(':dynamicValue', key);
    const data = await this.dataSource.query(formattedQuery);
    return data[0]['result'] ? JSON.parse(data[0]['result']) : [];
  }
}
