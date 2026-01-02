import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LaunchArguments } from 'react-native-launch-arguments';
import { ENV_KEYS } from '../constants/config';

type Environment = 'local' | 'prod';

interface EnvironmentContextType {
    environment: Environment;
    setEnvironment: (env: Environment) => Promise<void>;
    isLoading: boolean;
}

const EnvironmentContext = createContext<EnvironmentContextType | undefined>(undefined);

export const EnvironmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [environment, setEnvState] = useState<Environment>('local');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadEnvironment();
    }, []);

    const loadEnvironment = async () => {
        try {
            // 1. Check Launch Arguments (Highest Priority)
            const args = LaunchArguments.value<{ targetEnvironment?: string }>();
            const targetEnv = args.targetEnvironment;

            if (targetEnv === 'local' || targetEnv === 'prod') {
                console.log(`[EnvContext] Found launch arg: targetEnvironment=${targetEnv}`);
                setEnvState(targetEnv as Environment);
                // Persist the override so it survives reloading without args
                await AsyncStorage.setItem(ENV_KEYS.ENVIRONMENT, targetEnv);
                setIsLoading(false);
                return;
            }

            // 2. Force PROD if not in dev mode (safety net, usually ignored by launch args in debug builds)
            if (!__DEV__) {
                setEnvState('prod');
                setIsLoading(false);
                return;
            }

            // 3. Fallback to Storage
            const stored = await AsyncStorage.getItem(ENV_KEYS.ENVIRONMENT);
            if (stored === 'prod' || stored === 'local') {
                setEnvState(stored);
            }
        } catch (e) {
            console.error('Failed to load environment settings', e);
        } finally {
            setIsLoading(false);
        }
    };

    const setEnvironment = async (env: Environment) => {
        setEnvState(env);
        try {
            await AsyncStorage.setItem(ENV_KEYS.ENVIRONMENT, env);
            // We might want to trigger a reload or toast here?
        } catch (e) {
            console.error('Failed to save environment settings', e);
        }
    };

    return (
        <EnvironmentContext.Provider value={{ environment, setEnvironment, isLoading }}>
            {children}
        </EnvironmentContext.Provider>
    );
};

export const useEnvironment = () => {
    const context = useContext(EnvironmentContext);
    if (!context) throw new Error("useEnvironment must be used within EnvironmentProvider");
    return context;
};
