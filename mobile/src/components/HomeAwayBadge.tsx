import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme/theme';

interface HomeAwayBadgeProps {
    type: 'home' | 'away';
    testID?: string;
}

export const HomeAwayBadge: React.FC<HomeAwayBadgeProps> = ({ type, testID }) => {
    const badgeText = type === 'home' ? 'H' : 'A';
    const badgeTestID = testID || `homeAwayBadge_${type}`;

    return (
        <View style={styles.container} testID={badgeTestID}>
            <Text style={styles.text}>{badgeText}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.border,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 10,
        fontWeight: '700',
        color: theme.colors.textSecondary,
    },
});
