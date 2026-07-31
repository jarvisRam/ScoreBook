import { Match, MatchStatus, Sport } from '../types/api.types';
import { createSeededRandom, seededInt, seededPick } from '../utils/seededRandom';

// Database row shape from JOIN query
export interface MatchRow {
    id: string;
    sport: Sport;
    seed: number;
    start_time: string; // ISO timestamp
    duration_minutes: number;
    format: string | null;
    home_team_id: string;
    home_team_name: string;
    home_team_initials: string;
    home_team_logo: string | null;
    away_team_id: string;
    away_team_name: string;
    away_team_initials: string;
    away_team_logo: string | null;
    venue_name: string;
    venue_city: string;
    venue_country: string;
    venue_state: string | null;
    tournament_name: string;
}

function computeStatus(startTime: Date, durationMinutes: number, now: Date): MatchStatus {
    if (now < startTime) return 'upcoming';
    const endTime = new Date(startTime.getTime() + durationMinutes * 60 * 1000);
    if (now >= endTime) return 'completed';
    return 'live';
}

function getElapsedMinutes(startTime: Date, now: Date): number {
    return Math.max(0, (now.getTime() - startTime.getTime()) / 60000);
}

function simulateCricket(rng: () => number, elapsed: number, duration: number, format: string | null) {
    const totalOvers = format === 'ODI' ? 50 : 20;
    const totalMinutes = format === 'ODI' ? 480 : 180;
    const fraction = Math.min(elapsed / totalMinutes, 1);

    // Each team bats for half the match
    const inningsMinutes = totalMinutes / 2;
    const isSecondInnings = elapsed > inningsMinutes;

    const simulateInnings = (seed: number, oversFraction: number) => {
        const ir = createSeededRandom(seed);
        const maxOvers = Math.min(Math.floor(oversFraction * totalOvers * 10) / 10, totalOvers);
        let runs = 0;
        let wickets = 0;
        const ballsToSimulate = Math.floor(maxOvers * 6);

        for (let i = 0; i < ballsToSimulate && wickets < 10; i++) {
            const r = ir();
            if (r < 0.55) runs += 0;       // dot ball
            else if (r < 0.75) runs += 1;   // single
            else if (r < 0.82) runs += 2;   // double
            else if (r < 0.88) runs += 4;   // boundary
            else if (r < 0.93) runs += 6;   // six
            else { wickets++; }              // wicket
        }

        const completedBalls = Math.min(ballsToSimulate, totalOvers * 6);
        const overs = Math.floor(completedBalls / 6);
        const balls = completedBalls % 6;
        return { runs, wickets: Math.min(wickets, 10), overs: `${overs}.${balls}` };
    };

    const homeFraction = isSecondInnings ? 1 : Math.min(elapsed / inningsMinutes, 1);
    const awayFraction = isSecondInnings ? Math.min((elapsed - inningsMinutes) / inningsMinutes, 1) : 0;

    // Use different seed offsets for each team's innings
    const homeScore = simulateInnings(rng() * 2147483647, homeFraction);
    const awayScore = awayFraction > 0
        ? simulateInnings(rng() * 2147483647, awayFraction)
        : undefined;

    return { homeScore, awayScore };
}

function simulateFootball(rng: () => number, elapsed: number, duration: number) {
    // NFL: 4 quarters, 15 min each (real-time ~180 min)
    const fraction = Math.min(elapsed / duration, 1);
    const quarter = fraction >= 1 ? 'Final' :
        fraction >= 0.75 ? '4th' :
        fraction >= 0.5 ? '3rd' :
        fraction >= 0.25 ? '2nd' : '1st';

    const quarterFraction = (fraction * 4) % 1;
    const timeRemaining = quarter === 'Final' ? '0:00' :
        `${Math.floor((1 - quarterFraction) * 15)}:${String(Math.floor(rng() * 60)).padStart(2, '0')}`;

    const simulatePoints = (seed: number) => {
        const pr = createSeededRandom(seed);
        let points = 0;
        // Generate scoring drives, probability based on elapsed time
        const maxDrives = Math.floor(fraction * 12);
        for (let i = 0; i < maxDrives; i++) {
            const r = pr();
            if (r < 0.35) continue;          // no score
            else if (r < 0.65) points += 7;  // TD + XP
            else if (r < 0.85) points += 3;  // FG
            else if (r < 0.95) points += 6;  // TD missed XP
            else points += 2;                 // safety
        }
        return points;
    };

    const homePoints = simulatePoints(Math.floor(rng() * 2147483647));
    const awayPoints = simulatePoints(Math.floor(rng() * 2147483647));

    return {
        homeScore: { points: homePoints, quarter, timeRemaining },
        awayScore: { points: awayPoints, quarter, timeRemaining },
    };
}

