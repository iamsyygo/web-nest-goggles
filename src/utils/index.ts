import { transformSchema } from '@nestjs/graphql';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { ObjectLiteral } from 'typeorm';
/**
 * 获取系统网卡名称
 * @returns {string}
 */
export const getNetworkInterfaceName = () => {
  const f = {
    win32: 'WLAN',
    linux: 'eth',
    darwin: 'en',
  };

  return f[process.platform];
};

/**
 * 解析错误信息
 * @param errorMessage 错误信息 1 - 2 行
 * @returns
 */
export const parseErrorMessage = (errorMessage: string) => {
  const regex = /^(.*?):\s+(.*?)(?:\s+at\s(.*?)\s\((.*?):(\d+:\d+)\))?$/;
  const match = errorMessage.match(regex);

  if (match) {
    const [, type, message, method, filePath, position, column] = match;

    return {
      type,
      message,
      location: {
        method,
        filePath,
        position,
        column,
      },
    };
  }
  return null;
};

// ['xxx'] or ['!xxx']
type SelectFields<T extends EntityClassOrSchema> = `!${keyof T & string}`[] | (keyof T)[];

/**
 * 可以选择非的字段，与 select 相反
 * @param entity
 */
export function getSelect<T extends EntityClassOrSchema>(entity: T, fields: SelectFields<T>) {
  // const keys = Object.keys(entity) as SelectFields<T>;
  // return keys.filter((key) => fields.includes(key) || !fields.includes(`!${key}`));
}

interface PageResult<T = ObjectLiteral> {
  results: [T[], number];
  page: number;
  pageSize: number;
}

// 返回统一的分页数据格式
export function transformPageResult<T = ObjectLiteral>(val: PageResult<T>) {
  const {
    results: [list, total],
    page,
    pageSize,
  } = val;

  return {
    list,
    total,
    meta: {
      page: Number(page),
      pageSize: Number(pageSize),
      pages: Math.ceil(total / pageSize),
    },
  };
}
