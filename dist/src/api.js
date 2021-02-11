"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const spellerService_1 = __importDefault(require("./spellerService"));
async function checkFileHandler(req, res) {
    if (req.method === 'POST') {
        if (req.headers['content-length'] && Number(req.headers['content-length']) > 1) {
            // TODO: сохранение на диск
            // TODO: считывание большого файла по 10 тысяч символов,
            // с логической разбивкой а не на полуслове - выглядит не тривиально
            // const dal = new DAL(req);
            // await dal.save();
            const data = [];
            req.on('data', (chunk) => {
                data.push(chunk);
            });
            req.on('end', async () => {
                const result = await spellerService_1.default.checkText(data);
                res.setHeader('Content-Type', 'application/octet-stream');
                result.pipe(res);
            });
        }
        else {
            res.writeHead(404);
            res.end('No text file is provided.');
        }
    }
    else {
        // await errorHandler.handleError(err, res);
        res.writeHead(404);
        res.end('Path doesn\'t exists!');
    }
}
const router = {
    '/api/v1/checkFile': checkFileHandler,
};
exports.default = router;
