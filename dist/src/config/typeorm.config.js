"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeOrmUseFactory = void 0;
const typeorm_naming_strategies_1 = require("typeorm-naming-strategies");
const role_entity_1 = require("../main/role/entities/role.entity");
const user_entity_1 = require("../main/user/entities/user.entity");
const permission_entity_1 = require("../main/permission/entities/permission.entity");
const typeOrmUseFactory = (configService) => {
    const typeOrmConfig = configService.get('db.mysql');
    return {
        ...typeOrmConfig,
        namingStrategy: new typeorm_naming_strategies_1.SnakeNamingStrategy(),
        entities: [user_entity_1.User, role_entity_1.Role, permission_entity_1.Permission],
    };
};
exports.typeOrmUseFactory = typeOrmUseFactory;
//# sourceMappingURL=typeorm.config.js.map