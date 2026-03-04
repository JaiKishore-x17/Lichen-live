import React from 'react';
import { View, StyleSheet, Platform, Animated } from 'react-native';
import { BlurView } from 'expo-blur';
import { Svg, Rect, Defs, Pattern, Circle } from 'react-native-svg';
import { COLORS, BORDER_RADIUS, SPACING } from '../theme/theme';

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

// Native-compatible grainy texture using a dot pattern instead of FeTurbulence
const GrainyOverlay = () => (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Svg height="100%" width="100%" opacity={0.15}>
            <Defs>
                <Pattern
                    id="grain"
                    width="2"
                    height="2"
                    patternUnits="userSpaceOnUse"
                >
                    <Circle cx="0.5" cy="0.5" r="0.4" fill="white" opacity={0.6} />
                    <Circle cx="1.5" cy="1.5" r="0.3" fill="black" opacity={0.3} />
                </Pattern>
            </Defs>
            <Rect width="100%" height="100%" fill="url(#grain)" />
        </Svg>
    </View>
);

const Card = ({ children, style, variant = 'dark', borderColor }) => {
    const isLight = variant === 'light';

    return (
        <Animated.View style={[
            styles.container,
            style,
            borderColor ? { borderColor } : null
        ]}>
            {/* Premium Glass Effect Wrapper */}
            <AnimatedBlurView
                intensity={isLight ? 50 : 35}
                tint={isLight ? 'light' : 'dark'}
                style={[
                    StyleSheet.absoluteFill,
                    styles.blurContent,
                    isLight ? styles.lightGlass : styles.darkGlass
                ]}
            />

            {/* Grainy Texture Overlay (Native Compatible) */}
            <GrainyOverlay />

            {/* Content */}
            <Animated.View style={styles.innerContent}>
                {children}
            </Animated.View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: BORDER_RADIUS.lg,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 12,
            },
            android: {
                elevation: 8,
            },
        }),
    },
    blurContent: {
        borderRadius: BORDER_RADIUS.lg,
    },
    innerContent: {
        padding: SPACING.md,
        flex: 1,
    },
    lightGlass: {
        backgroundColor: 'rgba(255, 255, 255, 0.7)', // Slightly more transparent for better contrast with blur
    },
    darkGlass: {
        backgroundColor: 'rgba(15, 23, 42, 0.45)',
    },
});

export default Card;
