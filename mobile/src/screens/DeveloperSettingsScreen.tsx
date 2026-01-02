import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useEnvironment } from '../context/EnvironmentContext';
import { theme } from '../theme/theme';
import { ENV_URLS } from '../constants/config';

export const DeveloperSettingsScreen = () => {
    const { environment, setEnvironment } = useEnvironment();

    const currentUrl = environment === 'prod'
        ? ENV_URLS.prod
        : (Platform.OS === 'android' ? ENV_URLS.local.android : ENV_URLS.local.ios);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Developer Settings</Text>
                <Text style={styles.subtitle}>Debug Build Configuration</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>API Environment</Text>

                <View style={styles.card}>
                    <TouchableOpacity
                        style={[styles.radioRow, environment === 'local' && styles.selectedRow]}
                        onPress={() => setEnvironment('local')}
                        activeOpacity={0.7}
                    >
                        <View style={[styles.radioOuter, environment === 'local' && styles.radioOuterSelected]}>
                            {environment === 'local' && <View style={styles.radioInner} />}
                        </View>
                        <View style={styles.radioContent}>
                            <Text style={styles.radioLabel}>Local Development</Text>
                            <Text style={styles.radioSub}>Connects to localhost:3000</Text>
                        </View>
                    </TouchableOpacity>

                    <View style={styles.divider} />

                    <TouchableOpacity
                        style={[styles.radioRow, environment === 'prod' && styles.selectedRow]}
                        onPress={() => setEnvironment('prod')}
                        activeOpacity={0.7}
                    >
                        <View style={[styles.radioOuter, environment === 'prod' && styles.radioOuterSelected]}>
                            {environment === 'prod' && <View style={styles.radioInner} />}
                        </View>
                        <View style={styles.radioContent}>
                            <Text style={styles.radioLabel}>Production</Text>
                            <Text style={styles.radioSub}>Connects to Render (Live Data)</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={styles.infoBox}>
                    <Text style={styles.infoTitle}>Current Endpoint:</Text>
                    <Text style={styles.infoText}>{currentUrl}</Text>
                </View>

                <Text style={styles.warningText}>
                    Note: Restart app if changes don't take effect immediately.
                </Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        padding: theme.spacing.lg,
        backgroundColor: theme.colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: theme.colors.textSecondary,
    },
    section: {
        padding: theme.spacing.lg,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: theme.colors.textSecondary,
        textTransform: 'uppercase',
        marginBottom: theme.spacing.md,
        letterSpacing: 1,
    },
    card: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    radioRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: theme.spacing.md,
    },
    selectedRow: {
        backgroundColor: theme.colors.primary + '10', // 10% opacity
    },
    radioOuter: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: theme.colors.textSecondary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: theme.spacing.md,
    },
    radioOuterSelected: {
        borderColor: theme.colors.primary,
    },
    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: theme.colors.primary,
    },
    radioContent: {
        flex: 1,
    },
    radioLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.text,
        marginBottom: 2,
    },
    radioSub: {
        fontSize: 12,
        color: theme.colors.textSecondary,
    },
    divider: {
        height: 1,
        backgroundColor: theme.colors.border,
    },
    infoBox: {
        marginTop: theme.spacing.lg,
        padding: theme.spacing.md,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.sm,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderStyle: 'dashed',
    },
    infoTitle: {
        fontSize: 12,
        fontWeight: '600',
        color: theme.colors.textSecondary,
        marginBottom: 4,
    },
    infoText: {
        fontSize: 14,
        color: theme.colors.primary,
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    },
    warningText: {
        marginTop: theme.spacing.md,
        fontSize: 12,
        color: theme.colors.textSecondary,
        fontStyle: 'italic',
        textAlign: 'center',
    },
});
