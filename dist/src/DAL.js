"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
class DAL {
    constructor(data) {
        this.data = data;
    }
    async save() {
        return new Promise((resolve) => {
            // TODO: генерация имени файла
            const file = fs_1.default.createWriteStream('tmp/my_file.txt');
            this.data.pipe(file);
            file.on('finish', resolve);
        });
    }
}
exports.default = DAL;
