import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { ArrowLeft, ArrowRight, Check, Clock3, Target, UsersRound, WalletCards } from 'lucide-react-native';

import { MduaraBrand } from '../../components/brand/MduaraBrand';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { publicChamas, type PublicChama, type SavingGoal } from '../../shared/prototype';
import { colors } from '../../theme/colors';
import { radii, spacing } from '../../theme/layout';
import { typography } from '../../theme/typography';

interface GoalMatchingFlowProps {
  goal: SavingGoal;
  onBack: () => void;
  onViewChama: (chama: PublicChama) => void;
}

type Step = 'plan' | 'matches';

const timelineOptions = [6, 9, 12, 18] as const;

function formatMoney(value: number) {
  return `KSh ${value.toLocaleString('en-KE')}`;
}

function normalizedCategory(goal: SavingGoal) {
  if (goal.categoryCode === 'HOME_APPLIANCES') return 'home appliances';
  if (goal.categoryCode === 'TRAVEL') return 'travel';
  if (goal.categoryCode === 'EDUCATION') return 'education';
  return 'personal';
}

function scoreChama(chama: PublicChama, goal: SavingGoal, monthlyContribution: number, months: number) {
  const targetCategory = normalizedCategory(goal);
  const chamaCategory = chama.goalCategory.toLowerCase();
  const chamaGoal = `${chama.goal} ${chama.name}`.toLowerCase();
  const title = goal.title.toLowerCase();

  let score = 0;
  if (chamaCategory.includes(targetCategory)) score += 52;
  if (chamaGoal.includes(title)) score += 28;

  const contributionGap = Math.abs(chama.contributionAmount - monthlyContribution);
  if (contributionGap <= 1000) score += 14;
  else if (contributionGap <= 3000) score += 9;
  else if (contributionGap <= 6000) score += 4;

  const durationGap = Math.abs(chama.durationMonths - months);
  if (durationGap <= 2) score += 6;
  else if (durationGap <= 6) score += 3;

  return Math.min(99, score);
}

