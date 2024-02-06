"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataSexEnum = exports.DataStatusEnum = exports.AppEnum = void 0;
var AppEnum;
(function (AppEnum) {
    AppEnum["REDIS"] = "REDIS_CLIENT";
})(AppEnum || (exports.AppEnum = AppEnum = {}));
var DataStatusEnum;
(function (DataStatusEnum) {
    DataStatusEnum[DataStatusEnum["UNENABLE"] = 2] = "UNENABLE";
    DataStatusEnum[DataStatusEnum["ENABLE"] = 1] = "ENABLE";
    DataStatusEnum[DataStatusEnum["DISABLE"] = 0] = "DISABLE";
})(DataStatusEnum || (exports.DataStatusEnum = DataStatusEnum = {}));
var DataSexEnum;
(function (DataSexEnum) {
    DataSexEnum[DataSexEnum["MAN"] = 1] = "MAN";
    DataSexEnum[DataSexEnum["FEMALE"] = 2] = "FEMALE";
    DataSexEnum[DataSexEnum["UNKNOWN"] = 3] = "UNKNOWN";
})(DataSexEnum || (exports.DataSexEnum = DataSexEnum = {}));
//# sourceMappingURL=enum.js.map