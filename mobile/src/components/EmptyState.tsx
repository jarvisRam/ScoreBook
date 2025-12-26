import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme/theme';

interface EmptyStateProps {
  message?: string;
  icon?: string;
  testID?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  message = 'No matches available', 
  icon = '🏆',
  testID = 'emptyState' 
}) => {
  return (
    <View style={styles.container} testID={testID}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.message} testID={`${testID}_message`}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  icon: {
    fontSize: 64,
    marginBottom: theme.spacing.md,
  },
  message: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});
