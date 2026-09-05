/**
 * serve-output — 把 nuxt generate 的 .output/public 架在本機，模擬正式站的路徑前綴與快取標頭。
 *
 * 為什麼不用 `nuxt preview` / `npx serve`：
 *   ・產物內的 _nuxt 路徑帶著 NUXT_URL 的 pathname（如 /newmedia/2026/udn75/），
 *     要掛在同一個前綴下連結才對得上。
 *   ・要回 `Cache-Control: public, max-age=300`（正式站實測值），否則重複抓取的數字會失真。
 *
 * 用法：node scripts/serve-output.mjs [--port 4173] [--root .output/public]
 * 量完記得關：Get-NetTCPConnection -LocalPort 4173 -State Listen → Stop-Process
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
};

const PORT = Number(arg('port', 4173));
const ROOT = path.resolve(arg('root', '.output/public'));

// 路徑前綴＝ .env 的 NUXT_URL pathname；沒有 .env 或不是完整 URL 就掛在根。
const readPrefix = () => {
  try {
    const env = fs.readFileSync('.env', 'utf8');
    const m = env.match(/^NUXT_URL=(.+)$/m);
    if (!m) return '';
    const p = new URL(m[1].trim()).pathname;
    return p.endsWith('/') ? p.slice(0, -1) : p;
  } catch {
    return '';
  }
};
const PREFIX = readPrefix();

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.mp4': 'video/mp4',
  '.mp3': 'audio/mpeg',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
};

http
  .createServer((req, res) => {
    let url = decodeURIComponent(req.url.split('?')[0]);
    if (PREFIX && !url.startsWith(PREFIX)) {
      res.writeHead(404);
      return res.end();
    }
    url = url.slice(PREFIX.length) || '/';
    let file = path.join(ROOT, url);
    try {
      if (fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    } catch {
      if (fs.existsSync(`${file}.html`)) file = `${file}.html`;
    }
    if (!fs.existsSync(file)) {
      res.writeHead(404);
      return res.end('not found');
    }
    res.writeHead(200, {
      'content-type': MIME[path.extname(file)] ?? 'application/octet-stream',
      'cache-control': 'public, max-age=300',
      'last-modified': new Date(0).toUTCString(),
      'accept-ranges': 'bytes',
    });
    fs.createReadStream(file).pipe(res);
  })
  .listen(PORT, () => {
    console.log(`serving ${ROOT} at http://localhost:${PORT}${PREFIX}/`);
  });
