import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../theme/theme';
import { Match } from '../types/match.types';
import { getSportConfig } from '../constants/sports';
import { TeamDisplay } from './TeamDisplay';
import { ScoreDisplay } from './ScoreDisplay';
import { LiveIndicator } from './LiveIndicator';
import { VenueInfo } from './VenueInfo';

interface MatchCardProps {
    match: Match;
    onPress?: () => void;
    testID?: string;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, onPress, testID }) => {
    const sportConfig = getSportConfig(match.sport);
    const containerTestID = testID || `matchCard_${match.id}`;

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    return (
        <TouchableOpacity
            style={[
                styles.container,
                match.status === 'live' && styles.liveContainer
            ]}
            onPress={onPress}
            activeOpacity={0.7}
            testID={containerTestID}
        >
            {/* Header with tournament and live indicator */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Text style={styles.sportIcon}>{sportConfig?.icon}</Text>
                    <Text style={styles.tournament} numberOfLines={1} testID={`${containerTestID}_tournament`}>
                        {match.tournament || sportConfig?.name}
                    </Text>
                </View>
                {match.status === 'live' && <LiveIndicator testID={`${containerTestID}_liveIndicator`} />}
            </View>

            {/* Teams and Scores */}
            <View style={styles.matchContent}>
                {/* Home Team */}
                <View style={styles.teamRow}>
                    <TeamDisplay
                        team={match.homeTeam}
                        type="home"
                        showHomeAway={sportConfig?.hasHomeAway ?? false}
                        testID={`${containerTestID}_homeTeam`}
                    />
                    <ScoreDisplay
                        score={match.homeTeam.score}
                        sport={match.sport}
                        testID={`${containerTestID}_homeScore`}
                    />
                </View>

                {/* Away Team */}
                <View style={styles.teamRow}>
                    <TeamDisplay
                        team={match.awayTeam}
                        type="away"
                        showHomeAway={sportConfig?.hasHomeAway ?? false}
                        testID={`${containerTestID}_awayTeam`}
                    />
                    <ScoreDisplay
                        score={match.awayTeam.score}
                        sport={match.sport}
                        testID={`${containerTestID}_awayScore`}
                    />
                </View>
            </View>

            {/* Venue Info */}
            <VenueInfo venue={match.venue} testID={`${containerTestID}_venue`} />

            {/* Match Time or Format */}
            {match.status === 'upcoming' && (
                <Text style={styles.timeText} testID={`${containerTestID}_time`}>
                    {formatTime(match.startTime)}
                </Text>
            )}
            {match.format && (
                <Text style={styles.formatText} testID={`${containerTestID}_format`}>
                    {match.format}
                </Text>
            )}
            {match.round && (
                <Text style={styles.formatText} testID={`${containerTestID}_round`}>
                    {match.round}
                </Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.card,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    liveContainer: {
        borderColor: theme.colors.live,
        borderWidth: 1.5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.sm,
        flex: 1,
    },
    sportIcon: {
        fontSize: 20,
    },
    tournament: {
        fontSize: 14, fontWeight: 'normal' as any, lineHeight: 20,
        color: theme.colors.textSecondary,
        flex: 1,
    },
    matchContent: {
        gap: theme.spacing.md,
    },
    teamRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: theme.spacing.sm,
    },
    timeText: {
        fontSize: 14, fontWeight: 'normal' as any, lineHeight: 20,
        color: theme.colors.textSecondary,
        marginTop: theme.spacing.xs,
    },
    formatText: {
        fontSize: 12, fontWeight: 'normal' as any, lineHeight: 16,
        color: theme.colors.textSecondary,
        marginTop: 2,
    },
});
