import { CricbuzzRecentMatchesSchema } from '../../src/contracts/providers/cricbuzz.schema';
import { cricketMockData } from '../fixtures/cricbuzzMock';

// "Consumer verification": proves the hand-typed mock our integration tests
// rely on (test/fixtures/cricbuzzMock.ts) is actually representative of the
// real provider shape, instead of a fictional payload nobody has checked
// against reality. See also provider.test.ts.
describe('Cricbuzz consumer fixture (hand-typed mock)', () => {
    it('matches the real-world provider schema', () => {
        const result = CricbuzzRecentMatchesSchema.safeParse(cricketMockData);

        if (!result.success) {
            console.error(result.error.format());
        }
        expect(result.success).toBe(true);
    });
});
