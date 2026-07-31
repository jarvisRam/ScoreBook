import { getDb } from '../db/connection';
import { simulateMatch, MatchRow } from './simulationEngine';
import { Match, MatchStatus, Sport } from '../types/api.types';
import { seedDatabase } from '../db/seed';

type Rows = Record<string, any>[];

function rowsToMatches(rows: Rows): Match[] {
    const now = new Date();
    return rows.map(row => simulateMatch(row as unknown as MatchRow, now));
}

async function queryMatchesBySportAndStatus(sport: Sport, status: MatchStatus | undefined): Promise<Rows> {
    const sql = getDb();
    const now = new Date().toISOString();

    if (status === 'live') {
        return sql`
            SELECT m.id, m.sport, m.seed, m.start_time, m.duration_minutes, m.format,
                ht.id AS home_team_id, ht.name AS home_team_name, ht.initials AS home_team_initials, ht.logo AS home_team_logo,
                at.id AS away_team_id, at.name AS away_team_name, at.initials AS away_team_initials, at.logo AS away_team_logo,
                v.name AS venue_name, v.city AS venue_city, v.country AS venue_country, v.state AS venue_state,
                t.name AS tournament_name
            FROM matches m
            JOIN teams ht ON m.home_team_id = ht.id
            JOIN teams at ON m.away_team_id = at.id
            JOIN venues v ON m.venue_id = v.id
            JOIN tournaments t ON m.tournament_id = t.id
            WHERE m.sport = ${sport}
                AND m.start_time <= ${now}::timestamptz
                AND m.start_time + (m.duration_minutes * INTERVAL '1 minute') > ${now}::timestamptz
        `;
    }

    if (status === 'upcoming') {
        return sql`
            SELECT m.id, m.sport, m.seed, m.start_time, m.duration_minutes, m.format,
                ht.id AS home_team_id, ht.name AS home_team_name, ht.initials AS home_team_initials, ht.logo AS home_team_logo,
                at.id AS away_team_id, at.name AS away_team_name, at.initials AS away_team_initials, at.logo AS away_team_logo,
                v.name AS venue_name, v.city AS venue_city, v.country AS venue_country, v.state AS venue_state,
                t.name AS tournament_name
            FROM matches m
            JOIN teams ht ON m.home_team_id = ht.id
            JOIN teams at ON m.away_team_id = at.id
            JOIN venues v ON m.venue_id = v.id
            JOIN tournaments t ON m.tournament_id = t.id
            WHERE m.sport = ${sport} AND m.start_time > ${now}::timestamptz
        `;
    }

    if (status === 'completed') {
        return sql`
            SELECT m.id, m.sport, m.seed, m.start_time, m.duration_minutes, m.format,
                ht.id AS home_team_id, ht.name AS home_team_name, ht.initials AS home_team_initials, ht.logo AS home_team_logo,
                at.id AS away_team_id, at.name AS away_team_name, at.initials AS away_team_initials, at.logo AS away_team_logo,
                v.name AS venue_name, v.city AS venue_city, v.country AS venue_country, v.state AS venue_state,
                t.name AS tournament_name
            FROM matches m
            JOIN teams ht ON m.home_team_id = ht.id
            JOIN teams at ON m.away_team_id = at.id
            JOIN venues v ON m.venue_id = v.id
            JOIN tournaments t ON m.tournament_id = t.id
            WHERE m.sport = ${sport}
                AND m.start_time + (m.duration_minutes * INTERVAL '1 minute') <= ${now}::timestamptz
        `;
    }

    return sql`
        SELECT m.id, m.sport, m.seed, m.start_time, m.duration_minutes, m.format,
            ht.id AS home_team_id, ht.name AS home_team_name, ht.initials AS home_team_initials, ht.logo AS home_team_logo,
            at.id AS away_team_id, at.name AS away_team_name, at.initials AS away_team_initials, at.logo AS away_team_logo,
            v.name AS venue_name, v.city AS venue_city, v.country AS venue_country, v.state AS venue_state,
            t.name AS tournament_name
        FROM matches m
        JOIN teams ht ON m.home_team_id = ht.id
        JOIN teams at ON m.away_team_id = at.id
        JOIN venues v ON m.venue_id = v.id
        JOIN tournaments t ON m.tournament_id = t.id
        WHERE m.sport = ${sport}
        ORDER BY m.start_time
    `;
}

