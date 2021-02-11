import fs from 'fs';
import { IncomingMessage } from 'http';

class DAL {
  private data: IncomingMessage;

  constructor(data: IncomingMessage) {
    this.data = data;
  }

  public async save(): Promise<void> {
    return new Promise<void>((resolve) => {
      // TODO: генерация имени файла
      const file = fs.createWriteStream('tmp/my_file.txt');
      this.data.pipe(file);
      file.on('finish', resolve);
    });
  }
}

export default DAL;
