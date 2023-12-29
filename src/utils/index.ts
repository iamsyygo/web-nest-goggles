/**
 * 获取系统网卡名称
 * @returns {string}
 */
export const getNetworkInterfaceName = () => {
  const f = {
    win32: 'WLAN',
    linux: 'eth0',
    darwin: 'en0',
  };
  return f[process.platform];
};