async function queryLiveMatches(): Promise<Rows> {
    const sql = getDb();
    const now = new Date().toISOString();
    return sql`
        SELECT m.id, m.sport, m.seed, m.start_time, m.duration_minutes, m.format,
            ht.id AS home_team_id, ht.name AS home_team_name, ht.initials AS home_team_initials, ht.logo AS home_team_logo,
            at.id AS away_team_id, at.name AS away_team_name, at.initials AS away_team_initials, at.logo AS away_team_logo,
            v.name AS venue_name, v.city AS venue_city, v.country AS venue_country, v.state AS venue_state,
            t.name AS tournament_name
        FROM matches m
        JOIN teams ht ON m.home_team_id = ht.id
        JOIN teams at ON m.away_team_id = at.id
        JOIN venues v ON m.venue_id = v.id
        JOIN tournaments t ON m.tournament_id = t.id
        WHERE m.start_time <= ${now}::timestamptz
            AND m.start_time + (m.duration_minutes * INTERVAL '1 minute') > ${now}::timestamptz
        ORDER BY m.start_time
    `;
}

async function queryMatchById(matchId: string): Promise<Rows> {
    const sql = getDb();
    return sql`
        SELECT m.id, m.sport, m.seed, m.start_time, m.duration_minutes, m.format,
            ht.id AS home_team_id, ht.name AS home_team_name, ht.initials AS home_team_initials, ht.logo AS home_team_logo,
            at.id AS away_team_id, at.name AS away_team_name, at.initials AS away_team_initials, at.logo AS away_team_logo,
            v.name AS venue_name, v.city AS venue_city, v.country AS venue_country, v.state AS venue_state,
            t.name AS tournament_name
        FROM matches m
        JOIN teams ht ON m.home_team_id = ht.id
        JOIN teams at ON m.away_team_id = at.id
        JOIN venues v ON m.venue_id = v.id
        JOIN tournaments t ON m.tournament_id = t.id
        WHERE m.id = ${matchId}
    `;
}

// In-memory lock to prevent concurrent regenerations
let regenerating: Promise<void> | null = null;

class SimulationService {
    async getMatchesBySport(sport: Sport, status?: MatchStatus): Promise<Match[]> {
        const rows = await queryMatchesBySportAndStatus(sport, status);
        return rowsToMatches(rows as Record<string, any>[]);
    }

    async getLiveMatches(): Promise<Match[]> {
        const rows = await queryLiveMatches();

        if (rows.length === 0) {
            const sql = getDb();
            const now = new Date().toISOString();
            const upcoming = await sql`SELECT COUNT(*) as count FROM matches WHERE start_time > ${now}::timestamptz`;
            if (parseInt(upcoming[0].count as string) === 0) {
                console.log('No live or upcoming matches - auto-regenerating...');
                await this.regenerateMatches();
                const newRows = await queryLiveMatches();
                return rowsToMatches(newRows as Record<string, any>[]);
            }
        }

        return rowsToMatches(rows as Record<string, any>[]);
    }

    async getMatchById(matchId: string): Promise<Match | null> {
        const rows = await queryMatchById(matchId);
        if (rows.length === 0) return null;
        return rowsToMatches(rows as Record<string, any>[])[0];
    }

    async regenerateMatches(): Promise<void> {
        // Prevent concurrent regenerations
        if (regenerating) {
            await regenerating;
            return;
        }
        regenerating = seedDatabase().finally(() => { regenerating = null; });
        await regenerating;
    }
}

export const simulationService = new SimulationService();
