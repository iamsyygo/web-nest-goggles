// runtime 的 enum 必须使用导出，这与其它类型注解不同
export enum AppEnum {
  REDIS = 'REDIS_CLIENT',
}

// field status
export enum DataStatusEnum {
  // 未启用
  UNENABLE = 2,
  ENABLE = 1,
  DISABLE = 0,
}

// sex 性别
export enum DataSexEnum {
  MAN = 1,
  FEMALE = 2,
  UNKNOWN = 3,
}

export enum AppRedisKeyEnum {
  // 身份验证验证码
  CAPTCHA = 'app-captcha:',
}
