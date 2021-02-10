// Import the server code
// const server = require('./minimal-dynamic-http-server');
import http, { IncomingMessage, ServerResponse } from 'http';
import https from 'https';
import querystring from 'querystring';

const requestListener = (req: IncomingMessage, res: ServerResponse) => {
  if (req.method === 'POST') {
    // 5242880 - 5мб
    if (req.headers['content-length'] && Number(req.headers['content-length']) > 1) {
      const data: any[] = [];
      req.on('data', (chunk) => {
        // TODO: сохранение на диск
        data.push(chunk);
      });
      req.on('end', () => {
        const body = Buffer.concat(data).toString();

        const spellerBody = querystring.stringify({ text: body });
        console.log(spellerBody);
        // TODO: check spellerBody.length < 10000
        const options = {
          hostname: 'speller.yandex.net',
          port: 443,
          path: '/services/spellservice.json/checkText',
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(spellerBody),
          },
        };

        const reqSpeller = https.request(options, (resSpeller) => {
          resSpeller.setEncoding('utf8');
          console.log(`statusCode: ${resSpeller.statusCode}`);

          let result = '';
          resSpeller.on('data', (d) => {
            result += d;
          });

          resSpeller.on('end', () => {
            const parsed = JSON.parse(result);

            console.log(`Speller result = ${JSON.stringify(parsed)}`);
          });
        });

        reqSpeller.on('error', (error) => {
          console.error(error);
        });

        reqSpeller.write(spellerBody);
        reqSpeller.end();
      });
    } else {
      res.writeHead(200);
      res.end('No text file is provided.');
      return;
    }
  }

  res.writeHead(200);
  res.end('Hello, World!');
};

const httpServer = http.createServer(requestListener);

interface AppServer {
  init(port?: number, host?: string): void
}
const server: AppServer = {
  init: (port = 3000, host = '127.0.0.1') => {
    httpServer.listen(port, host, () => {
      console.log(`Server is listening at http://${host}:${port}`);
    });
  },
};

server.init();

// Ограничения
// на количество обращений к Сервису - в размере 10 тысяч обращений в сутки;
// на объем проверяемого текста - в размере 10 миллионов символов в сутки.
