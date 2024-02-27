"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.yamlConfigLoad = void 0;
const promises_1 = require("fs/promises");
const yaml = require("js-yaml");
const path_1 = require("path");
const package_json_1 = require("../../package.json");
const yamlConfigLoad = async () => {
    const NODE_ENV = process.env.NODE_ENV || 'development';
    const configFilePath = (0, path_1.join)(process.cwd(), 'env.' + NODE_ENV + '.yaml');
    const config = await (0, promises_1.readFile)(configFilePath, {
        encoding: 'utf-8',
    });
    const yamlValues = yaml.load(config);
    Object.assign(yamlValues.application, {
        name: package_json_1.name,
        version: package_json_1.version,
        description: package_json_1.description,
    });
    return yamlValues;
};
exports.yamlConfigLoad = yamlConfigLoad;
//# sourceMappingURL=yaml.config.js.map