import { NestFactory, repl } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { consola } from 'consola';
import { ip } from 'address';
import { getNetworkInterfaceName } from './utils';
import { setupSwagger } from './config/swagger.config';
import { ValidationPipe } from '@nestjs/common';

declare const module: any;

async function bootstrap() {
  const now = Date.now();

  // interactive command-line testing
  if (process.env.REPL == '1') {
    const replServer = await repl(AppModule);
    replServer.setupHistory('.repl_history', (err) => {
      if (err) throw err;
    });
  }

  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const application: AppYamlConfig['application'] = configService.get('application');
  app.setGlobalPrefix('api');
  setupSwagger(app, 'docs', application);

  // app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  app.useGlobalPipes(
    new ValidationPipe({
      // 去除 dto 上不存在的字段
      // whitelist: true,
    }),
  );

  // allow request headers to cross domains
  app.enableCors();

  await app.listen(application.port);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }

  // This can only return an IPv4 address
  const ipv4 = ip(getNetworkInterfaceName());

  // app is ready
  consola.ready({
    message: `🥽 应用程序启动成功，运行在:`,
    badge: true,
  });
  consola.success(` http://localhost:${application.port}`);
  consola.success(` http://${ipv4}:${application.port}\n`);

  consola.start(' swagger documents run on:');
  consola.success(`http://localhost:${application.port}/docs`);
  consola.success(`http://${ipv4}:${application.port}/docs`);
  consola.info(` startup period of ${Date.now() - now}ms`);
}
bootstrap();
