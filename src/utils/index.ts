import * as chalk from 'chalk';

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

/**
 * 颜色化日志信息
 * @param type 日志类型
 * @param message 日志信息
 * @returns
 */
export function colorizeLogMessage(type, message) {
  const typeMap = {
    info: 'green',
    error: 'red',
    warning: 'yellow',
    debug: 'blue',
  };
  return chalk[typeMap[type]]?.(message) || message;
}
