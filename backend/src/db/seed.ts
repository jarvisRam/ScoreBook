import { readFileSync } from 'fs';
import { join } from 'path';
import { neon } from '@neondatabase/serverless';
import { teams, venues, tournaments, getTeamsBySport, getVenuesBySport, getTournamentsBySport, getDuration, matchFormats } from './seedData';
import { Sport } from '../types/api.types';

// Load env files - .env.local takes priority (contains Vercel-provisioned vars like DATABASE_URL)
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();

const SPORTS: Sport[] = ['cricket', 'football', 'hockey', 'soccer', 'tennis', 'badminton'];
const MATCHES_PER_SPORT = 6;

function generateMatchId(sport: string, index: number): string {
    return `sim_${sport}_${Date.now()}_${index}`;
}

function randomSeed(): number {
    return Math.floor(Math.random() * 2147483647);
}

export async function seedDatabase(databaseUrl?: string) {
    const url = databaseUrl || process.env.DATABASE_URL;
    if (!url) {
        throw new Error('DATABASE_URL is not set');
    }

    const sql = neon(url);

    console.log('Creating tables...');
    const schemaPath = join(__dirname, '..', 'db', 'schema.sql');
    let schema: string;
    try {
        schema = readFileSync(schemaPath, 'utf-8');
    } catch {
        // When running from compiled dist, try relative to current file
        schema = readFileSync(join(__dirname, 'schema.sql'), 'utf-8');
    }

    const statements = schema
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0);

    for (const stmt of statements) {
        await sql.query(stmt);
    }

    console.log('Clearing existing data...');
    await sql`DELETE FROM matches`;
    await sql`DELETE FROM teams`;
    await sql`DELETE FROM venues`;
    await sql`DELETE FROM tournaments`;

    console.log('Inserting teams...');
    for (const t of teams) {
        await sql`INSERT INTO teams (id, sport, name, initials, logo)
                  VALUES (${t.id}, ${t.sport}, ${t.name}, ${t.initials}, ${null})
                  ON CONFLICT (id) DO NOTHING`;
    }

    console.log('Inserting venues...');
    for (const v of venues) {
        await sql`INSERT INTO venues (id, sport, name, city, country, state)
                  VALUES (${v.id}, ${v.sport}, ${v.name}, ${v.city}, ${v.country}, ${v.state || null})
                  ON CONFLICT (id) DO NOTHING`;
    }

    console.log('Inserting tournaments...');
    for (const t of tournaments) {
        await sql`INSERT INTO tournaments (id, sport, name, format)
                  VALUES (${t.id}, ${t.sport}, ${t.name}, ${t.format || null})
                  ON CONFLICT (id) DO NOTHING`;
    }

    console.log('Generating matches...');
    const now = Date.now();

    for (const sport of SPORTS) {
        const sportTeams = getTeamsBySport(sport);
        const sportVenues = getVenuesBySport(sport);
        const sportTournaments = getTournamentsBySport(sport);
        const formats = matchFormats[sport];

        for (let i = 0; i < MATCHES_PER_SPORT; i++) {
            const homeIdx = i % sportTeams.length;
            const awayIdx = (i + 1) % sportTeams.length;
            if (homeIdx === awayIdx) continue;

            const homeTeam = sportTeams[homeIdx];
            const awayTeam = sportTeams[awayIdx];
            const venue = sportVenues[i % sportVenues.length];
            const tournament = sportTournaments[i % sportTournaments.length];
            const format = formats[i % formats.length];
            const duration = getDuration(sport, format);

            // Stagger start times:
            // Matches 0-1: live (started 30-60% ago)
            // Matches 2-3: upcoming (start within next 1-24h)
            // Matches 4-5: completed (finished 1-24h ago)
            let startTime: Date;
            if (i < 2) {
                // Live: started some fraction ago
                const fractionElapsed = 0.3 + (i * 0.2);
                const elapsedMs = fractionElapsed * duration * 60 * 1000;
                startTime = new Date(now - elapsedMs);
            } else if (i < 4) {
                // Upcoming: 2-12 hours from now
                const hoursAhead = 2 + (i - 2) * 5;
                startTime = new Date(now + hoursAhead * 3600 * 1000);
            } else {
                // Completed: finished 2-12 hours ago
                const hoursAgo = 2 + (i - 4) * 5;
                const totalMs = duration * 60 * 1000 + hoursAgo * 3600 * 1000;
                startTime = new Date(now - totalMs);
            }

            const matchId = generateMatchId(sport, i);

            await sql`INSERT INTO matches (id, sport, home_team_id, away_team_id, venue_id, tournament_id, start_time, duration_minutes, format, seed)
                      VALUES (${matchId}, ${sport}, ${homeTeam.id}, ${awayTeam.id}, ${venue.id}, ${tournament.id}, ${startTime.toISOString()}, ${duration}, ${format}, ${randomSeed()})`;
        }

        console.log(`  ${sport}: ${MATCHES_PER_SPORT} matches created`);
    }

    // Verify
    const counts = await sql`SELECT sport, COUNT(*) as count FROM matches GROUP BY sport ORDER BY sport`;
    console.log('\nMatch counts by sport:');
    for (const row of counts) {
        console.log(`  ${row.sport}: ${row.count}`);
    }

    console.log('\nSeed complete!');
}

// Run directly if executed as script
if (require.main === module) {
    seedDatabase()
        .then(() => process.exit(0))
        .catch(err => {
            console.error('Seed failed:', err);
            process.exit(1);
        });
}
