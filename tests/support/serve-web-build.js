// Minimal static server for the exported web build (mobile/dist), used by the
// mocked Playwright suite. Falls back to index.html for unknown paths, like a
// single-page-app host (Vercel) would.
//
//   node tests/support/serve-web-build.js [port]
const http = require('http');
const fs = require('fs');
const path = require('path');

// The directory is fixed rather than a CLI argument, so no external input decides what gets read
const root = path.resolve(__dirname, '../../mobile/dist');
const port = Number(process.argv[2] || process.env.PORT || 8081);

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

const indexFile = path.join(root, 'index.html');
if (!fs.existsSync(indexFile)) {
    console.error(`No index.html in ${root}. Build first: npm run build:web`);
    process.exit(1);
}

// Index the build once at startup and serve only from this map. A request path is only ever
// used as a lookup key, never joined onto a filesystem path, so there is nothing to traverse.
function indexFiles(dir, urlPrefix = '', files = new Map()) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const urlPath = `${urlPrefix}/${entry.name}`;
        if (entry.isDirectory()) indexFiles(path.join(dir, entry.name), urlPath, files);
        else files.set(urlPath, path.join(dir, entry.name));
    }
    return files;
}
const files = indexFiles(root);

http.createServer((req, res) => {
    let urlPath;
    try {
        urlPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    } catch {
        res.writeHead(400).end();
        return;
    }

    const file = files.get(urlPath) ?? indexFile;
    res.writeHead(200, {
        'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream',
    });
    fs.createReadStream(file).pipe(res);
}).listen(port, () => console.log(`Serving ${root} on http://localhost:${port}`));
