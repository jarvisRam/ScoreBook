import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { config } from '../src/config';

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

    const outPath = path.resolve(
        __dirname,
        '../test/contract-thirdparty/fixtures/cricbuzz-recent.real.json',
    );
    fs.writeFileSync(outPath, JSON.stringify(response.data, null, 2));
    console.log(`Saved real Cricbuzz response to ${outPath}`);
}

main().catch((err) => {
    console.error('Capture failed:', err.response?.status, err.response?.data || err.message);
    process.exit(1);
});
