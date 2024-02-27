"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkipJwtPassport = void 0;
const common_1 = require("@nestjs/common");
const SkipJwtPassport = () => (0, common_1.SetMetadata)('NO_NEET_JWT_AUTH', true);
exports.SkipJwtPassport = SkipJwtPassport;
//# sourceMappingURL=skip-jwt-passport.decorator.js.map