export function GoalMatchingFlow({ goal, onBack, onViewChama }: GoalMatchingFlowProps) {
  const { width } = useWindowDimensions();
  const compact = width < 760;
  const [step, setStep] = useState<Step>('plan');
  const [targetAmount, setTargetAmount] = useState(String(Math.max(goal.contributionFrom * 10, Math.round(goal.totalTargetValue / Math.max(1, goal.memberCount)))));
  const [monthlyContribution, setMonthlyContribution] = useState(String(goal.contributionFrom));
  const [timelineMonths, setTimelineMonths] = useState<number>(12);
  const [error, setError] = useState<string | null>(null);

  const matches = useMemo(() => {
    const monthly = Number(monthlyContribution) || 0;
    return publicChamas
      .filter((chama) => chama.recruitmentStatus !== 'Closed' && chama.entryMode !== 'PRIVATE')
      .map((chama) => ({ chama, score: scoreChama(chama, goal, monthly, timelineMonths) }))
      .filter((item) => item.score >= 35)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);
  }, [goal, monthlyContribution, timelineMonths]);

  const continueToMatches = () => {
    const target = Number(targetAmount);
    const monthly = Number(monthlyContribution);
    if (!Number.isFinite(target) || target <= 0) {
      setError('Enter a valid personal target amount.');
      return;
    }
    if (!Number.isFinite(monthly) || monthly <= 0) {
      setError('Enter a valid monthly contribution amount.');
      return;
    }
    if (monthly > target) {
      setError('Monthly contribution should not be greater than your total target.');
      return;
    }
    setError(null);
    setStep('matches');
  };

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={[styles.topbar, compact && styles.topbarCompact]}>
        <MduaraBrand variant="wordmark" width={compact ? 148 : 170} />
        <Pressable accessibilityRole="button" onPress={step === 'matches' ? () => setStep('plan') : onBack} style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}>
          <ArrowLeft size={17} color={colors.navy} />
          <Text style={styles.backText}>{step === 'matches' ? 'Back to savings plan' : 'Back to marketplace'}</Text>
        </Pressable>
      </View>

      <View style={styles.shell}>
        <View style={styles.progressRow}>
          <StepMarker number="1" label="Goal" done active={false} />
          <View style={styles.progressLine} />
          <StepMarker number="2" label="Savings plan" done={step === 'matches'} active={step === 'plan'} />
          <View style={styles.progressLine} />
          <StepMarker number="3" label="Matches" done={false} active={step === 'matches'} />
        </View>

        <View style={styles.goalSummary}>
          <View style={styles.goalIcon}><Text style={styles.goalEmoji}>{goal.icon}</Text></View>
          <View style={styles.goalCopy}>
            <Text style={styles.eyebrow}>YOUR SELECTED GOAL</Text>
            <Text style={styles.goalTitle}>{goal.title}</Text>
            <Text style={styles.goalText}>{goal.description}</Text>
          </View>
          <View style={styles.goalMeta}><Badge variant="brand">{goal.memberCount} saving</Badge><Badge variant="neutral">{goal.availableMbogis} Mbogis</Badge></View>
        </View>

        {step === 'plan' ? (
          <View style={[styles.planLayout, compact && styles.stack]}>
            <View style={styles.formCard}>
              <Text style={styles.sectionTitle}>Tell us what fits your budget.</Text>
              <Text style={styles.sectionText}>These values are used only to rank the mock Chamas in this frontend prototype. They are preserved when you move back and forth.</Text>
              <Input
                keyboardType="number-pad"
                label="Personal target amount (KSh)"
                onChangeText={(value) => { setTargetAmount(value.replace(/\D/g, '')); setError(null); }}
                placeholder="e.g. 45000"
                value={targetAmount}
              />
              <Input
                keyboardType="number-pad"
                label="Comfortable monthly contribution (KSh)"
                onChangeText={(value) => { setMonthlyContribution(value.replace(/\D/g, '')); setError(null); }}
                placeholder="e.g. 5000"
                value={monthlyContribution}
              />
              <View>
                <Text style={styles.inputLabel}>Preferred timeline</Text>
                <View style={styles.timelineRow}>
                  {timelineOptions.map((months) => {
                    const active = timelineMonths === months;
                    return (
                      <Pressable key={months} onPress={() => setTimelineMonths(months)} style={({ pressed }) => [styles.timelineOption, active && styles.timelineOptionActive, pressed && styles.pressed]}>
                        <Text style={[styles.timelineText, active && styles.timelineTextActive]}>{months} months</Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
              {error ? <Text style={styles.error}>{error}</Text> : null}
              <Button fullWidth rightIcon={<ArrowRight color={colors.white} size={17} />} onPress={continueToMatches}>Find my matches</Button>
            </View>

            <View style={styles.explainCard}>
              <Text style={styles.explainTitle}>How matching works in Phase 1</Text>
              <Explain icon={<Target color={colors.primary} size={18} />} title="Same goal first" body="Goal compatibility carries the most weight." />
              <Explain icon={<WalletCards color={colors.primary} size={18} />} title="Contribution fit" body="We compare what you can comfortably contribute with the Chama plan." />
              <Explain icon={<Clock3 color={colors.primary} size={18} />} title="Timeline fit" body="Similar durations rank higher so the group plan remains practical." />
              <Explain icon={<UsersRound color={colors.primary} size={18} />} title="Joinable groups only" body="Closed and invite-only Chamas are not shown as open matches." />
            </View>
          </View>
        ) : (
          <View style={styles.matchesBlock}>
            <View style={styles.matchHeading}>
              <View>
                <Text style={styles.eyebrow}>MATCHING RESULTS</Text>
                <Text style={styles.matchTitle}>Best available Chamas for {goal.title}</Text>
                <Text style={styles.sectionText}>Ranked by goal, contribution and timeline compatibility using frontend mock data.</Text>
              </View>
              <Button variant="secondary" onPress={() => setStep('plan')}>Adjust plan</Button>
            </View>

            {matches.length ? (
              <View style={styles.matchList}>
                {matches.map(({ chama, score }, index) => (
                  <View key={chama.id} style={styles.matchCard}>
                    <View style={styles.rank}><Text style={styles.rankText}>{index + 1}</Text></View>
                    <View style={styles.matchCopy}>
                      <View style={styles.matchTitleRow}>
                        <Text style={styles.chamaName}>{chama.name}</Text>
                        <Badge variant={score >= 75 ? 'success' : 'brand'}>{score}% match</Badge>
                      </View>
                      <Text style={styles.chamaGoal}>{chama.goal}</Text>
                      <View style={styles.matchMeta}>
                        <Text style={styles.metaText}>{chama.members}/{chama.capacity} members</Text>
                        <Text style={styles.metaText}>{formatMoney(chama.contributionAmount)} / {chama.contributionFrequency.toLowerCase()}</Text>
                        <Text style={styles.metaText}>{chama.durationMonths} months</Text>
                        <Text style={styles.metaText}>{chama.entryMode}</Text>
                      </View>
                    </View>
                    <Button variant={index === 0 ? 'primary' : 'secondary'} onPress={() => onViewChama(chama)}>View Chama</Button>
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.empty}>
                <Target color={colors.primary} size={28} />
                <Text style={styles.emptyTitle}>No strong open match yet</Text>
                <Text style={styles.emptyText}>Your goal is valid, but the current mock catalog does not have a compatible open Chama for this savings plan. Adjust the plan or return to the marketplace.</Text>
                <View style={styles.emptyActions}><Button variant="secondary" onPress={() => setStep('plan')}>Adjust plan</Button><Button onPress={onBack}>Choose another goal</Button></View>
              </View>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

function StepMarker({ active, done, label, number }: { active: boolean; done: boolean; label: string; number: string }) {
  return (
    <View style={styles.stepMarker}>
      <View style={[styles.stepCircle, active && styles.stepCircleActive, done && styles.stepCircleDone]}>{done ? <Check color={colors.white} size={14} /> : <Text style={[styles.stepNumber, (active || done) && styles.stepNumberActive]}>{number}</Text>}</View>
      <Text style={[styles.stepLabel, active && styles.stepLabelActive]}>{label}</Text>
    </View>
  );
}

function Explain({ body, icon, title }: { body: string; icon: React.ReactNode; title: string }) {
  return <View style={styles.explainRow}><View style={styles.explainIcon}>{icon}</View><View style={styles.explainCopy}><Text style={styles.explainRowTitle}>{title}</Text><Text style={styles.explainRowBody}>{body}</Text></View></View>;
}

const styles = StyleSheet.create({
  page: { backgroundColor: colors.background, flex: 1 },
  content: { paddingBottom: 60 },
  topbar: { alignItems: 'center', backgroundColor: colors.surface, borderBottomColor: colors.border, borderBottomWidth: 1, flexDirection: 'row', justifyContent: 'space-between', minHeight: 76, paddingHorizontal: 28 },
  topbarCompact: { minHeight: 68, paddingHorizontal: 16 },
  backButton: { alignItems: 'center', borderRadius: radii.md, flexDirection: 'row', gap: 8, paddingHorizontal: 12, paddingVertical: 10 },
  backText: { color: colors.navy, fontSize: typography.sizes.body, fontWeight: typography.weights.semibold },
  pressed: { opacity: .78 },
  shell: { alignSelf: 'center', maxWidth: 1100, paddingHorizontal: 20, paddingTop: 28, width: '100%' },
  progressRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'center', marginBottom: spacing.xl },
  progressLine: { backgroundColor: colors.primaryLine, height: 2, marginHorizontal: 8, maxWidth: 100, minWidth: 30, flex: 1 },
  stepMarker: { alignItems: 'center', gap: 5 },
  stepCircle: { alignItems: 'center', backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 999, borderWidth: 1, height: 30, justifyContent: 'center', width: 30 },
  stepCircleActive: { backgroundColor: colors.primaryLight, borderColor: colors.primary },
  stepCircleDone: { backgroundColor: colors.primary, borderColor: colors.primary },
  stepNumber: { color: colors.textMuted, fontSize: 11, fontWeight: typography.weights.bold },
  stepNumberActive: { color: colors.primaryDark },
  stepLabel: { color: colors.textMuted, fontSize: 10, fontWeight: typography.weights.semibold },
  stepLabelActive: { color: colors.primary, fontWeight: typography.weights.bold },
  goalSummary: { alignItems: 'center', backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.xl, borderWidth: 1, flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, padding: spacing.lg },
  goalIcon: { alignItems: 'center', backgroundColor: colors.primaryLight, borderRadius: radii.lg, height: 54, justifyContent: 'center', width: 54 },
  goalEmoji: { fontSize: 25 },
  goalCopy: { flex: 1, minWidth: 220 },
  eyebrow: { color: colors.primary, fontSize: 10, fontWeight: typography.weights.bold, letterSpacing: 1 },
  goalTitle: { color: colors.navy, fontSize: 22, fontWeight: typography.weights.extrabold, marginTop: 3 },
  goalText: { color: colors.textMuted, fontSize: typography.sizes.caption, lineHeight: 18, marginTop: 4 },
  goalMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: 5 },
  planLayout: { flexDirection: 'row', gap: spacing.lg, marginTop: spacing.lg },
  stack: { flexDirection: 'column' },
  formCard: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.xl, borderWidth: 1, flex: 1.1, gap: spacing.md, padding: spacing.xl },
  explainCard: { backgroundColor: colors.brandCanvas, borderColor: colors.primaryLine, borderRadius: radii.xl, borderWidth: 1, flex: .9, gap: spacing.md, padding: spacing.xl },
  sectionTitle: { color: colors.navy, fontSize: 22, fontWeight: typography.weights.extrabold },
  sectionText: { color: colors.textMuted, fontSize: typography.sizes.body, lineHeight: 21, marginTop: 4 },
  inputLabel: { color: colors.text, fontSize: typography.sizes.caption, fontWeight: typography.weights.bold, marginBottom: 8 },
  timelineRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  timelineOption: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.md, borderWidth: 1, paddingHorizontal: 13, paddingVertical: 9 },
  timelineOptionActive: { backgroundColor: colors.primaryLight, borderColor: colors.primary },
  timelineText: { color: colors.textMuted, fontSize: typography.sizes.caption, fontWeight: typography.weights.semibold },
  timelineTextActive: { color: colors.primaryDark },
  error: { color: colors.danger, fontSize: typography.sizes.caption, fontWeight: typography.weights.semibold },
  explainTitle: { color: colors.navy, fontSize: 18, fontWeight: typography.weights.extrabold },
  explainRow: { alignItems: 'flex-start', flexDirection: 'row', gap: spacing.sm },
  explainIcon: { alignItems: 'center', backgroundColor: colors.surface, borderRadius: radii.md, height: 38, justifyContent: 'center', width: 38 },
  explainCopy: { flex: 1 },
  explainRowTitle: { color: colors.text, fontSize: typography.sizes.body, fontWeight: typography.weights.bold },
  explainRowBody: { color: colors.textMuted, fontSize: typography.sizes.caption, lineHeight: 18, marginTop: 2 },
  matchesBlock: { marginTop: spacing.lg },
  matchHeading: { alignItems: 'flex-start', flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, justifyContent: 'space-between' },
  matchTitle: { color: colors.navy, fontSize: 26, fontWeight: typography.weights.extrabold, marginTop: 5 },
  matchList: { gap: spacing.sm, marginTop: spacing.lg },
  matchCard: { alignItems: 'center', backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.lg, borderWidth: 1, flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, padding: spacing.lg },
  rank: { alignItems: 'center', backgroundColor: colors.navy, borderRadius: 999, height: 34, justifyContent: 'center', width: 34 },
  rankText: { color: colors.white, fontSize: 12, fontWeight: typography.weights.bold },
  matchCopy: { flex: 1, minWidth: 260 },
  matchTitleRow: { alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chamaName: { color: colors.text, fontSize: 18, fontWeight: typography.weights.extrabold },
  chamaGoal: { color: colors.textMuted, fontSize: typography.sizes.caption, marginTop: 3 },
  matchMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 9 },
  metaText: { color: colors.textMuted, fontSize: typography.sizes.caption, fontWeight: typography.weights.semibold },
  empty: { alignItems: 'center', backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.xl, borderWidth: 1, gap: spacing.sm, marginTop: spacing.xl, padding: 40 },
  emptyTitle: { color: colors.text, fontSize: 20, fontWeight: typography.weights.extrabold },
  emptyText: { color: colors.textMuted, fontSize: typography.sizes.body, lineHeight: 21, maxWidth: 560, textAlign: 'center' },
  emptyActions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.sm },
});
