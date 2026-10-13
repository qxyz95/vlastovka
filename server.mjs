import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=fileURLToPath(new URL('.',import.meta.url));
http.createServer(async(req,res)=>{try{const url=new URL(req.url,'http://localhost');const filename=path.resolve(root,'.'+decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname));if(!filename.startsWith(root)) {res.writeHead(403);res.end();return;}const body=await readFile(filename);res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml'})[path.extname(filename)]||'application/octet-stream');res.end(body);}catch{res.writeHead(404);res.end('Nenalezeno');}}).listen(4173,'127.0.0.1',()=>console.log('Just Throw It: http://127.0.0.1:4173'));

