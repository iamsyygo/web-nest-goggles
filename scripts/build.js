const NODE_ENV = process.env.NODE_ENV || 'production';

/**
 * 移动生产环境 YAML 配置文件至 dist 下
 */
function onMobileConfig() {
  const fs = require('fs');
  const path = require('path');
  const dist = path.resolve(__dirname, '../dist');
  const fileName = 'env.' + NODE_ENV + '.yaml';
  const yamlFile = path.resolve(__dirname, '../' + fileName);
  fs.copyFileSync(yamlFile, path.resolve('/var/task/', fileName));
}

onMobileConfig();
