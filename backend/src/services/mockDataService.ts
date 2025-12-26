import { readFileSync } from 'fs';
import { join } from 'path';

export class MockDataService {
    private mockDataPath = join(__dirname, '../mock-data');

    private loadMockData(sport: string, status: string): any[] {
        try {
            const filePath = join(this.mockDataPath, sport, `${status}.json`);
            const data = readFileSync(filePath, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error(`Error loading mock data for ${sport}/${status}:`, error);
            return [];
        }
    }

    getMatchesBySport(sport: string, status?: string): any[] {
        if (status) {
            return this.loadMockData(sport, status);
        }

        // If no status specified, return all matches for the sport
        const live = this.loadMockData(sport, 'live');
        const upcoming = this.loadMockData(sport, 'upcoming');
        const completed = this.loadMockData(sport, 'completed');

        return [...live, ...upcoming, ...completed];
    }

    getLiveMatches(): any[] {
        const sports = ['cricket', 'football', 'hockey', 'soccer', 'tennis', 'badminton'];
        const liveMatches: any[] = [];

        sports.forEach(sport => {
            const matches = this.loadMockData(sport, 'live');
            liveMatches.push(...matches);
        });

        return liveMatches;
    }

    getMatchById(matchId: string): any | null {
        const sports = ['cricket', 'football', 'hockey', 'soccer', 'tennis', 'badminton'];
        const statuses = ['live', 'upcoming', 'completed'];

        for (const sport of sports) {
            for (const status of statuses) {
                const matches = this.loadMockData(sport, status);
                const match = matches.find((m: any) => m.id === matchId);
                if (match) {
                    return match;
                }
            }
        }

        return null;
    }

    getSports() {
        return [
            { id: 'cricket', name: 'Cricket', icon: '🏏', hasHomeAway: true },
            { id: 'football', name: 'American Football', icon: '🏈', hasHomeAway: true },
            { id: 'hockey', name: 'Hockey', icon: '🏒', hasHomeAway: true },
            { id: 'soccer', name: 'Soccer', icon: '⚽', hasHomeAway: true },
            { id: 'tennis', name: 'Tennis', icon: '🎾', hasHomeAway: false },
            { id: 'badminton', name: 'Badminton', icon: '🏸', hasHomeAway: false },
        ];
    }
}

export const mockDataService = new MockDataService();
