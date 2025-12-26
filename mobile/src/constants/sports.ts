import { SportConfig } from '../types/sport.types';

export const SPORTS: SportConfig[] = [
    {
        id: 'cricket',
        name: 'Cricket',
        icon: '🏏',
        hasHomeAway: true,
        color: '#4CAF50',
    },
    {
        id: 'football',
        name: 'American Football',
        icon: '🏈',
        hasHomeAway: true,
        color: '#FF9800',
    },
    {
        id: 'hockey',
        name: 'Hockey',
        icon: '🏒',
        hasHomeAway: true,
        color: '#2196F3',
    },
    {
        id: 'soccer',
        name: 'Soccer',
        icon: '⚽',
        hasHomeAway: true,
        color: '#9C27B0',
    },
    {
        id: 'tennis',
        name: 'Tennis',
        icon: '🎾',
        hasHomeAway: false,
        color: '#FFEB3B',
    },
    {
        id: 'badminton',
        name: 'Badminton',
        icon: '🏸',
        hasHomeAway: false,
        color: '#F44336',
    },
];

export const getSportConfig = (sportId: string) => {
    return SPORTS.find((sport) => sport.id === sportId);
};
