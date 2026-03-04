import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import DashboardScreen from '../screens/DashboardScreen';
import AnalyticsScreen from '../screens/AnalyticsScreen';
import NodeDetailsScreen from '../screens/NodeDetailsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { Home, BarChart2, Share2, User } from 'lucide-react-native';
import { COLORS, FONTS } from '../theme/theme';
import { View, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
    const insets = useSafeAreaInsets();

    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    headerShown: false,
                    tabBarStyle: [
                        styles.tabBar,
                        { bottom: Platform.OS === 'ios' ? insets.bottom + 10 : 20 }
                    ],
                    tabBarActiveTintColor: COLORS.text, // Text color should be white on active
                    tabBarInactiveTintColor: COLORS.textSecondary,
                    tabBarShowLabel: true,
                    tabBarLabelStyle: styles.tabBarLabel,
                    tabBarActiveBackgroundColor: 'transparent', // Fully transparent active background
                    tabBarItemStyle: styles.tabBarItem,
                    tabBarIcon: ({ color, size, focused }) => {
                        // Icon should be primary color or white when focused
                        const iconColor = focused ? COLORS.primary : COLORS.textSecondary;
                        if (route.name === 'HOME') return <Home color={iconColor} size={size} />;
                        if (route.name === 'ANALYSIS') return <BarChart2 color={iconColor} size={size} />;
                        if (route.name === 'NODE') return <Share2 color={iconColor} size={size} />;
                        if (route.name === 'PROFILE') return <User color={iconColor} size={size} />;
                    },
                })}
            >
                <Tab.Screen name="HOME" component={DashboardScreen} />
                <Tab.Screen name="ANALYSIS" component={AnalyticsScreen} />
                <Tab.Screen name="NODE" component={NodeDetailsScreen} />
                <Tab.Screen name="PROFILE" component={ProfileScreen} />
            </Tab.Navigator>
        </NavigationContainer>
    );
};

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: 'rgba(20, 20, 20, 0.85)', // Dark translucent bar
        borderTopWidth: 0,
        height: 70,
        borderRadius: 35,
        position: 'absolute',
        left: 20,
        right: 20,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        paddingBottom: 0,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    tabBarLabel: {
        fontSize: 10,
        fontFamily: FONTS.bold,
        marginBottom: 8,
    },
    tabBarItem: {
        borderRadius: 30,
        margin: 5,
        backgroundColor: 'transparent', // Ensure item background is transparent
    }
});

export default AppNavigator;
