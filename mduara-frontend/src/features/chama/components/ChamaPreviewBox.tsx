import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ArrowRight, BriefcaseBusiness, GraduationCap, House, Plane, UsersRound, WalletCards } from 'lucide-react-native';

import { Card } from '../../../components/ui/Card';
import type { PublicChama } from '../../../shared/prototype';
import { formatCurrency } from '../../../shared/date';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';

interface ChamaPreviewBoxProps {
    chama: PublicChama;
    onViewDetails: (chama: PublicChama) => void;
}

function GoalIcon({ category }: { category: string }) {
    const iconProps = { color: colors.primary, size: 21, strokeWidth: 2 };

    if (category === 'Business') return <BriefcaseBusiness {...iconProps} />;
    if (category === 'Home & Land') return <House {...iconProps} />;
    if (category === 'Education') return <GraduationCap {...iconProps} />;
    if (category === 'Travel') return <Plane {...iconProps} />;
    return <WalletCards {...iconProps} />;
}

function recruitmentCopy(status: PublicChama['recruitmentStatus']) {
    if (status === 'Open') return 'Recruiting';
    if (status === 'Almost Full') return 'Almost full';
    return 'Closed';
}

export function ChamaPreviewBox({ chama, onViewDetails }: ChamaPreviewBoxProps) {
    const progress = chama.target > 0 ? Math.min(100, Math.round((chama.pooled / chama.target) * 100)) : 0;
    const spaces = Math.max(0, chama.capacity - chama.members);
    const isOpen = chama.recruitmentStatus === 'Open';

    return (
        <Card style={styles.card} variant="outlined">
            <View style={styles.topRow}>
                <View style={styles.goalIcon}>
                    <GoalIcon category={chama.goalCategory} />
                </View>
                <View style={[styles.statusPill, isOpen ? styles.statusPillOpen : styles.statusPillClosed]}>
                    <Text style={[styles.statusText, isOpen ? styles.statusTextOpen : styles.statusTextClosed]}>{recruitmentCopy(chama.recruitmentStatus)}</Text>
                </View>
            </View>

            <View>
                <Text numberOfLines={1} style={styles.title}>{chama.name}</Text>
                <Text numberOfLines={1} style={styles.goal}>Goal: {chama.goalCategory}</Text>
            </View>

            <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                    <Text style={styles.statLabel}>Contribution</Text>
                    <Text numberOfLines={1} style={styles.statValue}>{formatCurrency(chama.contributionAmount)}</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statLabel}>Members</Text>
                    <Text numberOfLines={1} style={styles.statValue}>{chama.members} / {chama.capacity}</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statLabel}>Frequency</Text>
                    <Text numberOfLines={1} style={styles.statValue}>{chama.contributionFrequency}</Text>
                </View>
            </View>

            <View style={styles.capacityRow}>
                <View style={styles.capacityLabel}><UsersRound color={colors.textMuted} size={14} /><Text style={styles.capacityText}>{chama.members} members joined</Text></View>
                <Text style={styles.capacityText}>{spaces} {spaces === 1 ? 'space' : 'spaces'}</Text>
            </View>
            <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${progress}%` }]} /></View>

            <Pressable
                accessibilityLabel={`View ${chama.name}`}
                accessibilityRole="button"
                onPress={() => onViewDetails(chama)}
                style={({ pressed }) => [styles.viewButton, pressed && styles.viewButtonPressed]}
            >
                <Text style={styles.viewButtonText}>View Chama</Text>
                <ArrowRight color={colors.primary} size={17} strokeWidth={2.4} />
            </Pressable>
        </Card>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 18,
        flexBasis: 280,
        flexGrow: 1,
        flexShrink: 1,
        gap: 14,
        minHeight: 322,
        overflow: 'hidden',
        padding: 20,
    },
    topRow: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    goalIcon: {
        alignItems: 'center',
        backgroundColor: colors.primaryLight,
        borderRadius: 12,
        height: 44,
        justifyContent: 'center',
        width: 44,
    },
    statusPill: {
        borderRadius: 999,
        paddingHorizontal: 9,
        paddingVertical: 5,
    },
    statusPillOpen: { backgroundColor: colors.successSoft },
    statusPillClosed: { backgroundColor: colors.surfaceMuted },
    statusText: {
        fontSize: 8,
        fontWeight: typography.weights.extrabold,
        letterSpacing: 0.35,
        textTransform: 'uppercase',
    },
    statusTextOpen: { color: colors.success },
    statusTextClosed: { color: colors.textMuted },
    title: {
        color: colors.navy,
        fontSize: 18,
        fontWeight: typography.weights.extrabold,
    },
    goal: {
        color: colors.textMuted,
        fontSize: 10,
        fontWeight: typography.weights.medium,
        marginTop: 5,
    },
    statsGrid: {
        flexDirection: 'row',
        gap: 7,
    },
    statCard: {
        backgroundColor: '#FAFAFD',
        borderColor: '#EEF0F5',
        borderRadius: 10,
        borderWidth: 1,
        flex: 1,
        minWidth: 0,
        paddingHorizontal: 8,
        paddingVertical: 10,
    },
    statLabel: {
        color: colors.textMuted,
        fontSize: 7.5,
    },
    statValue: {
        color: colors.navy,
        fontSize: 9,
        fontWeight: typography.weights.bold,
        marginTop: 5,
    },
    capacityRow: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    capacityLabel: { alignItems: 'center', flexDirection: 'row', gap: 5 },
    capacityText: {
        color: colors.textMuted,
        fontSize: 9,
        fontWeight: typography.weights.medium,
    },
    progressTrack: {
        backgroundColor: '#EEF0F5',
        borderRadius: 999,
        height: 6,
        overflow: 'hidden',
    },
    progressFill: {
        backgroundColor: colors.primary,
        borderRadius: 999,
        height: '100%',
    },
    viewButton: {
        alignItems: 'center',
        borderColor: colors.primaryLine,
        borderRadius: 10,
        borderWidth: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 'auto',
        minHeight: 44,
        paddingHorizontal: 14,
    },
    viewButtonPressed: { backgroundColor: colors.primaryLight },
    viewButtonText: {
        color: colors.primaryDark,
        fontSize: 11,
        fontWeight: typography.weights.extrabold,
        marginRight: 6,
    },
});