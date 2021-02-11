/// <reference types="node" />
import { IncomingMessage } from 'http';
declare class DAL {
    private data;
    constructor(data: IncomingMessage);
    save(): Promise<void>;
}
export default DAL;
