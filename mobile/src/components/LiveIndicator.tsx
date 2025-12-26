import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme/theme';

interface LiveIndicatorProps {
    testID?: string;
}

export const LiveIndicator: React.FC<LiveIndicatorProps> = ({ testID = 'liveIndicator_badge' }) => {
    return (
        <View style={styles.container} testID={testID}>
            <View style={styles.dot} />
            <Text style={styles.text}>LIVE</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.live,
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.xs,
        borderRadius: theme.borderRadius.sm,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#FFFFFF',
        marginRight: theme.spacing.xs,
    },
    text: {
        fontSize: 12,
        fontWeight: '700',
        lineHeight: 16,
        color: '#FFFFFF',
    },
});
