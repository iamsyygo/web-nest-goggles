import { readFile } from 'fs/promises';
import * as yaml from 'js-yaml';
import { join } from 'path';
import { name, version, description } from '../../package.json';

export const yamlConfigLoad = async (): Promise<AppYamlConfig> => {
  const NODE_ENV = process.env.NODE_ENV || 'development';
  // const ROOT_DIR = process.cwd();
  const configFilePath = join(process.cwd(), 'env.' + NODE_ENV + '.yaml');

  const config = await readFile(configFilePath, {
    encoding: 'utf-8',
  });

  const yamlValues = yaml.load(config);

  // merge package.json name、version、description
  Object.assign(yamlValues.application, {
    name,
    version,
    description,
  });
  return yamlValues;
};
