/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { consola } from 'consola';
import { ip } from 'address';
import { getNetworkInterfaceName } from '@/utils';
import { setupSwagger } from '@/config/swagger.config';
// import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ValidationPipe } from '@nestjs/common';

declare const module: any;

async function bootstrap() {
  const now = Date.now();
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

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }

  // This can only return an IPv4 address
  const ipv4 = ip(getNetworkInterfaceName());

  consola.ready({
    message: `🥽 应用程序启动成功，运行在:`,
    badge: true,
  });
  consola.success(`http://localhost:${application.port}`);
  consola.success(`http://${ipv4}:${application.port}\n`);

  consola.start('📖 swagger 文档运行在:');
  consola.success(`http://localhost:${application.port}/docs`);
  consola.success(`http://${ipv4}:${application.port}/docs`);
  consola.info(`⏱️  启动耗时${Date.now() - now}ms`);
}
bootstrap();
