import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../theme/theme';

const StyledText = ({ children, style, variant = 'body' }) => {
    return (
        <Text style={[styles.base, styles[variant], style]}>
            {children}
        </Text>
    );
};

const styles = StyleSheet.create({
    base: {
        fontFamily: FONTS.regular,
    },
    header: {
        color: COLORS.text,
        fontSize: 28,
        fontFamily: FONTS.bold,
        letterSpacing: 0.5,
    },
    subheader: {
        color: COLORS.text,
        fontSize: 20,
        fontFamily: FONTS.medium,
    },
    body: {
        color: COLORS.text,
        fontSize: 16,
        fontFamily: FONTS.regular,
    },
    caption: {
        color: COLORS.textSecondary,
        fontSize: 12,
        fontFamily: FONTS.medium,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    value: {
        color: COLORS.text,
        fontSize: 32,
        fontFamily: FONTS.bold,
    },
    logo: {
        color: COLORS.text,
        fontSize: 20,
        fontFamily: FONTS.bold,
        letterSpacing: 4,
    }
});

export default StyledText;
