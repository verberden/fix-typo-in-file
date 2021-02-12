import fs from 'fs';
import { IncomingMessage } from 'http';

class DAL {
  private data: IncomingMessage;

  private startReadingPosition: number;

  // private fileName: string;

  constructor(data: IncomingMessage) {
    this.data = data;
    this.startReadingPosition = 0;
  }

  public async save(): Promise<void> {
    return new Promise<void>((resolve) => {
      // TODO: генерация имени файла fileName
      const file = fs.createWriteStream('tmp/my_file.txt');
      this.data.pipe(file);
      file.on('finish', resolve);
    });
  }

  // разбиваем данные/файл на части. учитываем что разрыв не может быть по середине слова
  // ищем ближайший пробел в тексте рядом с 10000 символом итд.
  public async readDataChunk(maxChunkSize = 10000): Promise<string> {
    const data: any[] = [];
    let fileChunk = '';
    const file = fs.createReadStream('tmp/my_file.txt', { start: this.startReadingPosition, end: this.startReadingPosition + maxChunkSize });
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

export default DAL;
