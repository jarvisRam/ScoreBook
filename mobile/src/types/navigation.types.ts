import { NavigatorScreenParams } from '@react-navigation/native';
import { Sport } from './sport.types';

export type RootStackParamList = {
    Home: undefined;
    MatchDetail: { matchId: string };
};

export type SportTabParamList = {
    Cricket: undefined;
    Football: undefined;
    Hockey: undefined;
    Soccer: undefined;
    Tennis: undefined;
    Badminton: undefined;
};

export type MatchStatusTabParamList = {
    Live: undefined;
    Upcoming: undefined;
    Completed: undefined;
};
