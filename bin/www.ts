import http from 'http';
import app from '../src/app';

// Create HTTP server.
const server = http.createServer(app);
const port = process.env.PORT ? Number(process.env.PORT) : 3000;
const host = process.env.HOST ? process.env.HOST : '127.0.0.1';

server.listen(port, host, () => {
  console.log(`Server is listening at http://${host}:${port}`);
});
