import { JWT_PUBLIC_KEY } from '@/utils/metadataKey';
import { ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AppJwtAuthGuard extends AuthGuard('jwt') {
  @Inject(Reflector) private readonly reflector: Reflector;
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
  handleRequest(err, user, info, context: ExecutionContext) {
    // routing metadata that does not require validation
    const isIgnore = this.reflector.getAllAndOverride<boolean>(JWT_PUBLIC_KEY, [
      context.getClass(),
      context.getHandler(),
    ]);

    if (isIgnore) return;

    if (err || !user) {
      // development not required verification token
      // if (process.env.NODE_ENV === 'development') return;
      throw err || new UnauthorizedException('Unauthorized');
    }
    return user;
  }
  // 获取身份验证选项
  // getAuthenticateOptions(context: ExecutionContext): IAuthModuleOptions<any> {
  //   const ctx = GqlExecutionContext.create(context);
  //   const { req } = ctx.getContext();
  //   return { property: 'user', req };
  // }
}
