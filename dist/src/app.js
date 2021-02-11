"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const url_1 = require("url");
const api_1 = __importDefault(require("./api"));
const requestListener = async (req, res) => {
    const { pathname } = new url_1.URL(req.url || '', `http://${req.headers.host}`);
    const urlPath = Object.keys(api_1.default).find((route) => route === pathname);
    if (urlPath) {
        await api_1.default[urlPath](req, res);
    }
    else {
        // await errorHandler.handleError(err, res);
        res.writeHead(404);
        res.end('Path doesn\'t exists!');
    }
};
process.on('uncaughtException', (error) => {
    // errorHandler.handleError(error);
    console.log(error);
});
process.on('unhandledRejection', (reason) => {
    // errorHandler.handleError(reason);
    console.log(reason);
});
exports.default = requestListener;
// Ограничения
// на количество обращений к Сервису - в размере 10 тысяч обращений в сутки;
// на объем проверяемого текста - в размере 10 миллионов символов в сутки.
