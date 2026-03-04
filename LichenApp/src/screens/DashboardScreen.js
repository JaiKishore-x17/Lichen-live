import React, { useEffect, useRef } from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator, Animated } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../theme/theme';
import Card from '../components/Card';
import StyledText from '../components/StyledText';
import { Wind, MapPin, Zap, Thermometer, Droplets, Activity, TrendingUp, Cloud, RefreshCcw } from 'lucide-react-native';
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

    return (
        <BackgroundWrapper>
            <View style={[styles.container, { paddingTop: insets.top }]}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <View style={styles.header}>
                        <StyledText variant="logo">LICHEN</StyledText>
                        <Animated.View style={[styles.syncIndicator, { transform: [{ scale: syncPulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.25] }) }] }]}>
                            {loading ? (
                                <ActivityIndicator color={COLORS.primary} size="small" />
                            ) : (
                                <RefreshCcw color={statusColor} size={20} />
                            )}
                        </Animated.View>
                    </View>

                    <View style={styles.mainRow}>
                        <Card style={styles.aqiCard} borderColor={borderInterpolation}>
                            <View style={styles.aqiHeader}>
                                <Wind color={COLORS.textSecondary} size={24} />
                            </View>
                            <View style={styles.aqiBarPlaceholder}>
                                <StyledText style={styles.pendingLabel}>AQI CALCULATION PENDING</StyledText>
                            </View>
                            <View style={styles.aqiFooter}>
                                <StyledText style={styles.aqiStatusSmall}>{isOffline ? 'OFFLINE' : 'READY FOR DATA'}</StyledText>
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
                                    {getVal('DHT11', 'Temp_C')} <StyledText style={styles.unit}>°C</StyledText>
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
                                    < Zap color={COLORS.textDark} size={20} />
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
        marginBottom: SPACING.xl,
        paddingTop: SPACING.sm,
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
        justifyContent: 'space-between',
        padding: SPACING.md,
    },
    aqiHeader: { alignItems: 'center' },
    aqiBarPlaceholder: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: SPACING.md,
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: BORDER_RADIUS.xl,
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    pendingLabel: {
        transform: [{ rotate: '-90deg' }],
        width: 200,
        textAlign: 'center',
        color: COLORS.textSecondary,
        fontSize: 10,
        fontWeight: 'bold',
    },
    aqiFooter: { alignItems: 'center' },
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
