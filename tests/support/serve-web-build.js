// Minimal static server for the exported web build (mobile/dist), used by the
// mocked Playwright suite. Falls back to index.html for unknown paths, like a
// single-page-app host (Vercel) would.
//
//   node tests/support/serve-web-build.js [dir] [port]
const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.resolve(process.argv[2] || path.join(__dirname, '../../mobile/dist'));
const port = Number(process.argv[3] || process.env.PORT || 8081);

const TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.ttf': 'font/ttf',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
};

if (!fs.existsSync(path.join(root, 'index.html'))) {
    console.error(`No index.html in ${root}. Build first: cd mobile && npx expo export --platform web`);
    process.exit(1);
}

http.createServer((req, res) => {
    const urlPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    let file = path.join(root, urlPath);

    // Block path traversal out of the build directory
    if (!file.startsWith(root)) {
        res.writeHead(403).end();
        return;
    }
    if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
        file = path.join(root, 'index.html');
    }

    res.writeHead(200, {
        'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream',
    });
    fs.createReadStream(file).pipe(res);
}).listen(port, () => console.log(`Serving ${root} on http://localhost:${port}`));
