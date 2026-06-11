// BigPoint static server — keine Abhängigkeiten nötig
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const TYPES = { '.html':'text/html', '.png':'image/png', '.jpg':'image/jpeg', '.svg':'image/svg+xml', '.mp4':'video/mp4', '.css':'text/css', '.js':'text/javascript', '.ico':'image/x-icon', '.pdf':'application/pdf' };

http.createServer((req, res) => {
  let file = req.url.split('?')[0];
  if (file === '/' || file === '') file = '/index.html';
  const fp = path.join(__dirname, path.normalize(file).replace(/^(\.\.[\/\\])+/, ''));
  fs.readFile(fp, (err, data) => {
    if (err) {
      // Fallback: immer index.html liefern
      fs.readFile(path.join(__dirname, 'index.html'), (e2, idx) => {
        if (e2) { res.writeHead(404); res.end('Not found'); return; }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(idx);
      });
      return;
    }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(fp).toLowerCase()] || 'application/octet-stream' });
    res.end(data);
  });
}).listen(PORT, () => console.log('BigPoint läuft auf Port ' + PORT));
