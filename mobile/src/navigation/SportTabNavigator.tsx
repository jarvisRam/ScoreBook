import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { theme } from '../theme/theme';
import { SportScreen } from '../screens/SportScreen';
import { SPORTS } from '../constants/sports';
import { RootStackParamList } from '../types/navigation.types';

const Tab = createMaterialTopTabNavigator();

export const SportTabNavigator: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.logo} testID="app_logo">ScoreBook</Text>
                {__DEV__ && (
                    <TouchableOpacity
                        onPress={() => navigation.navigate('DeveloperSettings')}
                        style={styles.devButton}
                    >
                        <Text style={{ fontSize: 20 }}>⚙️</Text>
                    </TouchableOpacity>
                )}
            </View>
            <Tab.Navigator
                screenOptions={{
                    tabBarScrollEnabled: true,
                    tabBarStyle: styles.tabBar,
                    tabBarActiveTintColor: theme.colors.text,
                    tabBarInactiveTintColor: theme.colors.textSecondary,
                    tabBarIndicatorStyle: styles.tabIndicator,
                    tabBarLabelStyle: styles.tabLabel,
                    tabBarItemStyle: styles.tabItem,
                    tabBarPressColor: theme.colors.surface,
                }}
            >
                {SPORTS.map((sport) => (
                    <Tab.Screen
                        key={sport.id}
                        name={sport.name}
                        options={{
                            tabBarLabel: ({ focused }) => (
                                <View style={styles.tabContent}>
                                    <Text style={styles.sportIcon}>{sport.icon}</Text>
                                    <Text
                                        style={[
                                            styles.sportName,
                                            { color: focused ? theme.colors.text : theme.colors.textSecondary },
                                        ]}
                                    >
                                        {sport.name}
                                    </Text>
                                </View>
                            ),
                        }}
                    >
                        {() => <SportScreen sport={sport.id} />}
                    </Tab.Screen>
                ))}
            </Tab.Navigator>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        backgroundColor: theme.colors.surface,
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    devButton: {
        padding: 4,
    },
    logo: {
        fontSize: 24,
        fontWeight: '700',
        lineHeight: 32,
        color: theme.colors.text,
    },
    tabBar: {
        backgroundColor: theme.colors.surface,
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    tabIndicator: {
        backgroundColor: theme.colors.primary,
        height: 3,
    },
    tabLabel: {
        fontSize: 14,
        fontWeight: '600',
    },
    tabItem: {
        width: 'auto',
        minWidth: 100,
    },
    tabContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.xs,
    },
    sportIcon: {
        fontSize: 16,
    },
    sportName: {
        fontSize: 14,
        fontWeight: '600',
    },
});
