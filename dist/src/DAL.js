"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
class DAL {
    // private fileName: string;
    constructor(data) {
        this.data = data;
        this.startReadingPosition = 0;
    }
    async save() {
        return new Promise((resolve) => {
            // TODO: генерация имени файла fileName
            const file = fs_1.default.createWriteStream('tmp/my_file.txt');
            this.data.pipe(file);
            file.on('finish', resolve);
        });
    }
    // разбиваем данные/файл на части. учитываем что разрыв не может быть по середине слова
    // ищем ближайший пробел в тексте рядом с 10000 символом итд.
    async readDataChunk(maxChunkSize = 10000) {
        const data = [];
        let fileChunk = '';
        const file = fs_1.default.createReadStream('tmp/my_file.txt', { start: this.startReadingPosition, end: this.startReadingPosition + maxChunkSize });
        return new Promise((resolve) => {
            file.on('data', (chunk) => data.push(chunk));
            file.on('end', () => {
                fileChunk = Buffer.concat(data).toString();
                const lastIndex = fileChunk.lastIndexOf(' ');
                fileChunk = fileChunk.substr(0, lastIndex);
                this.startReadingPosition += Buffer.byteLength(fileChunk);
                console.log(fileChunk.length, this.startReadingPosition);
                resolve(fileChunk);
            });
        });
    }
}
exports.default = DAL;
