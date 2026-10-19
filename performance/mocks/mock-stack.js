// A mocked ScoreBook for frontend load tests: the exported web build served from memory, plus a
// fixture-backed API. Neither side does any real work, so what the load test measures is the
// frontend's delivery path (HTML, JS bundle, and the API calls the app fires on load) and not
// our backend.
//
//   node performance/mocks/mock-stack.js [webPort] [apiPort]
//
// Build the web app against this API first, because the API URL is inlined at build time:
//   EXPO_PUBLIC_API_BASE_URL=http://localhost:3100/api npm run build:web
const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const webPort = Number(process.argv[2] || process.env.MOCK_WEB_PORT || 8081);
const apiPort = Number(process.argv[3] || process.env.MOCK_API_PORT || 3100);
const distDir = path.resolve(__dirname, '../../mobile/dist');
const fixtureDir = path.resolve(__dirname, '../../backend/src/mock-data');

const SPORTS = ['cricket', 'football', 'hockey', 'soccer', 'tennis', 'badminton'];
const STATUSES = ['live', 'upcoming', 'completed'];
const TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json',
    '.css': 'text/css',
    '.png': 'image/png',
    '.ico': 'image/x-icon',
    '.ttf': 'font/ttf',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
};
const COMPRESSIBLE = new Set(['.html', '.js', '.json', '.css', '.ttf']);

// --- Frontend: everything is indexed and compressed once at startup, then served from memory.
// A request path is only ever a lookup key, never joined onto a filesystem path.
if (!fs.existsSync(path.join(distDir, 'index.html'))) {
    console.error(`No web build in ${distDir}. Build first: npm run build:web`);
    process.exit(1);
}

const assets = new Map();
(function index(dir, prefix = '') {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const urlPath = `${prefix}/${entry.name}`;
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            index(full, urlPath);
            continue;
        }
        const ext = path.extname(entry.name);
        const raw = fs.readFileSync(full);
        assets.set(urlPath, {
            type: TYPES[ext] || 'application/octet-stream',
            raw,
            // Vercel serves text assets compressed, so the mock does too
            gzip: COMPRESSIBLE.has(ext) ? zlib.gzipSync(raw) : null,
        });
    }
})(distDir);

http.createServer((req, res) => {
    let urlPath;
    try {
        urlPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    } catch {
        return res.writeHead(400).end();
    }
    // Unknown paths fall back to the SPA shell, like the hosted site
    const asset = assets.get(urlPath) ?? assets.get('/index.html');
    const useGzip = asset.gzip && /\bgzip\b/.test(req.headers['accept-encoding'] || '');
    const body = useGzip ? asset.gzip : asset.raw;
    res.writeHead(200, {
        'Content-Type': asset.type,
        'Content-Length': body.length,
        Vary: 'Accept-Encoding',
        ...(useGzip && { 'Content-Encoding': 'gzip' }),
    });
    res.end(body);
}).listen(webPort, () => console.log(`Mock web  http://localhost:${webPort}  (${assets.size} files from ${distDir})`));

// --- API: the committed fixtures, in the envelope the real backend returns
const fixtures = {};
for (const sport of SPORTS) {
    for (const status of STATUSES) {
        fixtures[`${sport}:${status}`] = JSON.parse(fs.readFileSync(path.join(fixtureDir, sport, `${status}.json`), 'utf-8'));
    }
}
const allMatches = Object.values(fixtures).flat();

const CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,OPTIONS',
    'Access-Control-Allow-Headers': '*',
};

function send(res, status, payload) {
    const json = JSON.stringify(payload);
    res.writeHead(status, { ...CORS, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(json) });
    res.end(json);
}
const envelope = (data) => ({ data, timestamp: Date.now(), mode: 'mock' });

http.createServer((req, res) => {
    if (req.method === 'OPTIONS') return res.writeHead(204, CORS).end();

    const url = new URL(req.url, 'http://localhost');
    const parts = url.pathname.split('/').filter(Boolean); // ['api', ...]
    if (parts[0] !== 'api') return send(res, 404, { error: { code: 'NOT_FOUND' } });

    if (parts[1] === 'health') return send(res, 200, { status: 'ok', mode: 'mock', timestamp: Date.now() });
    if (parts[1] === 'sports') return send(res, 200, envelope(SPORTS.map((id) => ({ id, name: id }))));
    if (parts[1] === 'matches' && parts[2] === 'live') return send(res, 200, envelope(liveMatches('live')));
    if (parts[1] === 'matches' && SPORTS.includes(parts[2])) {
        const status = url.searchParams.get('status');
        const data = status ? fixtures[`${parts[2]}:${status}`] || [] : STATUSES.flatMap((s) => fixtures[`${parts[2]}:${s}`]);
        return send(res, 200, envelope(data));
    }
    if (parts[1] === 'match' && parts[2]) {
        const match = allMatches.find((m) => m.id === parts[2]);
        return match ? send(res, 200, { ...envelope(match) }) : send(res, 404, { error: { code: 'MATCH_NOT_FOUND' } });
    }
    send(res, 404, { error: { code: 'NOT_FOUND' } });
}).listen(apiPort, () => console.log(`Mock api  http://localhost:${apiPort}/api`));

function liveMatches(status) {
    return SPORTS.flatMap((sport) => fixtures[`${sport}:${status}`]);
}
