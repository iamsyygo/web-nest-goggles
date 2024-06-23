// decrypt params decorator
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { decryptRSA } from '@/config/crypto.config';
import { GqlExecutionContext } from '@nestjs/graphql';

/**
 * 获取解密参数，对指定的参数进行解密
 * @param {'body' | 'query' | 'params' | 'headers'} type
 * @param {string | string[]}  data
 * @returns
 * @example
 * @DecryptParams('password', 'body') password
 * @DecryptParams(['password', 'username'], 'query') registerData
 */
export const DecryptParams = (type: 'body' | 'query' | 'params' | 'headers', data?: string | string[]) => {
  return createParamDecorator((_, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.switchToHttp().getRequest();
    const params = request[type];
    const decryptParams = Array.isArray(data)
      ? data
      : typeof data === 'string'
        ? [data]
        : Object.keys(params);
    const result = {};
    decryptParams.forEach((key) => {
      if (params[key]) {
        result[key] = decryptRSA(params[key]);
      }
    });

    Object.assign(request[type], result);
    return result;
  });
};
