import { JWT_IGNORE_FLAG } from '@/utils/metadataKey';
import { SetMetadata } from '@nestjs/common';

// 跳过策略认证 e.q. @SkipJwtPassport()
export const SkipJwtPassport = () => SetMetadata(JWT_IGNORE_FLAG, true);
