"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("../src/app"));
// Create HTTP server.
const server = http_1.default.createServer(app_1.default);
const port = process.env.PORT ? Number(process.env.PORT) : 3000;
const host = process.env.HOST ? process.env.HOST : '127.0.0.1';
server.listen(port, host, () => {
    console.log(`Server is listening at http://${host}:${port}`);
});