function simulateSoccer(rng: () => number, elapsed: number, duration: number) {
    const fraction = Math.min(elapsed / duration, 1);
    const minute = Math.floor(fraction * 90);
    const half = minute >= 90 ? 'FT' : minute >= 45 ? '2nd' : '1st';

    const simulateGoals = (seed: number) => {
        const gr = createSeededRandom(seed);
        let goals = 0;
        // Goal opportunities roughly every 10 minutes
        const chances = Math.floor(minute / 10);
        for (let i = 0; i < chances; i++) {
            if (gr() < 0.15) goals++; // ~15% conversion
        }
        return Math.min(goals, 6);
    };

    const homeGoals = simulateGoals(Math.floor(rng() * 2147483647));
    const awayGoals = simulateGoals(Math.floor(rng() * 2147483647));

    return {
        homeScore: { goals: homeGoals, half, minute: `${minute}'` },
        awayScore: { goals: awayGoals, half, minute: `${minute}'` },
    };
}

function simulateHockey(rng: () => number, elapsed: number, duration: number) {
    const fraction = Math.min(elapsed / duration, 1);
    // 3 periods of 20 min (real-time ~150 min total with intermissions)
    const periodFraction = fraction * 3;
    const period = fraction >= 1 ? 'Final' :
        periodFraction >= 2 ? '3rd' :
        periodFraction >= 1 ? '2nd' : '1st';

    const periodElapsed = (periodFraction % 1) * 20;
    const timeLeft = period === 'Final' ? '0:00' :
        `${Math.floor(20 - periodElapsed)}:${String(Math.floor(rng() * 60)).padStart(2, '0')}`;

    const simulateGoals = (seed: number) => {
        const hr = createSeededRandom(seed);
        let goals = 0;
        const minutes = Math.floor(fraction * 60);
        for (let i = 0; i < minutes; i++) {
            if (hr() < 0.05) goals++; // ~3 goals per 60 min
        }
        return Math.min(goals, 8);
    };

    const homeGoals = simulateGoals(Math.floor(rng() * 2147483647));
    const awayGoals = simulateGoals(Math.floor(rng() * 2147483647));

    return {
        homeScore: { goals: homeGoals, period, timeLeft },
        awayScore: { goals: awayGoals, period, timeLeft },
    };
}

function simulateTennis(rng: () => number, elapsed: number, duration: number) {
    const fraction = Math.min(elapsed / duration, 1);

    const simulateSets = (homeSeed: number, awaySeed: number) => {
        const tr = createSeededRandom(homeSeed + awaySeed);
        const homeSets: number[] = [];
        const awaySets: number[] = [];
        let homeWins = 0;
        let awayWins = 0;
        const maxSets = 3; // Best of 5

        // Simulate completed sets based on fraction
        const setsToSim = Math.ceil(fraction * 5);
        for (let s = 0; s < setsToSim && homeWins < maxSets && awayWins < maxSets; s++) {
            const isLastSet = s === setsToSim - 1 && fraction < 1;
            if (isLastSet) {
                // Current in-progress set
                const homeGames = seededInt(tr, 0, 5);
                const awayGames = seededInt(tr, 0, 5);
                homeSets.push(homeGames);
                awaySets.push(awayGames);
            } else {
                // Completed set
                if (tr() < 0.5) {
                    homeSets.push(6);
                    awaySets.push(seededInt(tr, 2, 4));
                    homeWins++;
                } else {
                    homeSets.push(seededInt(tr, 2, 4));
                    awaySets.push(6);
                    awayWins++;
                }
            }
        }

        return {
            homeSets,
            awaySets,
            currentSet: homeSets.length,
            homeServing: tr() < 0.5,
        };
    };

    const result = simulateSets(
        Math.floor(rng() * 2147483647),
        Math.floor(rng() * 2147483647)
    );

    return {
        homeScore: { sets: result.homeSets, currentSet: result.currentSet, serving: result.homeServing },
        awayScore: { sets: result.awaySets, currentSet: result.currentSet, serving: !result.homeServing },
    };
}

