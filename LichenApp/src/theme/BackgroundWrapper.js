import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Svg, RadialGradient, Rect, Defs, Stop, G } from 'react-native-svg';
import { COLORS } from './theme';

const { width, height } = Dimensions.get('window');

const BackgroundWrapper = ({ children }) => {
    return (
        <View style={styles.container}>
            <View style={StyleSheet.absoluteFill}>
                <Svg height="100%" width="100%">
                    <Defs>
                        {/* Dark base gradient */}
                        <RadialGradient
                            id="baseGrad"
                            cx="50%"
                            cy="20%"
                            rx="100%"
                            ry="100%"
                            fx="50%"
                            fy="20%"
                            gradientUnits="userSpaceOnUse"
                        >
                            <Stop offset="0" stopColor="#000000ff" stopOpacity="1" />
                            <Stop offset="1" stopColor="#020617" stopOpacity="1" />
                        </RadialGradient>

                        {/* Accent Glow 1 - Top Left (Emerald) */}
                        <RadialGradient
                            id="glow1"
                            cx="0%"
                            cy="0%"
                            rx="65%"
                            ry="65%"
                            fx="0%"
                            fy="0%"
                            gradientUnits="userSpaceOnUse"
                        >
                            <Stop offset="0" stopColor={COLORS.primary} stopOpacity="0.2" />
                            <Stop offset="1" stopColor={COLORS.primary} stopOpacity="0" />
                        </RadialGradient>

                        {/* Accent Glow 2 - Bottom Right (Blue) */}
                        <RadialGradient
                            id="glow2"
                            cx="100%"
                            cy="100%"
                            rx="70%"
                            ry="70%"
                            fx="100%"
                            fy="100%"
                            gradientUnits="userSpaceOnUse"
                        >
                            <Stop offset="0" stopColor={COLORS.secondary} stopOpacity="0.12" />
                            <Stop offset="1" stopColor={COLORS.secondary} stopOpacity="0" />
                        </RadialGradient>

                        {/* Contrast Glow - Center (Zinc) */}
                        <RadialGradient
                            id="glow3"
                            cx="50%"
                            cy="50%"
                            rx="50%"
                            ry="50%"
                            fx="50%"
                            fy="50%"
                            gradientUnits="userSpaceOnUse"
                        >
                            <Stop offset="0" stopColor="#3F3F46" stopOpacity="0.08" />
                            <Stop offset="1" stopColor="#18181B" stopOpacity="0" />
                        </RadialGradient>
                    </Defs>

                    {/* Background Layers */}
                    <Rect x="0" y="0" width="100%" height="100%" fill="url(#baseGrad)" />
                    <Rect x="0" y="0" width="100%" height="100%" fill="url(#glow1)" />
                    <Rect x="0" y="0" width="100%" height="100%" fill="url(#glow2)" />
                    <Rect x="0" y="0" width="100%" height="100%" fill="url(#glow3)" />
                </Svg>
            </View>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#020617', // Slate 950 deep base
    },
});

export default BackgroundWrapper;
