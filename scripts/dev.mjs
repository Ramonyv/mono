import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve('dist');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2'};
const server=http.createServer(async(req,res)=>{
  try{
    const url=new URL(req.url,'http://localhost');
    let file=path.resolve(root,'.'+decodeURIComponent(url.pathname));
    if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403);res.end('Forbidden');return}
    if((await stat(file)).isDirectory())file=path.join(file,'index.html');
    const body=await readFile(file);res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});res.end(body);
  }catch{res.writeHead(404);res.end('Not found')}
});
let port=Number(process.env.PORT)||4175;
server.on('error',error=>{if(error.code==='EADDRINUSE'){console.log(`Port ${port} is in use, trying ${port+1}…`);server.listen(++port,'127.0.0.1')}else{console.error(error.message);process.exit(1)}});
server.on('listening',()=>console.log(`\nMono is ready: http://localhost:${port}\n`));
server.listen(port,'127.0.0.1');
