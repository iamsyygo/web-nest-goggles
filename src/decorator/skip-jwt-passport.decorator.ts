import { SetMetadata } from '@nestjs/common';

// 跳过策略认证 e.q. @SkipJwtPassport()
export const SkipJwtPassport = () => SetMetadata('NO_NEET_JWT_AUTH', true);
