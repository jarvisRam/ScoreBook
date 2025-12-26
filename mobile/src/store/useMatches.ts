import { useQuery } from '@tanstack/react-query';
import { matchService } from '../services/matchService';
import { Sport, MatchStatus } from '../types/sport.types';
import { LIVE_MATCH_POLL_INTERVAL, UPCOMING_MATCH_POLL_INTERVAL } from '../constants/config';

export const useMatches = (sport: Sport, status: MatchStatus) => {
    // Determine polling interval based on status
    const refetchInterval = status === 'live'
        ? LIVE_MATCH_POLL_INTERVAL
        : status === 'upcoming'
            ? UPCOMING_MATCH_POLL_INTERVAL
            : 0; // No polling for completed matches

    return useQuery({
        queryKey: ['matches', sport, status],
        queryFn: () => matchService.getMatchesBySport(sport, status),
        refetchInterval,
        refetchOnWindowFocus: true,
        retry: 2,
    });
};

export const useLiveMatches = () => {
    return useQuery({
        queryKey: ['matches', 'live', 'all'],
        queryFn: () => matchService.getLiveMatches(),
        refetchInterval: LIVE_MATCH_POLL_INTERVAL,
        refetchOnWindowFocus: true,
        retry: 2,
    });
};

export const useMatchDetail = (matchId: string) => {
    return useQuery({
        queryKey: ['match', matchId],
        queryFn: () => matchService.getMatchDetail(matchId),
        enabled: !!matchId,
    });
};
