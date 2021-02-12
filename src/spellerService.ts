import https from 'https';
import querystring from 'querystring';
import { Readable } from 'stream';

async function checkText(
  data: any[],
  options = undefined,
): Promise<Readable> {
  return new Promise<Readable>((resolve, reject) => {
    const checkedText = Buffer.concat(data).toString();

    const spellerRequestBody = querystring.stringify({ text: checkedText, options });
    // TODO: check checkedText.length < 10000
    const connectionOptions = {
      hostname: 'speller.yandex.net',
      port: 443,
      path: '/services/spellservice.json/checkText',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(spellerRequestBody),
      },
    };

    const reqSpeller = https.request(connectionOptions, (resSpeller) => {
      resSpeller.setEncoding('utf8');

      let result = '';
      resSpeller.on('data', (d) => {
        result += d;
      });
      let resultString = checkedText;
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

    reqSpeller.write(spellerRequestBody);
    reqSpeller.end();
  });
}

export default {
  checkText,
};
