"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.winstonUseFactory = void 0;
const winston = require("winston");
require("winston-daily-rotate-file");
const path = require("path");
const winstonUseFactory = (configService) => {
    if (process.env.NODE_ENV !== 'development')
        return {};
    const winstonWonfig = configService.get('logs.winston');
    const { dirname, filename, datePattern, level, ...rest } = winstonWonfig;
    const pwd = process.cwd();
    const dir = path.join(pwd, dirname || '/logs/winston');
    return {
        transports: [
            new winston.transports.Console({
                level,
                format: winston.format.combine(winston.format.printf((info) => {
                    return info.message;
                })),
            }),
            new winston.transports.DailyRotateFile({
                format: winston.format.combine(winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston.format.printf(({ level, timestamp, stack, message }) => {
                    if (!stack)
                        return message;
                    return JSON.stringify({ level, timestamp, stack });
                })),
                dirname: dir,
                filename: filename + '.info.log',
                datePattern,
                ...rest,
            }),
        ],
        exceptionHandlers: [
            new winston.transports.DailyRotateFile({
                dirname: dir,
                filename: filename + '.exception.log',
                datePattern,
                ...rest,
            }),
        ],
        rejectionHandlers: [
            new winston.transports.DailyRotateFile({
                dirname: dir,
                filename: filename + '.reject.log',
                datePattern,
                ...rest,
            }),
        ],
        exitOnError: true,
    };
};
exports.winstonUseFactory = winstonUseFactory;
//# sourceMappingURL=winston.config.js.map