import fs from 'fs';
import path from 'path';
import { CricbuzzRecentMatchesSchema } from '../../src/contracts/providers/cricbuzz.schema';

// "Provider self-verification": proves our schema actually matches what
// Cricbuzz sent at capture time. Re-run `npm run capture:cricket-fixture` and
// re-check this to refresh what "real" means. See also consumer.test.ts.
describe('Cricbuzz provider contract (real captured response)', () => {
    it('matches the schema we derived from it', () => {
        const fixturePath = path.resolve(__dirname, 'fixtures/cricbuzz-recent.real.json');
        const realResponse = JSON.parse(fs.readFileSync(fixturePath, 'utf-8'));

        const result = CricbuzzRecentMatchesSchema.safeParse(realResponse);

        if (!result.success) {
            console.error(result.error.format());
        }
        expect(result.success).toBe(true);
    });
});
