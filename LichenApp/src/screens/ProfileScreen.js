import React from 'react';
import { View, ScrollView, StyleSheet, Pressable } from 'react-native';
import { COLORS, SPACING } from '../theme/theme';
import Card from '../components/Card';
import StyledText from '../components/StyledText';
import { User, Settings, Bell, Shield, HelpCircle, LogOut, ChevronRight, Cpu } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BackgroundWrapper from '../theme/BackgroundWrapper';
import { useRealtimeData } from '../hooks/useRealtimeData';

const ProfileScreen = () => {
    const insets = useSafeAreaInsets();
    const { loading, isOffline } = useRealtimeData('LatestReadings');

    const statusColor = isOffline ? COLORS.error || '#EF4444' : (loading ? COLORS.textSecondary : COLORS.primary);
    const statusLabel = isOffline ? 'Offline' : (loading ? 'Linking...' : 'Online');

    const SettingItem = ({ icon: Icon, label, value, onPress, isLast }) => (
        <Pressable
            style={[styles.settingItem, !isLast && styles.settingDivider]}
            onPress={onPress}
        >
            <View style={styles.settingLeft}>
                <View style={styles.iconContainer}>
                    <Icon color={COLORS.textDark} size={20} />
                </View>
                <StyledText style={styles.settingLabel}>{label}</StyledText>
            </View>
            <View style={styles.settingRight}>
                {value && <StyledText style={styles.settingValue}>{value}</StyledText>}
                <ChevronRight color={COLORS.textSecondary} size={20} />
            </View>
        </Pressable>
    );

    return (
        <BackgroundWrapper>
            <View style={[styles.container, { paddingTop: insets.top }]}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <View style={styles.header}>
                        <StyledText variant="logo">PROFILE</StyledText>
                        <Pressable style={styles.settingsBtn}>
                            <Settings color={COLORS.text} size={24} />
                        </Pressable>
                    </View>

                    <View style={styles.profileHeader}>
                        <View style={styles.avatarContainer}>
                            <View style={styles.avatarGradient}>
                                <User color={COLORS.text} size={48} />
                            </View>
                        </View>
                        <StyledText variant="header" style={styles.userName}>User MDP</StyledText>
                        <StyledText variant="caption" style={styles.userEmail}>MDP.user@lichen.ai</StyledText>
                    </View>

                    <StyledText variant="caption" style={styles.sectionTitle}>LINKED HARDWARE</StyledText>
                    <Card variant="light" style={styles.nodeCard}>
                        <View style={styles.nodeIcon}>
                            <Cpu color={statusColor} size={24} />
                        </View>
                        <View style={styles.nodeInfo}>
                            <StyledText style={styles.nodeName}>Lichen Node 01</StyledText>
                            <StyledText variant="caption">ESP32-WROOM • {statusLabel}</StyledText>
                        </View>
                        <View style={[styles.statusDot, { backgroundColor: statusColor, shadowColor: statusColor }]} />
                    </Card>

                    <StyledText variant="caption" style={styles.sectionTitle}>PREFERENCES</StyledText>
                    <Card variant="light" style={styles.settingsCard}>
                        <SettingItem
                            icon={Bell}
                            label="Flash Sync Alerts"
                            value="Active"
                            onPress={() => { }}
                        />
                        <SettingItem
                            icon={Shield}
                            label="Node Security"
                            onPress={() => { }}
                        />
                        <SettingItem
                            icon={HelpCircle}
                            label="Technical Specs"
                            onPress={() => { }}
                        />
                        <SettingItem
                            icon={LogOut}
                            label="Disconnect"
                            isLast
                            onPress={() => { }}
                        />
                    </Card>

                    <View style={styles.footer}>
                        <StyledText variant="caption" style={styles.versionText}>LICHEN CORE V0.0.8</StyledText>
                        <StyledText variant="caption" style={styles.creditText}>BUILT FOR ENVIRONMENTAL PRECISION</StyledText>
                    </View>

                    <View style={{ height: 120 }} />
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
    profileHeader: {
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    settingsBtn: {
        padding: SPACING.xs
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        padding: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        marginBottom: SPACING.md,
    },
    avatarGradient: {
        flex: 1,
        borderRadius: 46,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    userName: { fontSize: 24, color: COLORS.text, marginBottom: 4 },
    userEmail: { color: COLORS.textSecondary },
    sectionTitle: {
        marginBottom: SPACING.sm,
        marginLeft: SPACING.xs,
        letterSpacing: 1.5,
        color: COLORS.textSecondary,
        fontSize: 10,
        fontWeight: 'bold'
    },
    nodeCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.md,
        marginBottom: SPACING.xl,
    },
    nodeIcon: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: 'rgba(52, 211, 153, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.md,
    },
    nodeInfo: { flex: 1 },
    nodeName: { color: COLORS.textDark, fontWeight: 'bold' },
    statusDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: COLORS.primary,
        shadowColor: COLORS.primary,
        shadowOpacity: 0.5,
        shadowRadius: 5,
    },
    settingsCard: {
        padding: 0,
        overflow: 'hidden',
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: SPACING.lg,
    },
    settingDivider: {
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 0, 0, 0.05)',
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.03)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.md,
    },
    settingLabel: {
        color: COLORS.textDark,
        fontWeight: '600',
    },
    settingRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingValue: {
        color: COLORS.textSecondary,
        marginRight: SPACING.sm,
        fontSize: 14,
    },
    footer: {
        marginTop: SPACING.xl,
        alignItems: 'center',
    },
    versionText: { color: COLORS.textSecondary, marginBottom: 4, letterSpacing: 1 },
    creditText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 8, letterSpacing: 2 },
});

export default ProfileScreen;
