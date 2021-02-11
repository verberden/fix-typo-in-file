import https from 'https';
import querystring from 'querystring';
import { Readable } from 'stream';

async function checkText(
  data: any[],
  options = undefined,
): Promise<Readable> {
  return new Promise<Readable>((resolve, reject) => {
    const body = Buffer.concat(data).toString();

    const spellerBody = querystring.stringify({ text: body, options });
    // TODO: check body.length < 10000
    const connectionOptions = {
      hostname: 'speller.yandex.net',
      port: 443,
      path: '/services/spellservice.json/checkText',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(spellerBody),
      },
    };

    const reqSpeller = https.request(connectionOptions, (resSpeller) => {
      resSpeller.setEncoding('utf8');

      let result = '';
      resSpeller.on('data', (d) => {
        result += d;
      });
      let resultString = body;
      resSpeller.on('end', () => {
        // TODO: строгая типизация
        const parsed: any[] = JSON.parse(result);

        parsed.forEach((eroredWord) => {
          resultString = resultString.replace(
            eroredWord.word,
            eroredWord.s[0] || eroredWord.word,
          );
        });

        resolve(Readable.from(resultString));
      });
    });

    reqSpeller.on('error', (error) => {
      console.error(error);
      reject(error);
    });

    reqSpeller.write(spellerBody);
    reqSpeller.end();
  });
}

export default {
  checkText,
};
