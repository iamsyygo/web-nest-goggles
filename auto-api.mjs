import * as fs from 'fs';
const swaggerJson = JSON.parse(fs.readFileSync('./openapi.json', 'utf-8'));

function generateTypes(schemas, moduleName) {
  moduleName = moduleName?.toLowerCase();
  return Object.entries(schemas)
    .map(([name, schema]) => {
      if (moduleName && !name.toLowerCase().includes(moduleName)) return '';

      const properties = schema.properties;
      const typeLines = Object.entries(properties)
        .map(([propName, propDetails]) => {
          const description = propDetails.description ? ` // ${propDetails.description}` : '';
          let type = propDetails.type;
          if (propDetails.type === 'array' && propDetails.items?.$ref) {
            const ref = propDetails.items.$ref?.split('/')?.pop();
            type = `${ref || 'any'}[]`;
            // if(ref){
            //   template += `import { ${ref} } from './type';\n`;
            // }
          }
          return `  ${propName}: ${type};${description}`;
        })
        .join('\n');
      return `export interface ${name} {\n${typeLines}\n}`;
    })
    .filter(Boolean)
    .join('\n\n');
}

function generateApiModule(moduleName, swaggerJson) {
  const { paths, components } = swaggerJson;
  let template = `import axios from '@/utils/http';\n`;
  template += `import { IPageCommonParams, IResponseData } from './type';\n`;

  // 生成 ts 接口
  template += generateTypes(components.schemas, moduleName);

  Object.entries(paths).forEach(([path, methods]) => {
    if (path.startsWith(`/api/${moduleName}`)) {
      Object.entries(methods).forEach(([method, details]) => {
        const functionName =
          details.operationId || `fetch${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}`;
        const requestBody =
          details.requestBody?.content?.['application/json']?.schema?.$ref?.split('/').pop() || 'any';
        const responseType = Object.entries(details.responses || {})
          .map(([code, response]) => {
            const schema = response.content?.['application/json']?.schema || {};
            if (schema.type === 'array') {
              return (schema.items?.$ref?.split('/').pop() || 'any') + '[]';
            }
            return schema.$ref?.split('/').pop();
          })
          .join(' | ');
        const summary = details.summary ? `/* ${details.summary} */` : '';

        let id = '';
        if (/{([^}]+)}/g.test(path)) {
          path = path.replace(/{([^}]+)}/g, '{$1}');
          id = 'id: string | number, ';
        }

        let attributesForParams = 'params';
        let requestParameters = `{ params }`;
        if (method === 'post' || method === 'put') {
          attributesForParams = 'data';
          requestParameters = `data`;
        }

        // 生成函数
        template += `
${summary}
export const ${functionName} = (${id}${attributesForParams}: ${requestBody}) => {
  return axios.${method}<${requestBody}, IResponseData<${responseType || 'any'}>>(\`${path}\`, ${requestParameters});
};\n`;
      });
    }
  });

  //生成的API模块写入文件
  fs.writeFileSync(`${moduleName}.api.ts`, template);
}

// 调用函数生成模块
generateApiModule('role', swaggerJson);
