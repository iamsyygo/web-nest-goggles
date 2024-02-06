"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSelect = exports.parseErrorMessage = exports.getNetworkInterfaceName = void 0;
const getNetworkInterfaceName = () => {
    const f = {
        win32: 'WLAN',
        linux: 'eth',
        darwin: 'en',
    };
    return f[process.platform];
};
exports.getNetworkInterfaceName = getNetworkInterfaceName;
const parseErrorMessage = (errorMessage) => {
    const regex = /^(.*?):\s+(.*?)(?:\s+at\s(.*?)\s\((.*?):(\d+:\d+)\))?$/;
    const match = errorMessage.match(regex);
    if (match) {
        const [, type, message, method, filePath, position, column] = match;
        return {
            type,
            message,
            location: {
                method,
                filePath,
                position,
                column,
            },
        };
    }
    return null;
};
exports.parseErrorMessage = parseErrorMessage;
function getSelect(entity, fields) {
}
exports.getSelect = getSelect;
//# sourceMappingURL=index.js.map