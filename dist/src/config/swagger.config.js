"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = void 0;
const swagger_1 = require("@nestjs/swagger");
const setupSwagger = (app, path, application) => {
    const config = new swagger_1.DocumentBuilder()
        .setTitle('<📖/> ' + application.name)
        .setDescription(application.description)
        .setVersion(application.version)
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup(path, app, document);
};
exports.setupSwagger = setupSwagger;
//# sourceMappingURL=swagger.config.js.map