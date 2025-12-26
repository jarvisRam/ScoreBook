import React from 'react';
import { View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { theme } from '../theme/theme';
import { Sport, MatchStatus } from '../types/sport.types';
import { useMatches } from '../store/useMatches';
import { MatchCard } from '../components/MatchCard';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { EmptyState } from '../components/EmptyState';

const Tab = createMaterialTopTabNavigator();

interface MatchListProps {
    sport: Sport;
    status: MatchStatus;
}

const MatchList: React.FC<MatchListProps> = ({ sport, status }) => {
    const { data, isLoading, error, refetch, isRefetching } = useMatches(sport, status);

    if (isLoading && !data) {
        return <LoadingState testID={`matchList_${sport}_${status}_loading`} />;
    }

    if (error) {
        return (
            <ErrorState
                message="Failed to load matches. Please try again."
                onRetry={() => refetch()}
                testID={`matchList_${sport}_${status}_error`}
            />
        );
    }

    const matches = data?.data || [];

    if (matches.length === 0) {
        const emptyMessages = {
            live: 'No live matches at the moment',
            upcoming: 'No upcoming matches scheduled',
            completed: 'No recently completed matches',
        };

        return (
            <EmptyState
                message={emptyMessages[status]}
                icon={status === 'live' ? '🏃' : status === 'upcoming' ? '📅' : '✅'}
                testID={`matchList_${sport}_${status}_empty`}
            />
        );
    }

    return (
        <FlatList
            data={matches}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
                <MatchCard
                    match={item}
                    testID={`matchCard_${sport}_${status}_${index}`}
                />
            )}
            contentContainerStyle={styles.listContent}
            refreshControl={
                <RefreshControl
                    refreshing={isRefetching}
                    onRefresh={refetch}
                    tintColor={theme.colors.primary}
                    testID={`refreshControl_${sport}_${status}`}
                />
            }
            testID={`matchList_${sport}_${status}`}
        />
    );
};

interface SportScreenProps {
    sport: Sport;
}

export const SportScreen: React.FC<SportScreenProps> = ({ sport }) => {
    return (
        <View style={styles.container} testID={`sportScreen_${sport}`}>
            <Tab.Navigator
                screenOptions={{
                    tabBarStyle: styles.tabBar,
                    tabBarActiveTintColor: theme.colors.text,
                    tabBarInactiveTintColor: theme.colors.textSecondary,
                    tabBarIndicatorStyle: styles.tabIndicator,
                    tabBarLabelStyle: styles.tabLabel,
                    tabBarPressColor: theme.colors.surface,
                }}
            >
                <Tab.Screen
                    name="Live"
                    children={() => <MatchList sport={sport} status="live" />}
                    options={{ tabBarTestID: `statusTab_${sport}_live` }}
                />
                <Tab.Screen
                    name="Upcoming"
                    children={() => <MatchList sport={sport} status="upcoming" />}
                    options={{ tabBarTestID: `statusTab_${sport}_upcoming` }}
                />
                <Tab.Screen
                    name="Completed"
                    children={() => <MatchList sport={sport} status="completed" />}
                    options={{ tabBarTestID: `statusTab_${sport}_completed` }}
                />
            </Tab.Navigator>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    listContent: {
        padding: theme.spacing.md,
    },
    tabBar: {
        backgroundColor: theme.colors.surface,
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    tabIndicator: {
        backgroundColor: theme.colors.primary,
        height: 3,
    },
    tabLabel: {
        fontSize: 14,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
});
