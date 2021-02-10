"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import the server code
// const server = require('./minimal-dynamic-http-server');
const http_1 = __importDefault(require("http"));
const requestListener = (req, res) => {
    res.writeHead(200);
    res.end('Hello, World!');
};
const httpServer = http_1.default.createServer(requestListener);
const server = {
    init: (port = 3000, host = '127.0.0.1') => {
        httpServer.listen(port, host, () => {
            console.log(`Server is listening at http://${host}:${port}`);
        });
    },
};
server.init();
