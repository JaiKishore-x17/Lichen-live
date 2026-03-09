import React, { useEffect, useRef } from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator, Animated } from 'react-native';
import { COLORS, SPACING } from '../theme/theme';
import { calculateAQI, getAqiCategory } from '../utils/aqiCalculator';
import Card from '../components/Card';
import StyledText from '../components/StyledText';
import { Wind, MapPin, Zap, Thermometer, Droplets, Activity, TrendingUp, Cloud, RefreshCcw, Layers, Leaf } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BackgroundWrapper from '../theme/BackgroundWrapper';
import { useRealtimeData } from '../hooks/useRealtimeData';

const DashboardScreen = () => {
    const insets = useSafeAreaInsets();
    const { data: latest, loading, lastUpdated, isOffline } = useRealtimeData('LatestReadings');
    const syncPulse = useRef(new Animated.Value(0)).current;

    const statusColor = isOffline ? COLORS.error || '#EF4444' : (loading ? COLORS.textSecondary : COLORS.primary);
    const statusText = isOffline ? 'OFFLINE' : (loading ? 'SYNCING...' : 'LIVE FEED');

    // Previous data reference to detect changes
    const prevDataRef = useRef(null);

    // Border color animation value
    const borderColorAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (!loading && latest) {
            // Check if data actually changed
            const dataChanged = JSON.stringify(latest) !== JSON.stringify(prevDataRef.current);

            if (dataChanged) {
                // Pulse the sync indicator
                Animated.sequence([
                    Animated.timing(syncPulse, { toValue: 1, duration: 200, useNativeDriver: true }),
                    Animated.timing(syncPulse, { toValue: 0, duration: 400, useNativeDriver: true })
                ]).start();

                // Flash the card borders green
                Animated.sequence([
                    Animated.timing(borderColorAnim, { toValue: 1, duration: 300, useNativeDriver: false }),
                    Animated.timing(borderColorAnim, { toValue: 0, duration: 1000, useNativeDriver: false })
                ]).start();

                prevDataRef.current = latest;
            }
        }
    }, [latest, loading]);

    const borderInterpolation = borderColorAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['rgba(255, 255, 255, 0.1)', COLORS.primary]
    });

    const getVal = (sensor, key, fallback = '--') => {
        if (!latest || !latest[sensor]) return fallback;
        const val = latest[sensor][key];
        return val !== undefined ? (typeof val === 'number' ? val.toFixed(1) : val) : fallback;
    };

    const co2 = parseFloat(getVal('MQ135', 'PPM_CO2', '0'));

    const { aqi, dominant, subIndexes } = calculateAQI(latest?.Dust, latest?.MQ135);
    const aqiCategory = getAqiCategory(aqi);
    const aqiDisplay = aqi !== null ? String(aqi) : '--';
    // Vertical bar fill: 0–500 → 0–100%
    const aqiBarFill = aqi !== null ? Math.min((aqi / 500) * 100, 100) : 0;

    return (
        <BackgroundWrapper>
            <View style={[styles.container, { paddingTop: insets.top }]}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    {/* ── Header ── */}
                    <View style={styles.header}>
                        {/* Left: icon + wordmark + slogan */}
                        <View style={styles.logoGroup}>
                            <View style={styles.leafBadge}>
                                <Leaf color={COLORS.primary} size={18} strokeWidth={2.5} />
                            </View>
                            <View>
                                <StyledText variant="logo">LICHEN</StyledText>
                                <StyledText style={styles.slogan}>Built For Environmental Precision.</StyledText>
                            </View>
                        </View>

                        {/* Right: animated sync button */}
                        <Animated.View style={[styles.syncIndicator, { transform: [{ scale: syncPulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.25] }) }] }]}>
                            {loading ? (
                                <ActivityIndicator color={COLORS.primary} size="small" />
                            ) : (
                                <RefreshCcw color={statusColor} size={18} />
                            )}
                        </Animated.View>
                    </View>

                    {/* Subtle accent divider */}
                    <View style={styles.headerDivider} />

                    <View style={styles.mainRow}>
                        <Card style={styles.aqiCard} borderColor={borderInterpolation}>
                            {/* ── Top: icon + label ── */}
                            <View style={styles.aqiHeader}>
                                <Wind color={COLORS.textSecondary} size={16} />
                                <StyledText style={styles.aqiLabel}>AQI</StyledText>
                            </View>

                            {/* ── Centre: big number + category ── */}
                            <View style={styles.aqiCenter}>
                                <StyledText style={[styles.aqiNumber, { color: aqiCategory.color }]}>
                                    {aqiDisplay}
                                </StyledText>
                                <StyledText style={styles.aqiCategoryLabel}>
                                    {aqiCategory.label}
                                </StyledText>
                                {dominant && (
                                    <View style={[styles.dominantBadge, { borderColor: aqiCategory.color }]}>
                                        <StyledText style={[styles.dominantText, { color: aqiCategory.color }]}>
                                            {dominant}
                                        </StyledText>
                                    </View>
                                )}
                            </View>

                            {/* ── Bottom: horizontal fill bar + footer label ── */}
                            <View style={styles.aqiBottom}>
                                <View style={styles.aqiTrack}>
                                    <View style={[
                                        styles.aqiBarFill,
                                        { width: `${aqiBarFill}%`, backgroundColor: aqiCategory.color }
                                    ]} />
                                </View>
                                <StyledText style={styles.aqiStatusSmall}>
                                    {isOffline ? 'OFFLINE' : 'EPA STANDARD'}
                                </StyledText>
                            </View>
                        </Card>

                        <View style={styles.hubColumn}>
                            <Card variant="light" style={styles.hubCard} borderColor={borderInterpolation}>
                                <View style={styles.hubHeader}>
                                    <StyledText variant="caption" style={styles.hubCaption}>NODE STATUS</StyledText>
                                    <MapPin color={statusColor} size={20} />
                                </View>
                                <StyledText variant="header" style={styles.hubName}>{isOffline ? 'Lichen Offline' : 'Lichen Active Node'}</StyledText>
                                <View style={styles.syncStatus}>
                                    <View style={[styles.syncDot, { backgroundColor: statusColor }]} />
                                    <StyledText variant="caption" style={styles.syncText}>
                                        {statusText}
                                    </StyledText>
                                </View>
                            </Card>

                            <Card variant="light" style={styles.insightCard} borderColor={borderInterpolation}>
                                <StyledText variant="caption" style={styles.insightCaption}>GAS CONCENTRATIONS</StyledText>
                                <View style={styles.gasColumn}>
                                    <View style={styles.gasItem}>
                                        <StyledText style={styles.gasLabel}>CO2</StyledText>
                                        <StyledText style={styles.insightText}>{co2} <StyledText style={styles.unitSmall}>PPM</StyledText></StyledText>
                                    </View>
                                    <View style={styles.gasItem}>
                                        <StyledText style={styles.gasLabel}>NH4</StyledText>
                                        <StyledText style={styles.insightText}>{getVal('MQ135', 'PPM_NH4')} <StyledText style={styles.unitSmall}>PPM</StyledText></StyledText>
                                    </View>
                                    <View style={styles.gasItem}>
                                        <StyledText style={styles.gasLabel}>NO2</StyledText>
                                        <StyledText style={styles.insightText}>{getVal('MQ135', 'PPM_NO2')} <StyledText style={styles.unitSmall}>PPM</StyledText></StyledText>
                                    </View>
                                </View>
                            </Card>
                        </View>
                    </View>

                    <View style={styles.grid}>
                        <View style={styles.gridRow}>
                            <Card variant="light" style={styles.gridCard} borderColor={borderInterpolation}>
                                <View style={styles.gridCardHeader}>
                                    <Thermometer color={COLORS.textDark} size={20} />
                                    <StyledText variant="caption" style={styles.gridCaption}>TEMP</StyledText>
                                </View>
                                <StyledText variant="value" style={styles.gridValue}>
                                    {getVal('BMP280', 'Temp_C')} <StyledText style={styles.unit}>°C</StyledText>
                                </StyledText>
                            </Card>
                            <Card variant="light" style={styles.gridCard} borderColor={borderInterpolation}>
                                <View style={styles.gridCardHeader}>
                                    <Droplets color={COLORS.textDark} size={20} />
                                    <StyledText variant="caption" style={styles.gridCaption}>HUMIDITY</StyledText>
                                </View>
                                <StyledText variant="value" style={styles.gridValue}>
                                    {getVal('DHT11', 'Humidity')} <StyledText style={styles.unit}>%</StyledText>
                                </StyledText>
                            </Card>
                        </View>

                        <View style={styles.gridRow}>
                            <Card variant="light" style={styles.gridCard} borderColor={borderInterpolation}>
                                <View style={styles.gridCardHeader}>
                                    <TrendingUp color={COLORS.textDark} size={20} />
                                    <StyledText variant="caption" style={styles.gridCaption}>HEAT INDEX</StyledText>
                                </View>
                                <StyledText variant="value" style={styles.gridValue}>
                                    {getVal('DHT11', 'HeatIndex')} <StyledText style={styles.unit}>°C</StyledText>
                                </StyledText>
                            </Card>
                            <Card variant="light" style={styles.gridCard} borderColor={borderInterpolation}>
                                <View style={styles.gridCardHeader}>
                                    <Droplets color={COLORS.textDark} size={20} />
                                    <StyledText variant="caption" style={styles.gridCaption}>DEW POINT</StyledText>
                                </View>
                                <StyledText variant="value" style={styles.gridValue}>
                                    {getVal('DHT11', 'DewPoint')} <StyledText style={styles.unit}>°C</StyledText>
                                </StyledText>
                            </Card>
                        </View>

                        <View style={styles.singleRow}>
                            <Card variant="light" style={styles.fullWidthCard} borderColor={borderInterpolation}>
                                <View style={styles.gridCardHeader}>
                                    <Cloud color={COLORS.textDark} size={20} />
                                    <StyledText variant="caption" style={styles.gridCaption}>ALTITUDE</StyledText>
                                </View>
                                <StyledText variant="header" style={styles.gridValue}>
                                    {getVal('BMP280', 'Altitude_m')} <StyledText style={styles.unit}>m</StyledText>
                                </StyledText>
                            </Card>
                        </View>

                        <View style={styles.gridRow}>
                            <Card variant="light" style={styles.gridCard} borderColor={borderInterpolation}>
                                <View style={styles.gridCardHeader}>
                                    <Zap color={COLORS.textDark} size={20} />
                                    <StyledText variant="caption" style={styles.gridCaption}>CO2 PPM</StyledText>
                                </View>
                                <StyledText variant="value" style={styles.gridValue}>
                                    {getVal('MQ135', 'PPM_CO2')} <StyledText style={styles.unit}>ppm</StyledText>
                                </StyledText>
                            </Card>
                            <Card variant="light" style={styles.gridCard} borderColor={borderInterpolation}>
                                <View style={styles.gridCardHeader}>
                                    <Wind color={COLORS.textDark} size={20} />
                                    <StyledText variant="caption" style={styles.gridCaption}>PRESSURE</StyledText>
                                </View>
                                <StyledText variant="value" style={styles.gridValue}>
                                    {getVal('BMP280', 'Pressure_hPa')} <StyledText style={styles.unit}>hPa</StyledText>
                                </StyledText>
                            </Card>
                        </View>

                        <View style={styles.singleRow}>
                            <Card variant="light" style={styles.fullWidthCard} borderColor={borderInterpolation}>
                                <View style={styles.gridCardHeader}>
                                    <Layers color={COLORS.textDark} size={20} />
                                    <StyledText variant="caption" style={styles.gridCaption}>DUST DENSITY</StyledText>
                                </View>
                                <StyledText variant="header" style={styles.gridValue}>
                                    {getVal('Dust', 'Density_mgm3')} <StyledText style={styles.unit}>mg/m³</StyledText>
                                </StyledText>
                            </Card>
                        </View>
                    </View>

                    <View style={styles.spacer} />
                </ScrollView>
            </View>
        </BackgroundWrapper>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { padding: SPACING.md },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.md,
        paddingTop: SPACING.sm,
    },
    logoGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    leafBadge: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: 'rgba(0, 230, 118, 0.12)',
        borderWidth: 1,
        borderColor: 'rgba(0, 230, 118, 0.3)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    slogan: {
        fontSize: 9,
        color: COLORS.textSecondary,
        fontFamily: 'Outfit_400Regular',
        letterSpacing: 0.3,
        marginTop: 1,
        fontStyle: 'italic',
    },
    headerDivider: {
        height: 1,
        backgroundColor: 'rgba(0, 230, 118, 0.15)',
        marginBottom: SPACING.lg,
        borderRadius: 1,
    },
    syncIndicator: {
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mainRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SPACING.md,
    },
    aqiCard: {
        width: '32%',
        height: 320,
        padding: SPACING.md,
        justifyContent: 'space-between',
    },
    aqiHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    aqiLabel: {
        fontSize: 11,
        color: COLORS.textSecondary,
        fontWeight: 'bold',
        letterSpacing: 1.5,
    },
    aqiCenter: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    aqiNumber: {
        fontSize: 52,
        fontWeight: 'bold',
        lineHeight: 56,
        textAlign: 'center',
    },
    aqiCategoryLabel: {
        fontSize: 9,
        color: COLORS.textSecondary,
        fontWeight: 'bold',
        letterSpacing: 0.8,
        textAlign: 'center',
        marginTop: 4,
    },
    dominantBadge: {
        marginTop: 8,
        borderWidth: 1,
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 3,
        alignItems: 'center',
    },
    dominantText: { fontSize: 9, fontWeight: 'bold', letterSpacing: 0.5 },
    aqiBottom: {
        alignItems: 'center',
        gap: 6,
    },
    aqiTrack: {
        width: '100%',
        height: 4,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 3,
        overflow: 'hidden',
    },
    aqiBarFill: {
        height: '100%',
        borderRadius: 3,
        minWidth: 4,
    },
    aqiStatusSmall: { fontSize: 8, color: COLORS.textSecondary, letterSpacing: 1 },
    hubColumn: { width: '64%' },
    hubCard: { height: 200, justifyContent: 'space-between' },
    hubHeader: { flexDirection: 'row', justifyContent: 'space-between' },
    hubCaption: { color: COLORS.textSecondary },
    hubName: { color: COLORS.textDark, fontSize: 32 },
    syncStatus: { flexDirection: 'row', alignItems: 'center' },
    syncDot: { width: 8, height: 8, borderRadius: 4, marginRight: SPACING.sm },
    syncText: { color: COLORS.textDark, fontWeight: 'bold' },
    insightCard: { height: 130, marginTop: SPACING.sm, justifyContent: 'center' },
    insightCaption: { color: COLORS.textSecondary, marginBottom: SPACING.sm },
    insightText: { color: COLORS.textDark, fontWeight: 'bold', fontSize: 14 },
    gasColumn: { justifyContent: 'space-between' },
    gasItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
    gasLabel: { color: COLORS.textSecondary, fontSize: 10, fontWeight: 'bold' },
    unitSmall: { fontSize: 9, color: COLORS.textSecondary, fontWeight: 'normal' },
    grid: { marginTop: SPACING.md },
    gridRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.sm },
    singleRow: { marginBottom: SPACING.sm },
    fullWidthCard: {
        width: '100%',
        height: 100,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.lg,
    },
    gridCard: { width: '48%', height: 140, padding: SPACING.md, justifyContent: 'space-between' },
    gridCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    gridCaption: { color: COLORS.textSecondary },
    gridValue: { color: COLORS.textDark, fontSize: 32 },
    unit: { fontSize: 14, color: COLORS.textSecondary },
    spacer: { height: 100 }
});

export default DashboardScreen;