function simulateBadminton(rng: () => number, elapsed: number, duration: number) {
    const fraction = Math.min(elapsed / duration, 1);

    const br = createSeededRandom(Math.floor(rng() * 2147483647));
    const homeSets: number[] = [];
    const awaySets: number[] = [];

    const maxSets = 2; // Best of 3 (need 2 to win)
    let homeWins = 0;
    let awayWins = 0;

    const setsToSim = Math.ceil(fraction * 3);
    for (let s = 0; s < setsToSim && homeWins < maxSets && awayWins < maxSets; s++) {
        const isLastSet = s === setsToSim - 1 && fraction < 1;
        if (isLastSet) {
            // In-progress set - partial points up to 21
            const maxPoints = Math.floor(fraction * 3 * 21) % 21 || 1;
            homeSets.push(seededInt(br, Math.max(0, maxPoints - 5), maxPoints));
            awaySets.push(seededInt(br, Math.max(0, maxPoints - 5), maxPoints));
        } else {
            // Completed set
            if (br() < 0.5) {
                homeSets.push(21);
                awaySets.push(seededInt(br, 12, 19));
                homeWins++;
            } else {
                homeSets.push(seededInt(br, 12, 19));
                awaySets.push(21);
                awayWins++;
            }
        }
    }

    return {
        homeScore: { sets: homeSets, currentSet: homeSets.length },
        awayScore: { sets: awaySets, currentSet: awaySets.length },
    };
}

export function simulateMatch(row: MatchRow, now: Date = new Date()): Match {
    const startTime = new Date(row.start_time);
    const status = computeStatus(startTime, row.duration_minutes, now);
    const elapsed = getElapsedMinutes(startTime, now);

    // Create base match without scores
    const match: Match = {
        id: row.id,
        sport: row.sport,
        status,
        homeTeam: {
            id: row.home_team_id,
            name: row.home_team_name,
            initials: row.home_team_initials,
            logo: row.home_team_logo || undefined,
        },
        awayTeam: {
            id: row.away_team_id,
            name: row.away_team_name,
            initials: row.away_team_initials,
            logo: row.away_team_logo || undefined,
        },
        venue: {
            name: row.venue_name,
            city: row.venue_city,
            country: row.venue_country,
            state: row.venue_state || undefined,
        },
        startTime: row.start_time,
        tournament: row.tournament_name,
        format: row.format || undefined,
    };

    // No scores for upcoming matches
    if (status === 'upcoming') return match;

    // Simulate scores based on sport
    const rng = createSeededRandom(row.seed);
    const effectiveElapsed = status === 'completed' ? row.duration_minutes : elapsed;

    let scores;
    switch (row.sport) {
        case 'cricket':
            scores = simulateCricket(rng, effectiveElapsed, row.duration_minutes, row.format);
            match.homeTeam.score = scores.homeScore;
            match.awayTeam.score = scores.awayScore || undefined;
            break;
        case 'football':
            scores = simulateFootball(rng, effectiveElapsed, row.duration_minutes);
            match.homeTeam.score = scores.homeScore;
            match.awayTeam.score = scores.awayScore;
            break;
        case 'soccer':
            scores = simulateSoccer(rng, effectiveElapsed, row.duration_minutes);
            match.homeTeam.score = scores.homeScore;
            match.awayTeam.score = scores.awayScore;
            break;
        case 'hockey':
            scores = simulateHockey(rng, effectiveElapsed, row.duration_minutes);
            match.homeTeam.score = scores.homeScore;
            match.awayTeam.score = scores.awayScore;
            break;
        case 'tennis':
            scores = simulateTennis(rng, effectiveElapsed, row.duration_minutes);
            match.homeTeam.score = scores.homeScore;
            match.awayTeam.score = scores.awayScore;
            break;
        case 'badminton':
            scores = simulateBadminton(rng, effectiveElapsed, row.duration_minutes);
            match.homeTeam.score = scores.homeScore;
            match.awayTeam.score = scores.awayScore;
            break;
    }

    return match;
}
