/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { consola } from 'consola';
import { ip } from 'address';
import { getNetworkInterfaceName } from '@/utils';
import { setupSwagger } from '@/config/swagger.config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const application: AppYamlConfig['application'] = configService.get('application');

  app.setGlobalPrefix('api');

  setupSwagger(app, 'docs', application);

  // app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  app.useGlobalPipes(
    new ValidationPipe({
      // 去除在类dto上不存在的字段
      // whitelist: true,
    }),
  );

  await app.listen(application.port);

  // This can only return an IPv4 address
  const ipv4 = ip(getNetworkInterfaceName());

  consola.box('🦀 Application running on:');
  consola.success(`http://localhost:${application.port}`);
  consola.success(`http://${ipv4}:${application.port}\n`);

  consola.start('📖 Application swagger docs running on:');
  consola.success(`http://localhost:${application.port}/docs`);
  consola.success(`http://${ipv4}:${application.port}/docs`);
}
bootstrap();
