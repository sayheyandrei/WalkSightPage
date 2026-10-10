import http from 'node:http'; import fs from 'node:fs';
const out = new URL('./out/', import.meta.url).pathname;
fs.mkdirSync(out, { recursive: true });
http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); res.setHeader('Access-Control-Allow-Headers', '*');
  if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }
  const u = new URL(req.url, 'http://x');
  if (u.pathname === '/save') { const ch = []; req.on('data', c => ch.push(c)); req.on('end', () => { const b = Buffer.concat(ch); fs.writeFileSync(out + u.searchParams.get('name') + '.png', b); fs.writeFileSync(out + u.searchParams.get('name') + '.json', JSON.stringify({w:+u.searchParams.get('w'),h:+u.searchParams.get('h')})); console.log('saved', u.searchParams.get('name'), b.length); res.end('ok'); }); return; }
  if (u.pathname === '/done') { console.log('DONE', u.searchParams.get('failed')); return res.end('ok'); }
  res.writeHead(404); res.end();
}).listen(8765, () => console.log('listening'));
