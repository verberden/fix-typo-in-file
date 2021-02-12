"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import DAL from './DAL';
const spellerService_1 = __importDefault(require("./spellerService"));
// eslint-disable-next-line consistent-return
async function checkFileHandler(req, res) {
    if (req.method === 'POST') {
        // TODO: ограничения на размер файла
        if (req.headers['content-type'] === 'application/octet-stream'
            && req.headers['content-length']
            && Number(req.headers['content-length']) > 1) {
            // TODO: сохранение на диск
            // чтобы если файл большой - не съел всю память
            // const dal = new DAL(req);
            // await dal.save();
            // TODO: считывание большого файла по 10 тысяч символов,
            // с логической разбивкой, а не на полуслове.
            // const textPart = await dal.readDataChunk();
            // res.writeHead(200);
            // res.end(textPart);
            // TODO: строгая типизация
            const data = [];
            return new Promise((resolve) => {
                req.on('data', (chunk) => {
                    data.push(chunk);
                });
                req.on('end', async () => {
                    try {
                        const result = await spellerService_1.default.checkText(data);
                        res.setHeader('Content-Type', 'application/octet-stream');
                        result.pipe(res);
                    }
                    catch (err) {
                        // await errorHandler.handleError(err, res);
                        res.writeHead(500);
                        res.end('Oops! There is an error. We are already working to handle this error.');
                    }
                    resolve();
                });
                req.on('error', () => {
                    res.writeHead(500);
                    res.end('Oops! There is an error. We are already working to handle this error.');
                    resolve();
                });
            });
        }
        // await errorHandler.handleError(err, res);
        res.writeHead(404);
        res.end('No text file is provided.');
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
