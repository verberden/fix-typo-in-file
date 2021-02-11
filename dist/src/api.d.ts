/// <reference types="node" />
import { IncomingMessage, ServerResponse } from 'http';
declare const router: {
    [index: string]: (req: IncomingMessage, res: ServerResponse) => Promise<void>;
};
export default router;
