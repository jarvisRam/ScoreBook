import axios from 'axios';
import { config } from '../src/config';
import { CricbuzzRecentMatchesSchema } from '../src/contracts/providers/cricbuzz.schema';

// Fetches a fresh Cricbuzz response and checks it against the schema derived
// from our last captured sample. Unlike the committed fixture in
// test/third-party/fixtures, this never gets saved — it exists purely to
// catch upstream drift before it reaches realDataService.ts in production.
async function main() {
    const response = await axios.get(
        'https://cricbuzz-cricket.p.rapidapi.com/matches/v1/recent',
        {
            headers: {
                'X-RapidAPI-Key': config.rapidApiKey,
                'X-RapidAPI-Host': config.rapidApiHosts.cricket,
            },
        },
    );

    const result = CricbuzzRecentMatchesSchema.safeParse(response.data);

    if (!result.success) {
        console.error('❌ Cricbuzz response no longer matches our provider contract.');
        console.error(JSON.stringify(result.error.format(), null, 2));
        console.error(
            '\nIf this is a legitimate upstream change, update backend/src/contracts/providers/cricbuzz.schema.ts ' +
            'and re-run `npm run capture:cricket-fixture` to refresh the committed sample.',
        );
        process.exit(1);
    }

    console.log('✅ Cricbuzz response still matches our provider contract.');
}

main().catch((err) => {
    console.error('Drift check failed to run:', err.response?.status, err.response?.data || err.message);
    process.exit(1);
});
