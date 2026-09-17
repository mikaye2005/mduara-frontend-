import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { ArrowRight, Store, UsersRound, WalletCards, X } from 'lucide-react-native';

import { Button } from '../../components/ui/Button';
import { MerchantRewardCard } from './MerchantRewardCard';
import { Badge } from '../../components/ui/Badge';
import { colors } from '../../theme/colors';
import { radii, spacing } from '../../theme/layout';
import { typography } from '../../theme/typography';
import {
  goalCategories,
  goalsForCategory,
  type GoalCategoryCode,
  type SavingGoal,
} from '../../shared/prototype';

interface GoalMarketplaceSectionProps {
  onStartMatching: (goal: SavingGoal) => void;
}

function formatMoney(value: number) {
  if (value >= 1_000_000) return `KSh ${(value / 1_000_000).toFixed(1)}M`;
  return `KSh ${value.toLocaleString('en-KE')}`;
}

export function GoalMarketplaceSection({ onStartMatching }: GoalMarketplaceSectionProps) {
  const { width } = useWindowDimensions();
  const compact = width < 760;
  const [category, setCategory] = useState<GoalCategoryCode>('HOME_APPLIANCES');
  const [selectedGoal, setSelectedGoal] = useState<SavingGoal | null>(null);
  const goals = useMemo(() => goalsForCategory(category), [category]);
  const categoryInfo = goalCategories.find((item) => item.code === category)!;

  return (
    <View style={styles.section}>
      <View style={styles.headingWrap}>
        <Text style={styles.eyebrow}>MBOGI SAVING MARKETPLACE</Text>
        <Text style={styles.title}>Start with the goal. Find the right people next.</Text>
        <Text style={styles.subtitle}>Phase 1 groups members around similar goals, contribution capacity and timelines before they choose a specific Chama.</Text>
      </View>

      <View style={styles.categoryTabs} accessibilityRole="tablist">
        {goalCategories.map((item) => {
          const active = item.code === category;
          return (
            <Pressable
              key={item.code}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              onPress={() => { setCategory(item.code); setSelectedGoal(null); }}
              style={({ pressed }) => [styles.categoryTab, active && styles.categoryTabActive, pressed && styles.pressed]}
            >
              <Text style={[styles.categoryTabText, active && styles.categoryTabTextActive]}>{item.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.categoryIntro}>
        <Text style={styles.categoryTitle}>{categoryInfo.label}</Text>
        <Text style={styles.categoryDescription}>{categoryInfo.description}</Text>
      </View>

      <View style={styles.goalGrid}>
        {goals.map((goal) => (
          <Pressable
            key={goal.id}
            accessibilityRole="button"
            onPress={() => setSelectedGoal(goal)}
            style={({ pressed, hovered }: any) => [styles.goalCard, hovered && styles.goalCardHover, pressed && styles.pressed]}
          >
            <View style={styles.goalTopRow}>
              <View style={styles.goalIcon}><Text style={styles.goalEmoji}>{goal.icon}</Text></View>
              <Badge variant="neutral">{goal.availableMbogis} Mbogis</Badge>
            </View>
            <Text style={styles.goalTitle}>{goal.title} Goals</Text>
            <Text style={styles.goalDescription}>{goal.description}</Text>
            <View style={styles.metrics}>
              <Metric icon={<UsersRound color={colors.primary} size={17} />} value={`${goal.memberCount} members saving`} />
              <Metric icon={<WalletCards color={colors.primary} size={17} />} value={`${formatMoney(goal.totalTargetValue)} total target value`} />
              <Metric icon={<Store color={colors.primary} size={17} />} value={`${goal.partnerMerchants.length} partner merchant${goal.partnerMerchants.length === 1 ? '' : 's'}`} />
            </View>
            <View style={styles.goalFooter}>
              <Text style={styles.fromText}>From {formatMoney(goal.contributionFrom)} · {goal.typicalTimeline}</Text>
              <ArrowRight color={colors.primary} size={18} />
            </View>
          </Pressable>
        ))}
      </View>

      {selectedGoal ? (
        <View style={[styles.detailPanel, compact && styles.detailPanelCompact]}>
          <View style={styles.detailCopy}>
            <View style={styles.detailTitleRow}>
              <View>
                <Text style={styles.eyebrow}>SELECTED GOAL</Text>
                <Text style={styles.detailTitle}>{selectedGoal.icon} {selectedGoal.title} Goals</Text>
              </View>
              <Pressable accessibilityLabel="Close goal details" accessibilityRole="button" onPress={() => setSelectedGoal(null)} style={styles.closeButton}>
                <X color={colors.textMuted} size={18} />
              </Pressable>
            </View>
            <Text style={styles.detailText}>{selectedGoal.description}</Text>
            <View style={styles.detailStats}>
              <DetailStat label="Members saving" value={String(selectedGoal.memberCount)} />
              <DetailStat label="Total target value" value={formatMoney(selectedGoal.totalTargetValue)} />
              <DetailStat label="Available Mbogis" value={String(selectedGoal.availableMbogis)} />
              <DetailStat label="Typical timeline" value={selectedGoal.typicalTimeline} />
            </View>
          </View>

          <View style={styles.merchantPanel}>
            <View style={styles.merchantHeading}><Store color={colors.primary} size={18} /><Text style={styles.merchantTitle}>Partner merchants</Text></View>
            <Text style={styles.merchantDisclaimer}>Prototype merchant data for frontend validation only. No commercial partnership is implied.</Text>
            {selectedGoal.partnerMerchants.map((merchant) => (
              <MerchantRewardCard key={merchant.id} merchant={merchant} />
            ))}
            <Button fullWidth rightIcon={<ArrowRight color={colors.white} size={17} />} onPress={() => onStartMatching(selectedGoal)}>Find matching Chamas</Button>
          </View>
        </View>
      ) : null}
    </View>
  );
}

function Metric({ icon, value }: { icon: React.ReactNode; value: string }) {
  return <View style={styles.metricRow}>{icon}<Text style={styles.metricText}>{value}</Text></View>;
}

function DetailStat({ label, value }: { label: string; value: string }) {
  return <View style={styles.detailStat}><Text style={styles.detailStatLabel}>{label}</Text><Text style={styles.detailStatValue}>{value}</Text></View>;
}

const styles = StyleSheet.create({
  section: { gap: spacing.xl, paddingHorizontal: 20, paddingVertical: 82 },
  headingWrap: { alignItems: 'center', alignSelf: 'center', maxWidth: 760 },
  eyebrow: { color: colors.primary, fontSize: 11, fontWeight: typography.weights.bold, letterSpacing: 1.2 },
  title: { color: colors.navy, fontSize: 34, fontWeight: typography.weights.extrabold, letterSpacing: -0.7, marginTop: 8, textAlign: 'center' },
  subtitle: { color: colors.textMuted, fontSize: typography.sizes.body, lineHeight: 23, marginTop: 10, textAlign: 'center' },
  categoryTabs: { alignSelf: 'center', backgroundColor: colors.surfaceMuted, borderRadius: 999, flexDirection: 'row', flexWrap: 'wrap', gap: 4, padding: 5 },
  categoryTab: { borderRadius: 999, paddingHorizontal: 16, paddingVertical: 10 },
  categoryTabActive: { backgroundColor: colors.navy },
  categoryTabText: { color: colors.textMuted, fontSize: typography.sizes.caption, fontWeight: typography.weights.bold },
  categoryTabTextActive: { color: colors.white },
  pressed: { opacity: .86 },
  categoryIntro: { alignItems: 'center' },
  categoryTitle: { color: colors.text, fontSize: 20, fontWeight: typography.weights.bold },
  categoryDescription: { color: colors.textMuted, fontSize: typography.sizes.body, marginTop: 4, textAlign: 'center' },
  goalGrid: { alignSelf: 'center', flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, maxWidth: 1180, width: '100%' },
  goalCard: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.xl, borderWidth: 1, flexGrow: 1, flexBasis: 250, gap: spacing.sm, minWidth: 240, padding: spacing.lg },
  goalCardHover: { borderColor: colors.primaryLine, transform: [{ translateY: -2 }] },
  goalTopRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  goalIcon: { alignItems: 'center', backgroundColor: colors.primaryLight, borderRadius: radii.lg, height: 48, justifyContent: 'center', width: 48 },
  goalEmoji: { fontSize: 23 },
  goalTitle: { color: colors.text, fontSize: 20, fontWeight: typography.weights.extrabold, marginTop: 4 },
  goalDescription: { color: colors.textMuted, fontSize: typography.sizes.caption, lineHeight: 19, minHeight: 56 },
  metrics: { gap: 8, marginTop: spacing.xs },
  metricRow: { alignItems: 'center', flexDirection: 'row', gap: 8 },
  metricText: { color: colors.text, flex: 1, fontSize: typography.sizes.caption, fontWeight: typography.weights.semibold },
  goalFooter: { alignItems: 'center', borderTopColor: colors.border, borderTopWidth: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.sm, paddingTop: spacing.md },
  fromText: { color: colors.textMuted, fontSize: typography.sizes.caption, fontWeight: typography.weights.semibold },
  detailPanel: { alignSelf: 'center', backgroundColor: colors.navy, borderRadius: radii.xl, flexDirection: 'row', gap: spacing.xl, maxWidth: 1180, padding: 28, width: '100%' },
  detailPanelCompact: { flexDirection: 'column' },
  detailCopy: { flex: 1, minWidth: 260 },
  detailTitleRow: { alignItems: 'flex-start', flexDirection: 'row', justifyContent: 'space-between' },
  detailTitle: { color: colors.white, fontSize: 28, fontWeight: typography.weights.extrabold, marginTop: 6 },
  detailText: { color: '#C9CDDA', fontSize: typography.sizes.body, lineHeight: 22, marginTop: spacing.sm },
  detailStats: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginTop: spacing.lg },
  detailStat: { backgroundColor: 'rgba(255,255,255,.06)', borderColor: 'rgba(255,255,255,.08)', borderRadius: radii.md, borderWidth: 1, minWidth: 150, padding: spacing.md },
  detailStatLabel: { color: '#AEB4C6', fontSize: typography.sizes.caption },
  detailStatValue: { color: colors.white, fontSize: 16, fontWeight: typography.weights.bold, marginTop: 4 },
  closeButton: { alignItems: 'center', backgroundColor: 'rgba(255,255,255,.08)', borderRadius: 999, height: 36, justifyContent: 'center', width: 36 },
  merchantPanel: { backgroundColor: colors.surface, borderRadius: radii.lg, flex: 1, gap: spacing.sm, minWidth: 280, padding: spacing.lg },
  merchantHeading: { alignItems: 'center', flexDirection: 'row', gap: 8 },
  merchantTitle: { color: colors.text, fontSize: 17, fontWeight: typography.weights.bold },
  merchantDisclaimer: { backgroundColor: colors.warningSoft, borderRadius: radii.sm, color: colors.warning, fontSize: 9, lineHeight: 15, padding: spacing.sm },
  merchantRow: { alignItems: 'center', borderBottomColor: colors.border, borderBottomWidth: 1, flexDirection: 'row', gap: spacing.sm, paddingVertical: spacing.sm },
  merchantIcon: { alignItems: 'center', backgroundColor: colors.primaryLight, borderRadius: radii.sm, height: 34, justifyContent: 'center', width: 34 },
  merchantCopy: { flex: 1 },
  merchantName: { color: colors.text, fontSize: typography.sizes.body, fontWeight: typography.weights.bold },
  merchantOffer: { color: colors.textMuted, fontSize: typography.sizes.caption, lineHeight: 17, marginTop: 2 },
});
