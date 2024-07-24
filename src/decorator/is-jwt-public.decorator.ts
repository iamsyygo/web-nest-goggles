import { JWT_PUBLIC_KEY } from '@/utils/metadataKey';
import { SetMetadata } from '@nestjs/common';

// 跳过策略认证 e.q. @SkipJwtPassport()
export const IsJwtPublic = () => SetMetadata(JWT_PUBLIC_KEY, true);
