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
