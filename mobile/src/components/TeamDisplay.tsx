import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme/theme';
import { Team } from '../types/match.types';
import { HomeAwayBadge } from './HomeAwayBadge';

interface TeamDisplayProps {
    team: Team;
    type: 'home' | 'away';
    showHomeAway: boolean;
    testID?: string;
}

export const TeamDisplay: React.FC<TeamDisplayProps> = ({
    team,
    type,
    showHomeAway,
    testID
}) => {
    const containerTestID = testID || `teamDisplay_${type}`;

    return (
        <View style={styles.container} testID={containerTestID}>
            {showHomeAway && <HomeAwayBadge type={type} testID={`${containerTestID}_badge`} />}
            <View style={styles.logoContainer}>
                <Text style={styles.logoPlaceholder}>
                    {team.initials || team.name.substring(0, 2).toUpperCase()}
                </Text>
            </View>
            <Text
                style={styles.teamName}
                numberOfLines={1}
                testID={`${containerTestID}_name`}
            >
                {team.name}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.sm,
        flex: 1,
        marginRight: theme.spacing.sm,
    },
    logoContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: theme.colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    logoPlaceholder: {
        fontSize: 14,
        fontWeight: '700',
        color: theme.colors.textSecondary,
    },
    teamName: {
        fontSize: 16,
        fontWeight: '600',
        lineHeight: 24,
        color: theme.colors.text,
        flex: 1,
    },
});
