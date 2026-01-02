import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { API_BASE_URL, ENV_KEYS, ENV_URLS } from '../constants/config';

export const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
api.interceptors.request.use(
    async (config) => {
        // Dynamic URL switching for Debug builds
        if (__DEV__) {
            try {
                const env = await AsyncStorage.getItem(ENV_KEYS.ENVIRONMENT);
                if (env === 'prod') {
                    config.baseURL = ENV_URLS.prod;
                } else {
                    // Default to local if not set or set to 'local'
                    config.baseURL = Platform.OS === 'android'
                        ? ENV_URLS.local.android
                        : ENV_URLS.local.ios;
                }
            } catch (error) {
                // Fallback to default
            }
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle errors globally
        console.error('API Error:', error);
        return Promise.reject(error);
    }
);
