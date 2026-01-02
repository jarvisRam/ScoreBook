import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation.types';
import { SportTabNavigator } from './SportTabNavigator';
import { theme } from '../theme/theme';
import { DeveloperSettingsScreen } from '../screens/DeveloperSettingsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

// Create a custom navigation theme with proper font configuration
const navigationTheme = {
    ...DefaultTheme,
    dark: true,
    colors: {
        ...DefaultTheme.colors,
        primary: theme.colors.primary,
        background: theme.colors.background,
        card: theme.colors.surface,
        text: theme.colors.text,
        border: theme.colors.border,
        notification: theme.colors.primary,
    },
    fonts: {
        regular: {
            fontFamily: 'System',
            fontWeight: '400' as const,
        },
        medium: {
            fontFamily: 'System',
            fontWeight: '500' as const,
        },
        bold: {
            fontFamily: 'System',
            fontWeight: '700' as const,
        },
        heavy: {
            fontFamily: 'System',
            fontWeight: '900' as const,
        },
    },
};

export const RootNavigator: React.FC = () => {
    return (
        <NavigationContainer theme={navigationTheme}>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: theme.colors.background },
                }}
            >
                <Stack.Screen
                    name="Home"
                    component={SportTabNavigator}
                    options={{ title: 'ScoreBook' }}
                />

                {__DEV__ && (
                    <Stack.Screen
                        name="DeveloperSettings"
                        component={DeveloperSettingsScreen}
                        options={{
                            headerShown: true,
                            title: 'Dev Settings',
                            headerStyle: { backgroundColor: theme.colors.surface },
                            headerTintColor: theme.colors.text,
                        }}
                    />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};
