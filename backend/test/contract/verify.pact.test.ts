import http from 'http';
import { AddressInfo } from 'net';
import { Verifier } from '@pact-foundation/pact';
import app from '../../src/index';

const BROKER_URL = 'https://fanduel-a13fd6f7.pactflow.io';
const isCI = !!process.env.CI;

const brokerToken = process.env.PACT_BROKER_TOKEN;
if (!brokerToken) {
    throw new Error(
        'PACT_BROKER_TOKEN is not set — export it before running contract verification',
    );
}

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

            pactBrokerUrl: BROKER_URL,
            pactBrokerToken: brokerToken,

            consumerVersionSelectors: [
                { mainBranch: true },
                { deployedOrReleased: true },
            ],

            // CI-only: pending-pact handling, result publishing, and version tagging.
            // Spread an empty object locally rather than setting these keys to undefined —
            // pact-core's validator rejects undefined-valued keys.
            ...(isCI
                ? {
                      enablePending: true,
                      publishVerificationResult: true,
                      providerVersion: process.env.PACT_PROVIDER_VERSION,
                      providerVersionBranch: process.env.PACT_PROVIDER_BRANCH,
                  }
                : {}),
        });

        return verifier.verifyProvider();
    });
});
