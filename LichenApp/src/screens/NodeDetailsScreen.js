import React, { useEffect, useRef } from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator, Animated } from 'react-native';
import { COLORS, SPACING } from '../theme/theme';
import Card from '../components/Card';
import StyledText from '../components/StyledText';
import { Cpu, Wifi, Database, Clock, Thermometer, Droplets, Layers, Leaf } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BackgroundWrapper from '../theme/BackgroundWrapper';
import { useRealtimeData } from '../hooks/useRealtimeData';

const NodeDetailsScreen = () => {
    const insets = useSafeAreaInsets();
    const { data: latest, loading, lastUpdated, isOffline } = useRealtimeData('LatestReadings');
    const borderColorAnim = useRef(new Animated.Value(0)).current;
    const prevDataRef = useRef(null);

    const statusColor = isOffline ? COLORS.error || '#EF4444' : (loading ? COLORS.textSecondary : COLORS.primary);
    const statusText = isOffline ? 'NODE OFFLINE' : (loading ? 'SYNCING' : 'NODE ACTIVE');

    useEffect(() => {
        if (!loading && latest) {
            const dataChanged = JSON.stringify(latest) !== JSON.stringify(prevDataRef.current);
            if (dataChanged) {
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
        return val !== undefined ? (typeof val === 'number' ? val.toFixed(3) : val) : fallback;
    };

    return (
        <BackgroundWrapper>
            <View style={[styles.container, { paddingTop: insets.top }]}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <View style={styles.header}>
                        <View style={styles.logoGroup}>
                            <View style={styles.leafBadge}>
                                <Leaf color={COLORS.primary} size={16} strokeWidth={2.5} />
                            </View>
                            <StyledText variant="logo">HARDWARE</StyledText>
                        </View>
                        <View style={styles.syncBadge}>
                            <View style={[styles.syncDot, { backgroundColor: statusColor }]} />
                            <StyledText style={styles.syncText}>{statusText}</StyledText>
                        </View>
                    </View>

                    <Card style={styles.hardwareCard} borderColor={borderInterpolation}>
                        <View style={styles.hardwareInfo}>
                            <View>
                                <StyledText variant="caption">DEVICE</StyledText>
                                <StyledText variant="header">ESP32-WROOM</StyledText>
                            </View>
                            <Wifi color={COLORS.primary} size={24} />
                        </View>

                        <View style={styles.specs}>
                            <View style={styles.spec}>
                                <StyledText variant="caption">R0 CLEAN AIR</StyledText>
                                <StyledText style={styles.specValue}>{getVal('MQ135', 'Rs_CleanAir_R0')}</StyledText>
                            </View>
                            <View style={styles.spec}>
                                <StyledText variant="caption">RS CURRENT</StyledText>
                                <StyledText style={styles.specValue}>{getVal('MQ135', 'Rs_Current')}</StyledText>
                            </View>
                            <View style={styles.spec}>
                                <StyledText variant="caption">SYSTEM VOLT</StyledText>
                                <StyledText style={styles.specValue}>{getVal('MQ135', 'Voltage')}V</StyledText>
                            </View>
                        </View>
                    </Card>

                    <StyledText variant="caption" style={styles.sectionHeader}>RAW SENSOR BUS</StyledText>

                    <Card variant="light" style={styles.telemetryCard} borderColor={borderInterpolation}>
                        <View style={styles.telemetryHeader}>
                            <Thermometer color={COLORS.textDark} size={20} />
                            <StyledText variant="caption" style={styles.darkCaption}>BMP280 ENVIRONMENTAL</StyledText>
                        </View>
                        <View style={styles.telemetryData}>
                            <View style={styles.telemetryItem}>
                                <StyledText style={styles.dataLabel}>PRESSURE</StyledText>
                                <StyledText style={styles.dataValue}>{getVal('BMP280', 'Pressure_hPa')} <StyledText style={styles.dataUnit}>hPa</StyledText></StyledText>
                            </View>
                            <View style={styles.telemetryItem}>
                                <StyledText style={styles.dataLabel}>ALTITUDE</StyledText>
                                <StyledText style={styles.dataValue}>{getVal('BMP280', 'Altitude_m')} <StyledText style={styles.dataUnit}>m</StyledText></StyledText>
                            </View>
                        </View>
                    </Card>

                    <Card variant="light" style={styles.telemetryCard} borderColor={borderInterpolation}>
                        <View style={styles.telemetryHeader}>
                            <Cpu color={COLORS.textDark} size={20} />
                            <StyledText variant="caption" style={styles.darkCaption}>MQ135 ANALOG OUTPUT</StyledText>
                        </View>
                        <View style={styles.telemetryData}>
                            <View style={styles.telemetryItem}>
                                <StyledText style={styles.dataLabel}>ADC RAW</StyledText>
                                <StyledText style={styles.dataValue}>{latest?.MQ135?.RawADC || '--'}</StyledText>
                            </View>
                            <View style={styles.telemetryItem}>
                                <StyledText style={styles.dataLabel}>CO2 PPM</StyledText>
                                <StyledText style={styles.dataValue}>{getVal('MQ135', 'PPM_CO2')}</StyledText>
                            </View>
                            <View style={styles.telemetryItem}>
                                <StyledText style={styles.dataLabel}>NO2 PPM</StyledText>
                                <StyledText style={styles.dataValue}>{getVal('MQ135', 'PPM_NO2')}</StyledText>
                            </View>
                            <View style={styles.telemetryItem}>
                                <StyledText style={styles.dataLabel}>NH4 PPM</StyledText>
                                <StyledText style={styles.dataValue}>{getVal('MQ135', 'PPM_NH4')}</StyledText>
                            </View>
                        </View>
                    </Card>

                    <Card variant="light" style={styles.telemetryCard} borderColor={borderInterpolation}>
                        <View style={styles.telemetryHeader}>
                            <Droplets color={COLORS.textDark} size={20} />
                            <StyledText variant="caption" style={styles.darkCaption}>DHT11 PRECISION</StyledText>
                        </View>
                        <View style={styles.telemetryData}>
                            <View style={styles.telemetryItem}>
                                <StyledText style={styles.dataLabel}>DEW POINT</StyledText>
                                <StyledText style={styles.dataValue}>{getVal('DHT11', 'DewPoint')}°C</StyledText>
                            </View>
                            <View style={styles.telemetryItem}>
                                <StyledText style={styles.dataLabel}>HI INDEX</StyledText>
                                <StyledText style={styles.dataValue}>{getVal('DHT11', 'HeatIndex')}°C</StyledText>
                            </View>
                        </View>
                    </Card>

                    <Card variant="light" style={styles.telemetryCard} borderColor={borderInterpolation}>
                        <View style={styles.telemetryHeader}>
                            <Layers color={COLORS.textDark} size={20} />
                            <StyledText variant="caption" style={styles.darkCaption}>GP2Y1014 DUST SENSOR</StyledText>
                        </View>
                        <View style={styles.telemetryData}>
                            <View style={styles.telemetryItem}>
                                <StyledText style={styles.dataLabel}>DENSITY</StyledText>
                                <StyledText style={styles.dataValue}>{getVal('Dust', 'Density_mgm3')} <StyledText style={styles.dataUnit}>mg/m³</StyledText></StyledText>
                            </View>
                            <View style={styles.telemetryItem}>
                                <StyledText style={styles.dataLabel}>STATUS</StyledText>
                                <StyledText style={styles.dataValue}>{getVal('Dust', 'Status')}</StyledText>
                            </View>
                            <View style={styles.telemetryItem}>
                                <StyledText style={styles.dataLabel}>VOLTAGE</StyledText>
                                <StyledText style={styles.dataValue}>{getVal('Dust', 'Voltage')} <StyledText style={styles.dataUnit}>V</StyledText></StyledText>
                            </View>
                        </View>
                    </Card>

                    <Card style={styles.logCard} borderColor={borderInterpolation}>
                        <View style={styles.logHeader}>
                            <StyledText variant="caption">SYSTEM STATUS</StyledText>
                            <Database color={COLORS.primary} size={16} />
                        </View>
                        <StyledText style={styles.logText}>REST API Polling: {isOffline ? 'Disconnected' : 'Active (20.0s)'}</StyledText>
                    </Card>

                    <View style={{ height: 100 }} />
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
    },
    logoGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    leafBadge: {
        width: 32,
        height: 32,
        borderRadius: 9,
        backgroundColor: 'rgba(0, 230, 118, 0.12)',
        borderWidth: 1,
        borderColor: 'rgba(0, 230, 118, 0.3)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    syncBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)'
    },
    syncDot: { width: 6, height: 6, borderRadius: 3, marginRight: 8 },
    syncText: { color: COLORS.text, fontSize: 10, fontWeight: 'bold' },
    hardwareCard: { marginBottom: SPACING.xl, padding: SPACING.lg },
    hardwareInfo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.lg },
    specs: { flexDirection: 'row', justifyContent: 'space-between' },
    spec: { flex: 1 },
    specValue: { color: COLORS.text, fontWeight: 'bold', marginTop: 4, fontSize: 16 },
    sectionHeader: { marginBottom: SPACING.md, letterSpacing: 1.5, color: COLORS.textSecondary },
    telemetryCard: { marginBottom: SPACING.sm, padding: SPACING.md },
    telemetryHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md },
    darkCaption: { marginLeft: 10, color: COLORS.textSecondary },
    telemetryData: { flexDirection: 'row', justifyContent: 'space-between' },
    telemetryItem: { flex: 1 },
    dataLabel: { fontSize: 10, color: 'rgba(0,0,0,0.5)', fontWeight: 'bold' },
    dataValue: { fontSize: 20, color: COLORS.textDark, fontWeight: 'bold', marginTop: 4 },
    dataUnit: { fontSize: 12, color: 'rgba(0,0,0,0.4)' },
    logCard: { padding: SPACING.lg },
    logHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.md },
    logText: { color: COLORS.textSecondary, fontSize: 12 }
});

export default NodeDetailsScreen;
