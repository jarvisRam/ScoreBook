import { create } from 'zustand';
import { Sport, MatchStatus } from '../types/sport.types';

interface AppState {
    selectedSport: Sport;
    selectedStatus: MatchStatus;
    setSelectedSport: (sport: Sport) => void;
    setSelectedStatus: (status: MatchStatus) => void;
}

export const useAppStore = create<AppState>((set) => ({
    selectedSport: 'cricket',
    selectedStatus: 'live',
    setSelectedSport: (sport) => set({ selectedSport: sport }),
    setSelectedStatus: (status) => set({ selectedStatus: status }),
}));
