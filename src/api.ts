import { IncomingMessage, ServerResponse } from 'http';
// import DAL from './DAL';
import spellerService from './spellerService';

// eslint-disable-next-line consistent-return
async function checkFileHandler(req: IncomingMessage, res: ServerResponse): Promise<void> {
  if (req.method === 'POST') {
    // TODO: ограничения на размер файла
    if (
      req.headers['content-type'] === 'application/octet-stream'
      && req.headers['content-length']
      && Number(req.headers['content-length']) > 1
    ) {
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
      const data: any[] = [];

      return new Promise((resolve) => {
        req.on('data', (chunk) => {
          data.push(chunk);
        });

        req.on('end', async () => {
          try {
            const result = await spellerService.checkText(data);

            res.setHeader('Content-Type', 'application/octet-stream');
            result.pipe(res);
          } catch (err) {
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
  } else {
    // await errorHandler.handleError(err, res);
    res.writeHead(404);
    res.end('Path doesn\'t exists!');
  }
}

const router: { [index:string] : (req: IncomingMessage, res: ServerResponse) => Promise<void> } = {
  '/api/v1/checkFile': checkFileHandler,
};

export default router;
