import { IncomingMessage, ServerResponse } from 'http';
import DAL from './DAL';
import spellerService from './spellerService';

async function checkFileHandler(req: IncomingMessage, res: ServerResponse): Promise<void> {
  if (req.method === 'POST') {
    if (req.headers['content-length'] && Number(req.headers['content-length']) > 1) {
      // TODO: сохранение на диск
      // TODO: считывание большого файла по 10 тысяч символов,
      // с логической разбивкой а не на полуслове - выглядит не тривиально
      // const dal = new DAL(req);
      // await dal.save();
      const data: any[] = [];

      req.on('data', (chunk) => {
        data.push(chunk);
      });
      req.on('end', async () => {
        const result = await spellerService.checkText(data);

        res.setHeader('Content-Type', 'application/octet-stream');
        result.pipe(res);
      });
    } else {
      res.writeHead(404);
      res.end('No text file is provided.');
    }
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
