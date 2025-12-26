import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { theme } from '../theme/theme';

interface LoadingStateProps {
  message?: string;
  testID?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = 'Loading matches...', 
  testID = 'loadingState' 
}) => {
  return (
    <View style={styles.container} testID={testID}>
      <ActivityIndicator size="large" color={theme.colors.primary} testID={`${testID}_spinner`} />
      <Text style={styles.text} testID={`${testID}_text`}>{message}</Text>
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
  text: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
  },
});
