import {
  createCipheriv,
  randomBytes,
  createDecipheriv,
  createHash,
  generateKeyPairSync,
  publicEncrypt,
  privateDecrypt,
  BinaryToTextEncoding,
} from 'node:crypto';

// RSA Algorithm(非对称加密)
const { privateKey, publicKey } = generateKeyPairSync('rsa', {
  moduleLength: 1024, // 密钥长度。长度越长安全性越高，但是加密解密速度越慢
});

export const cryptoConfig = {
  // AES Algorithm(对称加密)
  AES: {
    // key: randomBytes(32), // 生成一个随机的密钥
    key: Buffer.from('123456781', 'utf8'),
    algorithm: 'aes-256-cbc',
    iv: randomBytes(16), // 生成一个随机的向量
  },
  // RSA Algorithm(非对称加密)
  RSA: {
    privateKey,
    publicKey,
  },
  // MD5 Algorithm(散列算法)，不可逆加密。存在唯一性，可以使用撞库查询破解
  MD5: {
    hash: createHash('md5'),
  },
};

/**
 * 使用 AES 进行加密
 * @param {string} data
 * @param {BufferEncoding} outputEncoding
 * @returns
 */
export const encryptAES = (data: string, outputEncoding: BufferEncoding = 'base64') => {
  const { algorithm, iv, key } = cryptoConfig.AES;
  const cipher = createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(data, 'utf8', outputEncoding);
  encrypted += cipher.final(outputEncoding);
  return encrypted;
};

/**
 * 使用 AES 进行解密
 * @param {string} encrypted
 * @param {BufferEncoding} inputEncoding
 * @returns {string}
 */
export const decryptAES = (encrypted: string, inputEncoding: BufferEncoding = 'base64') => {
  const { algorithm, iv, key } = cryptoConfig.AES;
  const decipher = createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypted, inputEncoding, 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

/**
 * 使用 RSA 进行加密
 * @param {string} data
 * @param {BufferEncoding} outputEncoding
 * @returns {string}
 * @example
 * encryptRSA('hello world', 'base64')
 */
export const encryptRSA = (data: string, outputEncoding: BufferEncoding = 'base64') => {
  const { publicKey } = cryptoConfig.RSA;
  return publicEncrypt(publicKey, Buffer.from(data)).toString(outputEncoding);
};

/**
 * 使用 RSA 进行解密
 * @param {string} encrypted
 * @param {BufferEncoding} inputEncoding
 * @returns {string}
 * @example
 * decryptRSA('encrypted', 'utf8')
 */
export const decryptRSA = (encrypted: string, inputEncoding: BufferEncoding = 'base64') => {
  const { privateKey } = cryptoConfig.RSA;
  return privateDecrypt(privateKey, Buffer.from(encrypted, inputEncoding)).toString('utf8');
};

/**
 * 使用 MD5 进行加密
 * @param {string} data
 * @param {BufferEncoding} outputEncoding
 * @returns {{
 *  hash: import("crypto").Hash
 *  data: string
 * }}
 */
export const encryptMD5 = (data: string, outputEncoding: BinaryToTextEncoding = 'base64') => {
  const hash = createHash('md5');
  hash.update(data);
  return {
    hash,
    data: hash.digest(outputEncoding),
  };
};

/**
 * 使用 MD5 解密验证数据的一致性
 * @param {string} data
 * @param {string} encrypted
 * @param {BufferEncoding} inputEncoding
 * @returns {boolean}
 */
export const decryptMD5 = (
  data: string,
  encrypted: string,
  inputEncoding: BinaryToTextEncoding = 'base64',
) => {
  const { data: hash } = encryptMD5(data, inputEncoding);
  return hash === encrypted;
};
