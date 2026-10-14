import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = fileURLToPath(new URL('.', import.meta.url));
http
  .createServer(async (req, res) => {
    try {
      const url = new URL(req.url, 'http://localhost');
      const filename = path.resolve(
        root,
        '.' + decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname),
      );
      if (!filename.startsWith(root)) {
        res.writeHead(403);
        res.end();
        return;
      }
      const body = await readFile(filename);
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader(
        'Content-Type',
        {
          '.mjs': 'text/javascript; charset=utf-8',
          '.html': 'text/html; charset=utf-8',
          '.js': 'text/javascript; charset=utf-8',
          '.css': 'text/css; charset=utf-8',
          '.svg': 'image/svg+xml',
          '.json': 'application/json; charset=utf-8',
          '.png': 'image/png',
          '.webp': 'image/webp',
          '.woff2': 'font/woff2',
          '.ogg': 'audio/ogg',
          '.opus': 'audio/ogg; codecs=opus',
          '.webm': 'audio/webm',
          '.m4a': 'audio/mp4',
          '.wav': 'audio/wav',
          '.mp3': 'audio/mpeg',
        }[path.extname(filename)] || 'application/octet-stream',
      );
      res.end(body);
    } catch {
      res.writeHead(404);
      res.end('Nenalezeno');
    }
  })
  .listen(Number(process.env.PORT) || 4173, '127.0.0.1', function () {
    console.log('Just Throw It: http://127.0.0.1:' + this.address().port);
  });
