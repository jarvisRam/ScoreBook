import { z } from 'zod';

/**
 * Our own description of what the Cricbuzz "recent matches" endpoint
 * (`GET /matches/v1/recent`) actually returns, grounded in a captured real
 * response (see test/third-party/fixtures/cricbuzz-recent.real.json) rather
 * than guessed from the integration code.
 *
 * Cricbuzz doesn't publish a contract we can verify against directly, so this
 * schema stands in for one: it's the "provider contract" half of a
 * bi-directional contract check. See docs: testing/third-party-contracts.
 *
 * Only models the fields realDataService.ts actually reads. Objects are
 * non-strict by default (unknown keys are ignored), so Cricbuzz adding new
 * fields won't fail this — only removing or reshaping a field we depend on
 * will. Optionality below reflects what was actually observed varying across
 * a real sample of 99 matches (e.g. currBatTeamId and team2Score aren't
 * always present), not just the code's defensive fallbacks.
 */

const CricketTeamSchema = z.object({
    teamId: z.number(),
    teamName: z.string(),
    teamSName: z.string(),
});

const InningsSchema = z.object({
    runs: z.number(),
    // Absent on some real innings (e.g. a declared innings) rather than 0 —
    // found via a live drift check, not the original captured sample.
    wickets: z.number().optional(),
    // Observed as a float in every real sample. The integration code
    // defensively calls `.toString()` on this either way, but a provider
    // sending a string here would still be a real shape change worth flagging.
    overs: z.number(),
});

const TeamScoreSchema = z.object({
    inngs1: InningsSchema.optional(),
    inngs2: InningsSchema.optional(),
});

const MatchInfoSchema = z.object({
    matchId: z.number(),
    seriesName: z.string(),
    matchDesc: z.string().optional(),
    matchFormat: z.string().optional(),
    startDate: z.string(),
    state: z.string(),
    team1: CricketTeamSchema,
    team2: CricketTeamSchema,
    venueInfo: z
        .object({
            ground: z.string().optional(),
            city: z.string().optional(),
        })
        .optional(),
    // Only present while a team is actively batting — absent on ~11% of
    // real completed matches.
    currBatTeamId: z.number().optional(),
});

const MatchDataSchema = z.object({
    matchInfo: MatchInfoSchema,
    // Entirely absent, not just empty, on some real matches.
    matchScore: z
        .object({
            team1Score: TeamScoreSchema.optional(),
            team2Score: TeamScoreSchema.optional(),
        })
        .optional(),
});

const SeriesMatchesSchema = z.object({
    // Real responses mix in ad-slot entries with no `seriesAdWrapper` at all
    // (the integration code's `seriesMatch.seriesAdWrapper || {}` fallback
    // exists because of exactly this).
    seriesAdWrapper: z
        .object({
            matches: z.array(MatchDataSchema).optional(),
        })
        .optional(),
});

export const CricbuzzRecentMatchesSchema = z.object({
    typeMatches: z.array(
        z.object({
            seriesMatches: z.array(SeriesMatchesSchema),
        }),
    ),
});

export type CricbuzzRecentMatches = z.infer<typeof CricbuzzRecentMatchesSchema>;
