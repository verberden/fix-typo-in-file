/// <reference types="node" />
import { IncomingMessage } from 'http';
declare class DAL {
    private data;
    private startReadingPosition;
    constructor(data: IncomingMessage);
    save(): Promise<void>;
    readDataChunk(maxChunkSize?: number): Promise<string>;
}
export default DAL;
