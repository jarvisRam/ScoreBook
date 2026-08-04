import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { theme } from '../theme/theme';

const GITHUB_URL = 'https://github.com/jarvisRam/ScoreBook';
const LINKEDIN_URL = 'https://www.linkedin.com/in/PLACEHOLDER';

const openLink = (url: string) => {
    Linking.openURL(url).catch((err) =>
        console.warn('Failed to open URL:', err)
    );
};

export const Footer: React.FC = () => {
    return (
        <View style={styles.container}>
            <View style={styles.divider} />
            <View style={styles.content}>
                <Text style={styles.builtBy}>
                    Built by <Text style={styles.name}>Sriram Venkataraman</Text>
                </Text>
                <View style={styles.links}>
                    <TouchableOpacity
                        style={styles.linkButton}
                        onPress={() => openLink(GITHUB_URL)}
                        accessibilityLabel="Open GitHub repository"
                        testID="footer_github_link"
                    >
                        <MaterialCommunityIcons
                            name="github"
                            size={20}
                            color={theme.colors.textSecondary}
                        />
                        <Text style={styles.linkText}>GitHub</Text>
                    </TouchableOpacity>

                    <View style={styles.dot} />

                    <TouchableOpacity
                        style={styles.linkButton}
                        onPress={() => openLink(LINKEDIN_URL)}
                        accessibilityLabel="Open LinkedIn profile"
                        testID="footer_linkedin_link"
                    >
                        <MaterialCommunityIcons
                            name="linkedin"
                            size={20}
                            color={theme.colors.textSecondary}
                        />
                        <Text style={styles.linkText}>LinkedIn</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.surface,
    },
    divider: {
        height: 1,
        backgroundColor: theme.colors.border,
    },
    content: {
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.lg,
        alignItems: 'center',
        gap: theme.spacing.sm,
    },
    builtBy: {
        fontSize: 12,
        fontWeight: 'normal',
        lineHeight: 16,
        color: theme.colors.textSecondary,
    },
    name: {
        color: theme.colors.primary,
        fontWeight: '600',
    },
    links: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.md,
    },
    linkButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.xs,
        paddingVertical: theme.spacing.xs,
        paddingHorizontal: theme.spacing.sm,
    },
    linkText: {
        fontSize: 13,
        fontWeight: '500',
        color: theme.colors.textSecondary,
    },
    dot: {
        width: 3,
        height: 3,
        borderRadius: 1.5,
        backgroundColor: theme.colors.border,
    },
});
