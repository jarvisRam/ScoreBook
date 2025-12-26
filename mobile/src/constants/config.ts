import { Platform } from 'react-native';

// API Configuration
// Android emulator needs 10.0.2.2 to access host machine
// iOS simulator and web can use localhost
const getApiBaseUrl = () => {
    if (__DEV__) {
        if (Platform.OS === 'android') {
            return 'http://10.0.2.2:3000/api';
        }
        return 'http://localhost:3000/api';
    }
    return 'https://scorebook-api.your-domain.com/api';
};

export const API_BASE_URL = getApiBaseUrl();


// Polling Configuration
export const LIVE_MATCH_POLL_INTERVAL = 30000; // 30 seconds
export const UPCOMING_MATCH_POLL_INTERVAL = 300000; // 5 minutes
export const COMPLETED_MATCH_POLL_INTERVAL = 0; // No polling for completed

// React Query Configuration
export const STALE_TIME = 30000; // 30 seconds
export const CACHE_TIME = 5 * 60 * 1000; // 5 minutes

// App Configuration
export const APP_NAME = 'ScoreBook';
export const APP_VERSION = '1.0.0';
