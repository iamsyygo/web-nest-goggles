import { PLATFORM_ENUM } from "@/main/user/entities/user.entity";

export interface IPayload {
  sub: number;
  platform: PLATFORM_ENUM;
  username?: string;
  githubId?: string
}
