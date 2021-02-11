"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const https_1 = __importDefault(require("https"));
const querystring_1 = __importDefault(require("querystring"));
const stream_1 = require("stream");
async function checkText(data, options = undefined) {
    return new Promise((resolve, reject) => {
        const body = Buffer.concat(data).toString();
        const spellerBody = querystring_1.default.stringify({ text: body, options });
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
        const reqSpeller = https_1.default.request(connectionOptions, (resSpeller) => {
            resSpeller.setEncoding('utf8');
            let result = '';
            resSpeller.on('data', (d) => {
                result += d;
            });
            let resultString = body;
            resSpeller.on('end', () => {
                // TODO: строгая типизация
                const parsed = JSON.parse(result);
                parsed.forEach((eroredWord) => {
                    resultString = resultString.replace(eroredWord.word, eroredWord.s[0] || eroredWord.word);
                });
                resolve(stream_1.Readable.from(resultString));
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
exports.default = {
    checkText,
};
