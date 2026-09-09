import http from 'http';
import path from 'path';
import { AddressInfo } from 'net';
import { Verifier } from '@pact-foundation/pact';
import app from '../../src/index';

let server: http.Server;
let providerBaseUrl: string;

beforeAll((done) => {
    server = app.listen(0, () => {
        const { port } = server.address() as AddressInfo;
        providerBaseUrl = `http://localhost:${port}`;
        done();
    });
});

afterAll((done) => {
    server.close(done);
});

describe('Pact Verification: ScoreBookBackend', () => {
    it('validates the expectations of ScoreBookMobile', () => {
        const verifier = new Verifier({
    provider: 'ScoreBookBackend',
    providerBaseUrl,
    pactBrokerUrl: 'https://fanduel-a13fd6f7.pactflow.io',
    pactBrokerToken: process.env.PACT_BROKER_TOKEN,
    consumerVersionSelectors: [{ latest: true }],
    publishVerificationResult: true,
    providerVersion: process.env.PACT_PROVIDER_VERSION,
});

        return verifier.verifyProvider();
    });
});
