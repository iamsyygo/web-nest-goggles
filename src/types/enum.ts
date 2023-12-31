// runtime 的 enum 必须使用导出，这与其它类型注解不同
export enum AppEnum {
  REDIS = 'REDIS_CLIENT',
}

// field status
export enum DataEnumStatus {
  // 未启用
  UNENABLE = 2,
  ENABLE = 1,
  DISABLE = 0,
}

// sex 性别
export enum DataEnumSex {
  MAN = 1,
  FEMALE = 2,
  UNKNOWN = 3,
}
