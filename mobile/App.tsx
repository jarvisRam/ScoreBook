import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RootNavigator } from './src/navigation/RootNavigator';
import { EnvironmentProvider } from './src/context/EnvironmentContext';

import { theme } from './src/theme/theme';

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000,
      gcTime: 5 * 60 * 1000,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      retry: 2,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <EnvironmentProvider>
        <StatusBar style="light" backgroundColor={theme.colors.background} />
        <RootNavigator />
      </EnvironmentProvider>
    </QueryClientProvider>
  );
}
