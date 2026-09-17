import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CheckCircle2, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react-native';

import { colors } from '../../../theme/colors';
import { radii, spacing } from '../../../theme/layout';
import { typography } from '../../../theme/typography';

export interface TrustFactor {
  label: string;
  state: 'positive' | 'neutral' | 'attention';
  note: string;
}

interface TrustScoreCardProps {
  score: number;
  subjectLabel: string;
  factors?: TrustFactor[];
  compact?: boolean;
}

function scoreLevel(score: number) {
  if (score >= 85) return 'Strong';
  if (score >= 70) return 'Good';
  if (score >= 55) return 'Developing';
  return 'Needs attention';
}

export function TrustScoreCard({ score, subjectLabel, factors, compact = false }: TrustScoreCardProps) {
  const [expanded, setExpanded] = useState(false);
  const normalized = Math.max(0, Math.min(100, Math.round(score)));
  const level = scoreLevel(normalized);
  const defaultFactors = useMemo<TrustFactor[]>(() => [
    { label: 'Contribution consistency', state: normalized >= 75 ? 'positive' : 'neutral', note: 'Prototype indicator based on the member’s own contribution pattern.' },
    { label: 'Participation history', state: normalized >= 65 ? 'positive' : 'neutral', note: 'Prototype indicator for continuity in the selected Chama.' },
    { label: 'Commitment standing', state: 'positive', note: 'No unresolved commitment issue is represented in the current mock profile.' },
  ], [normalized]);
  const visibleFactors = factors ?? defaultFactors;

  return (
    <View style={[styles.card, compact && styles.cardCompact]}>
      <View style={styles.topRow}>
        <View style={styles.iconBox}><ShieldCheck color={colors.primary} size={20} /></View>
        <View style={styles.headingCopy}>
          <Text style={styles.eyebrow}>TRUST SCORE · PROTOTYPE</Text>
          <Text style={styles.subject} numberOfLines={1}>{subjectLabel}</Text>
        </View>
        <View style={styles.scoreWrap}>
          <Text style={styles.score}>{normalized}</Text>
          <Text style={styles.outOf}>/100</Text>
        </View>
      </View>

      <View style={styles.track}><View style={[styles.fill, { width: `${normalized}%` }]} /></View>
      <View style={styles.levelRow}>
        <Text style={styles.level}>{level}</Text>
        <Text style={styles.prototype}>UI mock — final formula/weights require backend product approval</Text>
      </View>

      {!compact ? (
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ expanded }}
          onPress={() => setExpanded((value) => !value)}
          style={({ pressed }) => [styles.disclosure, pressed && styles.pressed]}
        >
          <Text style={styles.disclosureText}>How this score is represented</Text>
          {expanded ? <ChevronUp color={colors.primary} size={17} /> : <ChevronDown color={colors.primary} size={17} />}
        </Pressable>
      ) : null}

      {expanded && !compact ? (
        <View style={styles.factorList}>
          {visibleFactors.map((factor) => (
            <View key={factor.label} style={styles.factorRow}>
              <CheckCircle2 color={factor.state === 'attention' ? colors.warning : factor.state === 'neutral' ? colors.textMuted : colors.success} size={16} />
              <View style={styles.factorCopy}>
                <Text style={styles.factorLabel}>{factor.label}</Text>
                <Text style={styles.factorNote}>{factor.note}</Text>
              </View>
            </View>
          ))}
          <Text style={styles.privacyNote}>Only the signed-in member’s own trust detail is shown here. Other members’ raw financial activity must never be exposed through this component.</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.lg, borderWidth: 1, gap: spacing.md, padding: spacing.lg },
  cardCompact: { padding: spacing.md },
  topRow: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm },
  iconBox: { alignItems: 'center', backgroundColor: colors.primaryLight, borderRadius: radii.md, height: 40, justifyContent: 'center', width: 40 },
  headingCopy: { flex: 1, minWidth: 0 },
  eyebrow: { color: colors.primary, fontSize: 10, fontWeight: typography.weights.bold, letterSpacing: .9 },
  subject: { color: colors.text, fontSize: typography.sizes.body, fontWeight: typography.weights.bold, marginTop: 2 },
  scoreWrap: { alignItems: 'baseline', flexDirection: 'row' },
  score: { color: colors.navy, fontSize: 28, fontWeight: typography.weights.extrabold },
  outOf: { color: colors.textMuted, fontSize: typography.sizes.caption, fontWeight: typography.weights.bold },
  track: { backgroundColor: colors.primaryLight, borderRadius: 99, height: 7, overflow: 'hidden' },
  fill: { backgroundColor: colors.primary, borderRadius: 99, height: '100%' },
  levelRow: { alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, justifyContent: 'space-between' },
  level: { color: colors.success, fontSize: typography.sizes.caption, fontWeight: typography.weights.bold },
  prototype: { color: colors.textSubtle, fontSize: typography.sizes.caption },
  disclosure: { alignItems: 'center', borderTopColor: colors.border, borderTopWidth: 1, flexDirection: 'row', justifyContent: 'space-between', paddingTop: spacing.md },
  disclosureText: { color: colors.primary, fontSize: typography.sizes.body, fontWeight: typography.weights.bold },
  pressed: { opacity: .72 },
  factorList: { gap: spacing.md },
  factorRow: { alignItems: 'flex-start', flexDirection: 'row', gap: spacing.sm },
  factorCopy: { flex: 1 },
  factorLabel: { color: colors.text, fontSize: typography.sizes.body, fontWeight: typography.weights.bold },
  factorNote: { color: colors.textMuted, fontSize: typography.sizes.caption, lineHeight: 18, marginTop: 2 },
  privacyNote: { backgroundColor: colors.surfaceMuted, borderRadius: radii.md, color: colors.textMuted, fontSize: typography.sizes.caption, lineHeight: 18, padding: spacing.md },
});
