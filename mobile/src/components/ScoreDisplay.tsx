import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme/theme';
import { Score, Sport } from '../types/match.types';

interface ScoreDisplayProps {
    score?: Score;
    sport: Sport;
    testID?: string;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score, sport, testID = 'scoreDisplay' }) => {
    if (!score) {
        return (
            <View style={styles.container} testID={testID}>
                <Text style={styles.scoreText} testID={`${testID}_noScore`}>-</Text>
            </View>
        );
    }

    const renderScore = () => {
        switch (sport) {
            case 'cricket':
                return (
                    <View style={styles.cricketScore}>
                        <Text style={styles.scoreText} testID={`${testID}_runs`}>
                            {score.runs}/{score.wickets}
                        </Text>
                        {score.overs && (
                            <Text style={styles.detailText} testID={`${testID}_overs`}>
                                ({score.overs})
                            </Text>
                        )}
                    </View>
                );

            case 'football':
            case 'hockey':
            case 'soccer':
                return (
                    <View style={styles.standardScore}>
                        <Text style={styles.scoreText} testID={`${testID}_points`}>
                            {score.points ?? score.goals ?? 0}
                        </Text>
                        {(score.quarter || score.period || score.half) && (
                            <Text style={styles.detailText} testID={`${testID}_period`}>
                                {score.quarter || score.period || score.half}
                            </Text>
                        )}
                    </View>
                );

            case 'tennis':
            case 'badminton':
                return (
                    <View style={styles.setsScore}>
                        {score.sets && score.sets.length > 0 ? (
                            <View style={styles.setsContainer}>
                                {score.sets.map((setScore, index) => (
                                    <Text key={index} style={styles.setScore} testID={`${testID}_set${index}`}>
                                        {setScore}
                                    </Text>
                                ))}
                            </View>
                        ) : (
                            <Text style={styles.scoreText}>0</Text>
                        )}
                        {score.serving && <Text style={styles.servingIndicator}>●</Text>}
                    </View>
                );

            default:
                return <Text style={styles.scoreText}>-</Text>;
        }
    };

    return (
        <View style={styles.container} testID={testID}>
            {renderScore()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'flex-end',
        minWidth: 90,
        flex: 0,
    },
    cricketScore: {
        alignItems: 'flex-end',
    },
    standardScore: {
        alignItems: 'flex-end',
    },
    setsScore: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.xs,
    },
    setsContainer: {
        flexDirection: 'row',
        gap: 4,
    },
    scoreText: {
        fontSize: 24,
        fontWeight: 'bold' as any,
        lineHeight: 32,
        color: theme.colors.text,
    },
    detailText: {
        fontSize: 14,
        fontWeight: 'normal' as any,
        lineHeight: 20,
        color: theme.colors.textSecondary,
        marginTop: 2,
    },
    setScore: {
        fontSize: 16,
        fontWeight: '600' as any,
        lineHeight: 24,
        color: theme.colors.text,
        minWidth: 20,
        textAlign: 'center' as any,
    },
    servingIndicator: {
        fontSize: 8,
        color: theme.colors.success,
    },
});
