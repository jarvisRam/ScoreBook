import { Match, MatchDetail } from './match.types';
import { SportConfig } from './sport.types';

export interface ApiResponse<T> {
    data: T;
    timestamp: number;
    mode: 'mock' | 'real';
}

export interface HealthResponse {
    status: 'ok' | 'error';
    mode: 'mock' | 'real';
    timestamp: number;
}

export interface SportsResponse {
    data: SportConfig[];
}

export interface MatchesResponse {
    data: Match[];
}

export interface MatchDetailResponse {
    data: MatchDetail;
}

export interface ApiError {
    error: {
        message: string;
        code: string;
        details?: Record<string, unknown>;
    };
}
