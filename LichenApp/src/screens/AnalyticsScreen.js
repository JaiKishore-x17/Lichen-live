import React, { useMemo } from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../theme/theme';
import Card from '../components/Card';
import StyledText from '../components/StyledText';
import { LineChart } from 'react-native-gifted-charts';
import { Activity, BarChart2, TrendingUp, Compass, Waves } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BackgroundWrapper from '../theme/BackgroundWrapper';
import { useRealtimeData } from '../hooks/useRealtimeData';

const AnalyticsScreen = () => {
    const insets = useSafeAreaInsets();
    const { data: history, loading } = useRealtimeData('HistoryLog');

    // Process history data for charts
    const { chartData, maxPpmValue } = useMemo(() => {
        // Defensive check for history object
        if (!history || typeof history !== 'object' || Object.keys(history).length === 0) {
            return { chartData: { co2Data: [], nh4Data: [], no2Data: [], tempData: [] }, maxPpmValue: 10 };
        }

        // Take last 15 readings for enough data points in line chart
        const logs = Object.values(history).filter(log => log && typeof log === 'object').slice(-15);

        if (logs.length === 0) {
            return { chartData: { co2Data: [], nh4Data: [], no2Data: [], tempData: [] }, maxPpmValue: 10 };
        }

        const co2Data = logs.map((log, index) => ({
            value: Number(log.MQ135?.PPM_CO2) || 0,
            label: `-${(logs.length - 1 - index) * 20}s`,
            dataPointColor: COLORS.primary,
        }));
        const nh4Data = logs.map((log, index) => ({
            value: Number(log.MQ135?.PPM_NH3) || 0,
            label: `-${(logs.length - 1 - index) * 20}s`,
            dataPointColor: COLORS.secondary,
        }));
        const no2Data = logs.map((log, index) => ({
            value: Number(log.MQ135?.PPM_NO2) || 0,
            label: `-${(logs.length - 1 - index) * 20}s`,
            dataPointColor: '#F472B6',
        }));
        const tempData = logs.map(log => ({
            value: Number(log.DHT11?.Temp_C) || 0
        }));

        // Find max value across all 3 PPM datasets to unify scale
        const allValues = [
            ...co2Data.map(d => d.value),
            ...nh4Data.map(d => d.value),
            ...no2Data.map(d => d.value)
        ].filter(v => !isNaN(v));

        const rawMax = allValues.length > 0 ? Math.max(...allValues, 5) : 10;
        const unifiedMax = Math.ceil(rawMax / 5) * 5; // Nice rounded scale

        return {
            chartData: { co2Data, nh4Data, no2Data, tempData },
            maxPpmValue: unifiedMax
        };
    }, [history]);

    const renderLineChart = (data, color, title, Icon, maxValue) => (
        <Card style={styles.chartCard}>
            <View style={styles.chartHeader}>
                <StyledText variant="caption">{title}</StyledText>
                <Icon color={color} size={20} />
            </View>
            <View style={styles.chartContainer}>
                {loading ? (
                    <ActivityIndicator color={color} />
                ) : data.length === 0 ? (
                    <View style={styles.emptyChart}>
                        <StyledText style={styles.emptyText}>NO HISTORICAL DATA AVAILABLE</StyledText>
                    </View>
                ) : (
                    <LineChart
                        data={data}
                        color={color}
                        thickness={3}
                        maxValue={maxValue}
                        noOfSections={4}
                        dataPointsColor={color}
                        areaChart
                        startFillColor={color}
                        endFillColor="transparent"
                        startOpacity={0.2}
                        endOpacity={0}
                        spacing={40}
                        rulesType="solid"
                        rulesColor="rgba(255, 255, 255, 0.05)"
                        yAxisColor="transparent"
                        xAxisColor="rgba(255, 255, 255, 0.1)"
                        yAxisTextStyle={{ color: COLORS.textSecondary, fontSize: 10 }}
                        xAxisLabelTextStyle={{ color: COLORS.textSecondary, fontSize: 8 }}
                        pointerConfig={{
                            pointerStripColor: 'lightgray',
                            pointerStripWidth: 2,
                            pointerColor: 'lightgray',
                            radius: 6,
                            pointerLabelComponent: items => {
                                if (!items || items.length === 0) return null;
                                return (
                                    <View style={styles.pointerLabel}>
                                        <StyledText style={{ color: 'white', fontWeight: 'bold' }}>
                                            {items[0].value} ppm
                                        </StyledText>
                                    </View>
                                );
                            },
                        }}
                    />
                )}
            </View>
        </Card>
    );

    return (
        <BackgroundWrapper>
            <View style={[styles.container, { paddingTop: insets.top }]}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <View style={styles.header}>
                        <StyledText variant="logo">LICHEN ANALYSIS</StyledText>
                        <View style={styles.liveIndicator}>
                            <StyledText style={styles.liveText}>XY TRACKING (20s)</StyledText>
                        </View>
                    </View>

                    {renderLineChart(chartData.co2Data, COLORS.primary, "CO2 DENSITY (PPM)", BarChart2, maxPpmValue)}
                    {renderLineChart(chartData.nh4Data, COLORS.secondary, "NH3 AMMONIA (PPM)", Waves, maxPpmValue)}
                    {renderLineChart(chartData.no2Data, '#F472B6', "NO2 NITROGEN (PPM)", TrendingUp, maxPpmValue)}

                    <View style={styles.row}>
                        <Card variant="light" style={styles.miniStats}>
                            <StyledText variant="caption" style={styles.darkLabel}>AVG TEMP</StyledText>
                            <StyledText style={styles.darkValue}>
                                {chartData.tempData.length > 0 ? (chartData.tempData.reduce((a, b) => a + b.value, 0) / chartData.tempData.length).toFixed(1) : '--'}°C
                            </StyledText>
                        </Card>
                        <Card variant="light" style={styles.miniStats}>
                            <StyledText variant="caption" style={styles.darkLabel}>TIME WINDOW</StyledText>
                            <StyledText style={styles.darkValue}>20s</StyledText>
                        </Card>
                    </View>

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
        marginBottom: SPACING.lg,
    },
    liveIndicator: {
        backgroundColor: 'rgba(52, 211, 153, 0.1)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.primary,
    },
    liveText: { color: COLORS.primary, fontSize: 10, fontWeight: 'bold' },
    chartCard: { marginBottom: SPACING.md, padding: SPACING.md, height: 260 },
    chartHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.md },
    chartContainer: { height: 180, justifyContent: 'center' },
    row: { flexDirection: 'row', justifyContent: 'space-between' },
    miniStats: { width: '48%', height: 90, padding: SPACING.md, justifyContent: 'center' },
    darkLabel: { color: COLORS.textSecondary },
    darkValue: { color: COLORS.textDark, fontSize: 24, fontWeight: 'bold' },
    pointerLabel: {
        backgroundColor: '#232323',
        padding: 5,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyChart: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: BORDER_RADIUS.md,
    },
    emptyText: {
        color: COLORS.textSecondary,
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
});

export default AnalyticsScreen;
