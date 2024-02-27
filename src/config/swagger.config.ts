import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export const setupSwagger = (app: INestApplication, path, application) => {
  const config = new DocumentBuilder()
    .setTitle('<📖/> ' + application.name)
    .setDescription(application.description)
    .setVersion(application.version)
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(path, app, document);
};
