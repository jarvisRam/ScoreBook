import http from 'http';
import path from 'path';
import { AddressInfo } from 'net';
import { Verifier } from '@pact-foundation/pact';

// Local, tokenless pre-push check: verifies the provider against the pact file
// already sitting on disk, instead of pulling from Pactflow. It answers "did my
// change break the contract as currently defined here", not "is it safe to
// deploy against everything else out in the world" — that broader question is
// what CI's broker-backed verify.pact.test.ts + can-i-deploy still exist for.
process.env.DATA_MODE = 'mock';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const app = require('../../src/index').default;

const PACT_FILE = path.resolve(
    __dirname,
    '../../../mobile/pact/pacts/ScoreBookMobile-ScoreBookBackend.json',
);

async function main() {
    const server: http.Server = app.listen(0);
    const { port } = server.address() as AddressInfo;

    const verifier = new Verifier({
        provider: 'ScoreBookBackend',
        providerBaseUrl: `http://localhost:${port}`,
        pactUrls: [PACT_FILE],
    });

    try {
        await verifier.verifyProvider();
        console.log('\n✅ Local contract check passed.\n');
    } catch (error: any) {
        console.error('\n❌ Local contract check failed.\n');
        console.error(error.message || error);
        process.exitCode = 1;
    } finally {
        server.close();
        // The pact-core native binding can keep the event loop alive after
        // verification finishes — force the exit instead of hanging.
        process.exit(process.exitCode ?? 0);
    }
}

main();
