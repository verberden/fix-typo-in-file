import { IncomingMessage, ServerResponse } from 'http';
declare const requestListener: (req: IncomingMessage, res: ServerResponse) => Promise<void>;
export default requestListener;
