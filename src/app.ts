import { IncomingMessage, ServerResponse } from 'http';
import { URL } from 'url';
import apiRouter from './api';

// TODO: errorHandler

const requestListener = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
  const { pathname } = new URL(req.url || '', `http://${req.headers.host}`);
  const urlPath = Object.keys(apiRouter).find((route) => route === pathname);

  if (urlPath) {
    await apiRouter[urlPath](req, res);
  } else {
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

export default requestListener;

// Ограничения
// на количество обращений к Сервису - в размере 10 тысяч обращений в сутки;
// на объем проверяемого текста - в размере 10 миллионов символов в сутки.
