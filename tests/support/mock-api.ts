import type { BrowserContext, Route } from '@playwright/test';
import { loadFixture, matchesEnvelope } from './fixtures';
import type { SportId, StatusId } from './sports';

export interface MockResponse {
    status?: number;
    body?: unknown;
}

/** Receives the 1-based number of this request for the sport/status pair. */
export type MockHandler = (callNumber: number) => MockResponse | Promise<MockResponse>;

const CORS_HEADERS = {
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET,OPTIONS',
    'access-control-allow-headers': '*',
};

const key = (sport: string, status: string) => `${sport}:${status}`;

/**
 * Stands in for the ScoreBook backend. A production web build has the Vercel
 * backend URL baked in, so rather than run a server we intercept `/api/*` in
 * the browser and answer from the committed fixtures. Individual tests
 * override a sport/status to simulate empty, error, slow or changing data.
 */
export class MockApi {
    /** Every matches request seen, in order. */
    readonly requests: { sport: string; status: string; url: string }[] = [];
    /** Requests the mock had no answer for. Tests fail if this is non-empty. */
    readonly unhandled: string[] = [];

    private readonly handlers = new Map<string, MockHandler>();
    private readonly calls = new Map<string, number>();

    constructor(private readonly baseOrigin: string) {}

    /** Override the response for one sport/status list. */
    respond(sport: SportId, status: StatusId, response: MockResponse | MockHandler) {
        this.handlers.set(key(sport, status), typeof response === 'function' ? response : () => response);
    }

    callCount(sport: SportId, status: StatusId) {
        return this.calls.get(key(sport, status)) ?? 0;
    }

    async install(context: BrowserContext) {
        // Registered first = lowest priority. Anything leaving the app origin
        // that isn't the API is blocked, so a mocked run can never reach the
        // real backend or third parties.
        await context.route(
            (url) => url.origin !== this.baseOrigin && !url.pathname.startsWith('/api/'),
            (route) => {
                this.unhandled.push(`blocked external request: ${route.request().url()}`);
                return route.abort();
            },
        );
        await context.route((url) => url.pathname.startsWith('/api/'), (route) => this.handle(route));
    }

    private async handle(route: Route) {
        const request = route.request();
        const url = new URL(request.url());

        if (request.method() === 'OPTIONS') {
            return route.fulfill({ status: 204, headers: CORS_HEADERS });
        }

        const matches = url.pathname.match(/^\/api\/matches\/(\w+)$/);
        if (matches && matches[1] !== 'live') {
            const sport = matches[1] as SportId;
            const status = (url.searchParams.get('status') ?? 'live') as StatusId;
            const k = key(sport, status);
            const callNumber = (this.calls.get(k) ?? 0) + 1;
            this.calls.set(k, callNumber);
            this.requests.push({ sport, status, url: request.url() });

            const handler = this.handlers.get(k);
            const response = handler
                ? await handler(callNumber)
                : { body: matchesEnvelope(loadFixture(sport, status)) };
            return this.fulfill(route, response);
        }

        if (url.pathname === '/api/health') {
            return this.fulfill(route, { body: { status: 'ok', mode: 'mock', timestamp: Date.now() } });
        }

        this.unhandled.push(`${request.method()} ${url.pathname}${url.search}`);
        return this.fulfill(route, {
            status: 404,
            body: { error: { message: 'Not mocked', code: 'NOT_MOCKED' } },
        });
    }

    private async fulfill(route: Route, { status = 200, body }: MockResponse) {
        await route.fulfill({
            status,
            headers: CORS_HEADERS,
            contentType: 'application/json',
            body: JSON.stringify(body ?? {}),
        });
    }
}
