"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeOrmUseFactory = void 0;
const typeorm_naming_strategies_1 = require("typeorm-naming-strategies");
const typeOrmUseFactory = (configService) => {
    const typeOrmConfig = configService.get('db.mysql');
    return {
        ...typeOrmConfig,
        namingStrategy: new typeorm_naming_strategies_1.SnakeNamingStrategy(),
    };
};
exports.typeOrmUseFactory = typeOrmUseFactory;
//# sourceMappingURL=typeorm.config.js.map