import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme/theme';
import { Venue } from '../types/match.types';

interface VenueInfoProps {
    venue: Venue;
    testID?: string;
}

export const VenueInfo: React.FC<VenueInfoProps> = ({ venue, testID = 'venueInfo_container' }) => {
    const location = venue.state
        ? `${venue.city}, ${venue.state}`
        : `${venue.city}, ${venue.country}`;

    return (
        <View style={styles.container} testID={testID}>
            <Text style={styles.venueName} numberOfLines={1} testID="venueInfo_name">
                {venue.name}
            </Text>
            <Text style={styles.location} numberOfLines={1} testID="venueInfo_location">
                {location}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: theme.spacing.xs,
    },
    venueName: {
        fontSize: 14,
        fontWeight: '400',
        lineHeight: 20,
        color: theme.colors.textSecondary,
    },
    location: {
        fontSize: 12,
        fontWeight: '400',
        lineHeight: 16,
        color: theme.colors.textSecondary,
        opacity: 0.7,
    },
});
