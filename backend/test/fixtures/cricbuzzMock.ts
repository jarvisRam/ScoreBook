// Hand-typed stand-in for a Cricbuzz `/matches/v1/recent` response, used both
// to mock the upstream call in integration tests and to validate against the
// real-world schema in test/third-party — so this fixture can't quietly drift
// from what Cricbuzz actually sends without a test catching it.
export const cricketMockData = {
    typeMatches: [{
        seriesMatches: [{
            seriesAdWrapper: {
                matches: [{
                    matchInfo: {
                        matchId: 12345,
                        seriesName: 'Test Series',
                        matchDesc: 'T20',
                        matchFormat: 'T20',
                        startDate: Date.now().toString(),
                        state: 'In Progress',
                        team1: { teamId: 1, teamName: 'India', teamSName: 'IND' },
                        team2: { teamId: 2, teamName: 'Australia', teamSName: 'AUS' },
                        venueInfo: { ground: 'MCG', city: 'Melbourne' },
                        currBatTeamId: 1
                    },
                    matchScore: {
                        team1Score: { inngs1: { runs: 150, wickets: 2, overs: 15.2 } },
                        // Real Cricbuzz responses omit this key entirely rather than
                        // setting it to null when a team hasn't batted yet.
                    }
                }]
            }
        }]
    }]
};
