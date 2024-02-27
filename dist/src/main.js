"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const config_1 = require("@nestjs/config");
const consola_1 = require("consola");
const address_1 = require("address");
const utils_1 = require("./utils");
const swagger_config_1 = require("./config/swagger.config");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const now = Date.now();
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    const application = configService.get('application');
    app.setGlobalPrefix('api');
    (0, swagger_config_1.setupSwagger)(app, 'docs', application);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
    }));
    await app.listen(application.port);
    if (module.hot) {
        module.hot.accept();
        module.hot.dispose(() => app.close());
    }
    const ipv4 = (0, address_1.ip)((0, utils_1.getNetworkInterfaceName)());
    consola_1.consola.ready({
        message: `🥽 应用程序启动成功，运行在:`,
        badge: true,
    });
    consola_1.consola.success(`<🏄/> http://localhost:${application.port}`);
    consola_1.consola.success(`<🏄/> http://${ipv4}:${application.port}\n`);
    consola_1.consola.start('📖 swagger 文档运行在:');
    consola_1.consola.success(`http://localhost:${application.port}/docs`);
    consola_1.consola.success(`http://${ipv4}:${application.port}/docs`);
    consola_1.consola.info(`⏱️  启动耗时${Date.now() - now}ms`);
}
bootstrap();
//# sourceMappingURL=main.js.map