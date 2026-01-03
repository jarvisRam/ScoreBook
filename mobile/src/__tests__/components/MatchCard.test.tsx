import React from 'react';
import { render } from '@testing-library/react-native';
import { MatchCard } from '../../components/MatchCard';
import { Match } from '../../types/match.types';

const mockMatch: Match = {
    id: '1',
    sport: 'cricket',
    tournament: 'IPL',
    homeTeam: {
        name: 'CSK',
        initials: 'CSK',
        score: { runs: 180, wickets: 4, overs: '20.0' }
    },
    awayTeam: {
        name: 'MI',
        initials: 'MI',
        score: { runs: 170, wickets: 6, overs: '20.0' }
    },
    status: 'completed',
    startTime: '2024-03-20T14:30:00Z',
    venue: {
        name: 'Wankhede',
        city: 'Mumbai',
        country: 'India'
    }
};

describe('MatchCard', () => {
    it('renders match details correctly', () => {
        const { getByText, getAllByText, getByTestId } = render(<MatchCard match={mockMatch} />);

        // Check if tournament name is displayed
        expect(getByText('IPL')).toBeTruthy();

        // Check if team initials are displayed (assuming TeamDisplay shows initials or names)
        // Using getAllByText since initials might appear multiple times (e.g. in accessibility labels)
        expect(getAllByText('CSK')[0]).toBeTruthy();
        expect(getAllByText('MI')[0]).toBeTruthy();

        // Check venue
        expect(getByText('Wankhede')).toBeTruthy();
    });
});
